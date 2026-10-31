import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { query, withTransaction } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError } from "@/shared/errors/app-error";
import { hashPassword } from "better-auth/crypto";
import { validatePasswordRules } from "@/shared/utils/validator";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    try {
        await requireRole(["SUPERADMIN", "TIM_KURIKULUM"]);
        const url = new URL(req.url);
        const role = url.searchParams.get("role");

        let sql = `SELECT id, name, email, username, role, emailVerified, createdAt, updatedAt FROM users`;
        const params: string[] = [];

        if (role) {
            sql += ` WHERE role = ?`;
            params.push(role);
        }
        sql += ` ORDER BY createdAt DESC`;

        const users = await query<any[]>(sql, params);
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
        await requireRole("SUPERADMIN");
        const body = await req.json();
        const { name, email, username, role, password } = body;

        if (!name || !email || !role || !password) {
            throw new BadRequestError("Nama, email, role, dan password wajib diisi.", "VALIDATION_ERROR");
        }

        if (!["TIM_KURIKULUM", "SUPERADMIN"].includes(role)) {
            throw new BadRequestError("Role harus TIM_KURIKULUM atau SUPERADMIN.", "INVALID_ROLE");
        }

        const passwordCheck = validatePasswordRules(password);
        if (!passwordCheck.isValid) {
            throw new BadRequestError(passwordCheck.message || "Format password tidak valid.", "INVALID_PASSWORD");
        }

        // Insert or check duplicate
        const existing = await query<any[]>(`SELECT id FROM users WHERE email = ? OR username = ?`, [email, username || ""]);
        if (existing.length > 0) {
            throw new BadRequestError("Email atau username sudah terdaftar.", "DUPLICATE_USER");
        }

        const userId = crypto.randomUUID();
        const accountId = crypto.randomUUID();
        const hashedPassword = await hashPassword(password);

        await withTransaction(async (conn) => {
            await conn.execute(
                `INSERT INTO users (id, name, email, username, role, emailVerified, createdAt, updatedAt)
                 VALUES (?, ?, ?, ?, ?, TRUE, NOW(), NOW())`,
                [userId, name.trim(), email.trim(), (username || email.split("@")[0]).trim(), role]
            );

            await conn.execute(
                `INSERT INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt)
                 VALUES (?, ?, 'credential', ?, ?, NOW(), NOW())`,
                [accountId, userId, userId, hashedPassword]
            );
        });

        return jsonResponse(
            {
                success: true,
                message: "Pengguna berhasil dibuat.",
                data: { id: userId, name: name.trim(), email: email.trim(), role },
            },
            201
        );
    } catch (error) {
        return errorResponse(error, "status");
    }
}

