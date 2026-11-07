import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { query, withTransaction } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError, NotFoundError } from "@/shared/errors/app-error";
import { hashPassword } from "better-auth/crypto";
import { validatePasswordRules } from "@/shared/utils/validator";
import { sendStaffInviteEmail } from "@/lib/email";
import type { RowDataPacket } from "mysql2/promise";
import crypto from "crypto";

interface ExistingUserRow extends RowDataPacket {
    id: string;
    name: string;
    email: string;
    username: string;
    role: "SISWA" | "TIM_KURIKULUM" | "SUPERADMIN";
}

interface CountRow extends RowDataPacket {
    total: number;
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { user: currentAdmin } = await requireRole("SUPERADMIN");
        const { userId } = await params;
        const body = await req.json();
        const { role, name, email, password, purgeStudentData } = body;

        const users = await query<ExistingUserRow[]>(
            `SELECT id, name, email, username, role FROM users WHERE id = ? LIMIT 1`,
            [userId]
        );
        if (users.length === 0) {
            throw new NotFoundError("Pengguna tidak ditemukan.", "NOT_FOUND");
        }
        const targetUser = users[0];

        const updates: string[] = [];
        const paramsList: (string | number)[] = [];

        if (role) {
            if (!["SISWA", "TIM_KURIKULUM", "SUPERADMIN"].includes(role)) {
                throw new BadRequestError("Role tidak valid.", "INVALID_ROLE");
            }

            if (userId === currentAdmin.id && role !== "SUPERADMIN") {
                throw new BadRequestError(
                    "Anda tidak dapat menurunkan peran SuperAdmin pada akun Anda sendiri.",
                    "SELF_DEMOTION_FORBIDDEN"
                );
            }

            if (targetUser.role === "SUPERADMIN" && role !== "SUPERADMIN") {
                const countRows = await query<CountRow[]>(
                    `SELECT COUNT(*) AS total FROM users WHERE role = 'SUPERADMIN'`
                );
                if ((countRows[0]?.total || 0) <= 1) {
                    throw new BadRequestError(
                        "Tidak dapat menurunkan SuperAdmin terakhir di platform.",
                        "LAST_SUPERADMIN_FORBIDDEN"
                    );
                }
            }

            updates.push("role = ?");
            paramsList.push(role);
        }

        if (typeof name === "string" && name.trim().length > 0) {
            const trimmedName = name.trim();
            if (trimmedName.length < 3 || trimmedName.length > 30) {
                throw new BadRequestError("Nama harus terdiri dari 3–30 karakter.", "INVALID_NAME");
            }
            updates.push("name = ?");
            paramsList.push(trimmedName);
        }

        let isEmailChanged = false;
        let finalTargetEmail = targetUser.email.toLowerCase();
        if (typeof email === "string" && email.trim().length > 0) {
            const normalizedEmail = email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (normalizedEmail.length > 191 || !emailRegex.test(normalizedEmail)) {
                throw new BadRequestError("Format alamat email tidak valid.", "INVALID_EMAIL");
            }
            if (normalizedEmail !== targetUser.email.toLowerCase()) {
                const duplicateRows = await query<
                    Array<RowDataPacket & { id: string; role: string; emailVerified: number | boolean }>
                >(
                    `SELECT id, role, emailVerified FROM users WHERE email = ? AND id != ? LIMIT 1`,
                    [normalizedEmail, userId]
                );
                if (duplicateRows.length > 0) {
                    const dup = duplicateRows[0];
                    if (dup.role === "SISWA" && !dup.emailVerified) {
                        await withTransaction(async (conn) => {
                            await conn.execute(`DELETE FROM user_profiles WHERE user_id = ?`, [dup.id]);
                            await conn.execute(`DELETE FROM account WHERE userId = ?`, [dup.id]);
                            await conn.execute(`DELETE FROM users WHERE id = ? AND emailVerified = 0`, [dup.id]);
                        });
                    } else {
                        throw new BadRequestError(
                            "Alamat email tersebut sudah digunakan oleh pengguna lain.",
                            "EMAIL_ALREADY_USED"
                        );
                    }
                }
                updates.push("email = ?", "emailVerified = TRUE");
                paramsList.push(normalizedEmail);
                isEmailChanged = true;
                finalTargetEmail = normalizedEmail;
            }
        }

        let hashedPassword: string | null = null;
        if (password) {
            const passwordCheck = validatePasswordRules(password);
            if (!passwordCheck.isValid) {
                throw new BadRequestError(
                    passwordCheck.message || "Format password tidak valid.",
                    "INVALID_PASSWORD"
                );
            }
            hashedPassword = await hashPassword(password);
        }

        if (updates.length === 0 && !hashedPassword && !purgeStudentData) {
            throw new BadRequestError("Tidak ada data yang diperbarui.", "NO_UPDATES");
        }

        const isRoleChanged = Boolean(role && role !== targetUser.role);
        const isPromotingStudentToStaff =
            targetUser.role === "SISWA" && (role === "TIM_KURIKULUM" || role === "SUPERADMIN");
        const shouldPurgeStudentData = isPromotingStudentToStaff && Boolean(purgeStudentData);

        await withTransaction(async (conn) => {
            if (shouldPurgeStudentData) {
                await conn.execute(`DELETE FROM xp_transactions WHERE user_id = ?`, [userId]);
                await conn.execute(`DELETE FROM student_sub_material_progress WHERE user_id = ?`, [userId]);
                await conn.execute(`DELETE FROM learning_sessions WHERE user_id = ?`, [userId]);
                await conn.execute(`DELETE FROM user_profiles WHERE user_id = ?`, [userId]);
            } else if (role === "SISWA" && targetUser.role !== "SISWA") {
                await conn.execute(
                    `INSERT IGNORE INTO user_profiles (user_id, preset_avatar_id, current_milestone_tier_id, total_xp, is_recall_passed)
                     VALUES (?, NULL, 1, 0, 0)`,
                    [userId]
                );
            }

            if (hashedPassword) {
                const [existingAccount] = await conn.query<RowDataPacket[]>(
                    `SELECT id FROM account WHERE userId = ? AND providerId = 'credential'`,
                    [userId]
                );
                if (Array.isArray(existingAccount) && existingAccount.length > 0) {
                    await conn.execute(
                        `UPDATE account SET password = ?, updatedAt = NOW() WHERE id = ?`,
                        [hashedPassword, existingAccount[0].id]
                    );
                } else {
                    const accountId = crypto.randomUUID();
                    await conn.execute(
                        `INSERT INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt)
                         VALUES (?, ?, 'credential', ?, ?, NOW(), NOW())`,
                        [accountId, userId, userId, hashedPassword]
                    );
                }
            }

            if (updates.length > 0) {
                await conn.execute(
                    `UPDATE users SET ${updates.join(", ")}, updatedAt = NOW() WHERE id = ?`,
                    [...paramsList, userId]
                );
            }

            if (isEmailChanged) {
                await conn.execute(
                    `DELETE FROM account WHERE userId = ? AND providerId = 'google'`,
                    [userId]
                );
            }

            if ((isRoleChanged || isEmailChanged) && userId !== currentAdmin.id) {
                await conn.execute(`DELETE FROM session WHERE userId = ?`, [userId]);
            }
        });

        if (isPromotingStudentToStaff && (role === "TIM_KURIKULUM" || role === "SUPERADMIN")) {
            const origin = new URL(req.url).origin;
            const targetDisplayName =
                typeof name === "string" && name.trim().length >= 3
                    ? name.trim()
                    : targetUser.name || "Rekan Tim AGRA";
            await sendStaffInviteEmail({
                to: finalTargetEmail,
                userName: targetDisplayName,
                role,
                inviterName: currentAdmin.name || "SuperAdmin Platform AGRA",
                loginUrl: `${origin}/login?as=staff`,
                forgotPasswordUrl: `${origin}/forgot-password?as=staff`,
            }).catch((err) => {
                console.error("[ADMIN USERS] Gagal mengirim email undangan saat promosi peran:", err);
            });
        }

        return jsonResponse({
            success: true,
            purgedStudentData: shouldPurgeStudentData,
            message: shouldPurgeStudentData
                ? "Peran pengguna berhasil diperbarui, email undangan staf dikirim, dan data belajar siswa telah dihapus bersih."
                : isPromotingStudentToStaff
                  ? "Peran pengguna berhasil diubah menjadi staf dan email undangan telah dikirim."
                  : "Data pengguna berhasil diperbarui.",
        });
    } catch (error) {
        return errorResponse(error, "status");
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { user: currentAdmin } = await requireRole("SUPERADMIN");
        const { userId } = await params;

        if (userId === currentAdmin.id) {
            throw new BadRequestError(
                "Anda tidak dapat menghapus akun SuperAdmin Anda sendiri.",
                "SELF_DELETE_FORBIDDEN"
            );
        }

        const users = await query<ExistingUserRow[]>(
            `SELECT id, role FROM users WHERE id = ? LIMIT 1`,
            [userId]
        );
        if (users.length === 0) {
            throw new NotFoundError("Pengguna tidak ditemukan.", "NOT_FOUND");
        }

        if (users[0].role === "SUPERADMIN") {
            const countRows = await query<CountRow[]>(
                `SELECT COUNT(*) AS total FROM users WHERE role = 'SUPERADMIN'`
            );
            if ((countRows[0]?.total || 0) <= 1) {
                throw new BadRequestError(
                    "Tidak dapat menghapus SuperAdmin terakhir di platform.",
                    "LAST_SUPERADMIN_FORBIDDEN"
                );
            }
        }

        await withTransaction(async (conn) => {
            await conn.execute(`DELETE FROM session WHERE userId = ?`, [userId]);
            await conn.execute(`DELETE FROM account WHERE userId = ?`, [userId]);
            await conn.execute(`DELETE FROM users WHERE id = ?`, [userId]);
        });

        return jsonResponse({
            success: true,
            message: "Pengguna berhasil dihapus.",
        });
    } catch (error) {
        return errorResponse(error, "status");
    }
}
