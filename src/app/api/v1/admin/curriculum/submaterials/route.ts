import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { query } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError } from "@/shared/errors/app-error";

export async function POST(req: NextRequest) {
    try {
        await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
        const body = await req.json();
        const { material_id, code, title, order_index, prerequisite_sub_material_id } = body;

        if (!material_id || !code || !title) {
            throw new BadRequestError("material_id, code, dan title wajib diisi.", "VALIDATION_ERROR");
        }

        try {
            const res: any = await query(
                `INSERT INTO sub_materials (material_id, code, title, order_index, prerequisite_sub_material_id, is_active)
                 VALUES (?, ?, ?, ?, ?, TRUE)`,
                [material_id, code, title, order_index || 1, prerequisite_sub_material_id || null]
            );

            return jsonResponse(
                {
                    success: true,
                    message: "Submateri berhasil ditambahkan.",
                    data: { id: res.insertId, material_id, code, title },
                },
                201
            );
        } catch (dbErr: any) {
            if (dbErr.code === "ER_DUP_ENTRY" || dbErr.errno === 1062) {
                throw new BadRequestError(`Kode submateri '${code}' sudah digunakan.`, "DUPLICATE_CODE");
            }
            throw dbErr;
        }
    } catch (error) {
        return errorResponse(error, "status");
    }
}

