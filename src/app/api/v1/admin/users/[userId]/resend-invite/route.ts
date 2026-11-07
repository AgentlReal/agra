import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { query } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError, NotFoundError } from "@/shared/errors/app-error";
import { sendStaffInviteEmail } from "@/lib/email";
import type { RowDataPacket } from "mysql2/promise";

interface TargetStaffRow extends RowDataPacket {
    id: string;
    name: string;
    email: string;
    role: "SISWA" | "TIM_KURIKULUM" | "SUPERADMIN";
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { user: currentAdmin } = await requireRole("SUPERADMIN");
        const { userId } = await params;

        const rows = await query<TargetStaffRow[]>(
            `SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1`,
            [userId]
        );
        if (rows.length === 0) {
            throw new NotFoundError("Pengguna tidak ditemukan.", "NOT_FOUND");
        }

        const target = rows[0];
        if (target.role !== "TIM_KURIKULUM" && target.role !== "SUPERADMIN") {
            throw new BadRequestError(
                "Pengiriman ulang undangan hanya berlaku untuk akun Tim Kurikulum atau SuperAdmin.",
                "INVALID_ROLE"
            );
        }

        const origin = new URL(req.url).origin;
        const emailSent = await sendStaffInviteEmail({
            to: target.email,
            userName: target.name || "Rekan Tim AGRA",
            role: target.role,
            inviterName: currentAdmin.name || "SuperAdmin Platform AGRA",
            loginUrl: `${origin}/login?as=staff`,
            forgotPasswordUrl: `${origin}/forgot-password`,
        });

        return jsonResponse({
            success: true,
            emailSent,
            message: emailSent
                ? `Email undangan berhasil dikirim ulang ke ${target.email}.`
                : `Undangan untuk ${target.email} telah dicatat pada log server (SMTP belum dikonfigurasi).`,
        });
    } catch (error) {
        return errorResponse(error, "status");
    }
}

