import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { query } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError, NotFoundError } from "@/shared/errors/app-error";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await requireRole("SUPERADMIN");
        const { userId } = await params;
        const body = await req.json();
        const { role, name } = body;

        const users = await query<any[]>(`SELECT id FROM users WHERE id = ?`, [userId]);
        if (users.length === 0) {
            throw new NotFoundError("Pengguna tidak ditemukan.", "NOT_FOUND");
        }

        const updates: string[] = [];
        const paramsList: (string | number)[] = [];

        if (role) {
            if (!["SISWA", "TIM_KURIKULUM", "SUPERADMIN"].includes(role)) {
                throw new BadRequestError("Role tidak valid.", "INVALID_ROLE");
            }
            updates.push("role = ?");
            paramsList.push(role);
        }

        if (name) {
            updates.push("name = ?");
            paramsList.push(name);
        }

        if (updates.length === 0) {
            throw new BadRequestError("Tidak ada data yang diperbarui.", "NO_UPDATES");
        }

        paramsList.push(userId);
        await query(`UPDATE users SET ${updates.join(", ")}, updatedAt = NOW() WHERE id = ?`, paramsList);

        return jsonResponse({
            success: true,
            message: "Data pengguna berhasil diperbarui.",
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
        await requireRole("SUPERADMIN");
        const { userId } = await params;

        const users = await query<any[]>(`SELECT id FROM users WHERE id = ?`, [userId]);
        if (users.length === 0) {
            throw new NotFoundError("Pengguna tidak ditemukan.", "NOT_FOUND");
        }

        await query(`DELETE FROM user WHERE id = ?`, [userId]);

        return jsonResponse({
            success: true,
            message: "Pengguna berhasil dihapus.",
        });
    } catch (error) {
        return errorResponse(error, "status");
    }
}

