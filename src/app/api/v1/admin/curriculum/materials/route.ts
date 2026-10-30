import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { query } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError } from "@/shared/errors/app-error";

export async function POST(req: NextRequest) {
    try {
        await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
        const body = await req.json();
        const { subject_id, name, title, order_index, prerequisite_material_id } = body;
        const materialTitle = title || name;

        if (!subject_id || !materialTitle) {
            throw new BadRequestError("subject_id dan title materi wajib diisi.", "VALIDATION_ERROR");
        }

        const res: any = await query(
            `INSERT INTO materials (subject_id, title, order_index, prerequisite_material_id, is_active)
             VALUES (?, ?, ?, ?, TRUE)`,
            [subject_id, materialTitle, order_index || 1, prerequisite_material_id || null]
        );

        return jsonResponse(
            {
                success: true,
                message: "Materi pokok berhasil ditambahkan.",
                data: { id: res.insertId, subject_id, title: materialTitle },
            },
            201
        );
    } catch (error) {
        return errorResponse(error, "status");
    }
}

