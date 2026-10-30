import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { query } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError } from "@/shared/errors/app-error";

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
        const { name, email, username, role } = body;

        if (!name || !email || !role) {
            throw new BadRequestError("Nama, email, dan role wajib diisi.", "VALIDATION_ERROR");
        }

        if (!["TIM_KURIKULUM", "SUPERADMIN"].includes(role)) {
            throw new BadRequestError("Role harus TIM_KURIKULUM atau SUPERADMIN.", "INVALID_ROLE");
        }

        // Insert or check duplicate
        const existing = await query<any[]>(`SELECT id FROM users WHERE email = ? OR username = ?`, [email, username || ""]);
        if (existing.length > 0) {
            throw new BadRequestError("Email atau username sudah terdaftar.", "DUPLICATE_USER");
        }

        const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await query(
            `INSERT INTO users (id, name, email, username, role, emailVerified, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, TRUE, NOW(), NOW())`,
            [userId, name, email, username || email.split("@")[0], role]
        );

        return jsonResponse(
            {
                success: true,
                message: "Pengguna berhasil dibuat.",
                data: { id: userId, name, email, role },
            },
            201
        );
    } catch (error) {
        return errorResponse(error, "status");
    }
}

