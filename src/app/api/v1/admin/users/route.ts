import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { query, withTransaction } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError, ConflictError } from "@/shared/errors/app-error";
import { hashPassword } from "better-auth/crypto";
import { validatePasswordRules } from "@/shared/utils/validator";
import { sendStaffInviteEmail } from "@/lib/email";
import type { RowDataPacket } from "mysql2/promise";
import crypto from "crypto";

interface UserListRow extends RowDataPacket {
    id: string;
    name: string;
    email: string;
    username: string;
    role: "SISWA" | "TIM_KURIKULUM" | "SUPERADMIN";
    emailVerified: number | boolean;
    hasGoogle: number | boolean;
    hasPassword: number | boolean;
    createdAt: Date;
    updatedAt: Date;
}

async function resolveUniqueStaffUsername(rawUsername: string | undefined, email: string): Promise<string> {
    if (rawUsername && rawUsername.trim().length > 0) {
        const cleaned = rawUsername.trim().toLowerCase();
        if (!/^[a-z0-9_]{3,16}$/.test(cleaned)) {
            throw new BadRequestError(
                "Username harus terdiri dari 3–16 karakter huruf kecil, angka, atau garis bawah (_).",
                "INVALID_USERNAME"
            );
        }
        const existing = await query<RowDataPacket[]>(
            `SELECT id FROM users WHERE username = ? LIMIT 1`,
            [cleaned]
        );
        if (existing.length > 0) {
            throw new BadRequestError("Username tersebut sudah digunakan.", "DUPLICATE_USERNAME");
        }
        return cleaned;
    }

    const emailPrefix = (email.split("@")[0] || "staf")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
    let baseCandidate = (emailPrefix.length >= 3 ? emailPrefix : `staf_${emailPrefix || "agra"}`)
        .slice(0, 16)
        .replace(/_+$/g, "");
    if (baseCandidate.length < 3) {
        baseCandidate = "staf_agra";
    }

    const existingBase = await query<RowDataPacket[]>(
        `SELECT id FROM users WHERE username = ? LIMIT 1`,
        [baseCandidate]
    );
    if (existingBase.length === 0) {
        return baseCandidate;
    }

    const prefix = baseCandidate.slice(0, 11).replace(/_+$/g, "") || "staf";
    for (let attempt = 0; attempt < 10; attempt++) {
        const suffix = Math.floor(1000 + Math.random() * 9000);
        const candidate = `${prefix}_${suffix}`.slice(0, 16);
        const rows = await query<RowDataPacket[]>(
            `SELECT id FROM users WHERE username = ? LIMIT 1`,
            [candidate]
        );
        if (rows.length === 0) {
            return candidate;
        }
    }

    return `staf_${Date.now().toString(36).slice(-8)}`.slice(0, 16);
}

export async function GET(req: NextRequest) {
    try {
        await requireRole(["SUPERADMIN", "TIM_KURIKULUM"]);
        const url = new URL(req.url);
        const role = url.searchParams.get("role");

        let sql = `
            SELECT u.id, u.name, u.email, u.username, u.role, u.emailVerified, u.createdAt, u.updatedAt,
                EXISTS(SELECT 1 FROM account a WHERE a.userId = u.id AND a.providerId = 'google') AS hasGoogle,
                EXISTS(SELECT 1 FROM account a WHERE a.userId = u.id AND a.providerId = 'credential' AND a.password IS NOT NULL) AS hasPassword
            FROM users u
        `;
        const params: string[] = [];

        if (role) {
            sql += ` WHERE u.role = ?`;
            params.push(role);
        }
        sql += ` ORDER BY u.createdAt DESC`;

        const rows = await query<UserListRow[]>(sql, params);
        const users = rows.map((u) => ({
            ...u,
            emailVerified: Boolean(u.emailVerified),
            hasGoogle: Boolean(u.hasGoogle),
            hasPassword: Boolean(u.hasPassword),
        }));

        return jsonResponse({
            success: true,
            data: users,
        });
    } catch (error) {
        return errorResponse(error, "status");
    }
}

export async function POST(req: NextRequest) {
    try {
        const { user: currentAdmin } = await requireRole("SUPERADMIN");
        const body = await req.json();
        const { name, email, username, role, password } = body;

        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        if (!normalizedEmail || !normalizedEmail.includes("@")) {
            throw new BadRequestError("Alamat email wajib diisi dengan format yang valid.", "VALIDATION_ERROR");
        }

        if (!role || !["TIM_KURIKULUM", "SUPERADMIN"].includes(role)) {
            throw new BadRequestError("Role harus TIM_KURIKULUM atau SUPERADMIN.", "INVALID_ROLE");
        }

        const hasInitialPassword = typeof password === "string" && password.length > 0;
        if (hasInitialPassword) {
            const passwordCheck = validatePasswordRules(password);
            if (!passwordCheck.isValid) {
                throw new BadRequestError(
                    passwordCheck.message || "Format password tidak valid.",
                    "INVALID_PASSWORD"
                );
            }
        }

        const existingByEmail = await query<
            Array<RowDataPacket & { id: string; name: string; email: string; username: string; role: string }>
        >(`SELECT id, name, email, username, role FROM users WHERE email = ? LIMIT 1`, [normalizedEmail]);

        if (existingByEmail.length > 0) {
            const existing = existingByEmail[0];
            if (existing.role === "SISWA") {
                const targetRoleLabel = role === "SUPERADMIN" ? "SuperAdmin" : "Tim Kurikulum";
                throw new ConflictError(
                    `Email ${normalizedEmail} sudah terdaftar sebagai akun Siswa (${existing.name}). Anda dapat mengubah peran akun siswa tersebut menjadi ${targetRoleLabel}.`,
                    "EMAIL_ALREADY_STUDENT",
                    {
                        existingUser: {
                            id: existing.id,
                            name: existing.name,
                            email: existing.email,
                            username: existing.username,
                            role: existing.role,
                        },
                        targetRole: role,
                    }
                );
            }

            throw new BadRequestError(
                `Email ${normalizedEmail} sudah terdaftar sebagai anggota tim (${existing.role}).`,
                "DUPLICATE_USER"
            );
        }

        const rawName = typeof name === "string" ? name.trim() : "";
        const derivedNameFromEmail = normalizedEmail
            .split("@")[0]
            .replace(/[^a-zA-Z0-9 ]/g, " ")
            .trim();
        const finalName =
            rawName.length >= 3
                ? rawName.slice(0, 30)
                : derivedNameFromEmail.length >= 3
                  ? derivedNameFromEmail.slice(0, 30)
                  : role === "SUPERADMIN"
                    ? "SuperAdmin Baru"
                    : "Tim Kurikulum";

        const finalUsername = await resolveUniqueStaffUsername(username, normalizedEmail);
        const userId = crypto.randomUUID();
        const accountId = crypto.randomUUID();
        const hashedPassword = hasInitialPassword ? await hashPassword(password) : null;

        await withTransaction(async (conn) => {
            await conn.execute(
                `INSERT INTO users (id, name, email, username, role, emailVerified, createdAt, updatedAt)
                 VALUES (?, ?, ?, ?, ?, TRUE, NOW(), NOW())`,
                [userId, finalName, normalizedEmail, finalUsername, role]
            );

            if (hashedPassword) {
                await conn.execute(
                    `INSERT INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt)
                     VALUES (?, ?, 'credential', ?, ?, NOW(), NOW())`,
                    [accountId, userId, userId, hashedPassword]
                );
            }
        });

        const origin = new URL(req.url).origin;
        const emailSent = await sendStaffInviteEmail({
            to: normalizedEmail,
            userName: finalName,
            role,
            inviterName: currentAdmin.name || "SuperAdmin Platform AGRA",
            loginUrl: `${origin}/login?as=staff`,
            forgotPasswordUrl: `${origin}/forgot-password`,
        });

        return jsonResponse(
            {
                success: true,
                emailSent,
                message: emailSent
                    ? `Undangan untuk ${finalName} (${role}) berhasil dibuat dan dikirim ke ${normalizedEmail}.`
                    : `Akun ${finalName} (${role}) berhasil dibuat. (Email undangan dicatat di log server karena SMTP belum aktif).`,
                data: {
                    id: userId,
                    name: finalName,
                    email: normalizedEmail,
                    username: finalUsername,
                    role,
                    emailSent,
                },
            },
            201
        );
    } catch (error) {
        return errorResponse(error, "status");
    }
}
