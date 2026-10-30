import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { query } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError } from "@/shared/errors/app-error";

export async function GET() {
    try {
        await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
        const rows = await query<any[]>(`SELECT * FROM subjects ORDER BY id ASC`);
        return jsonResponse({ success: true, data: rows });
    } catch (error) {
        return errorResponse(error, "status");
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
        const body = await req.json();
        const { code, name, description } = body;

        if (!code || !name) {
            throw new BadRequestError("Kode dan nama mata pelajaran wajib diisi.", "VALIDATION_ERROR");
        }

        try {
            const res: any = await query(
                `INSERT INTO subjects (code, name, description, is_active) VALUES (?, ?, ?, TRUE)`,
                [code, name, description || null]
            );

            return jsonResponse(
                {
                    success: true,
                    message: "Mata pelajaran berhasil ditambahkan.",
                    data: { id: res.insertId, code, name },
                },
                201
            );
        } catch (dbErr: any) {
            if (dbErr.code === "ER_DUP_ENTRY" || dbErr.errno === 1062) {
                throw new BadRequestError(`Kode mata pelajaran '${code}' sudah digunakan.`, "DUPLICATE_CODE");
            }
            throw dbErr;
        }
    } catch (error) {
        return errorResponse(error, "status");
    }
}

