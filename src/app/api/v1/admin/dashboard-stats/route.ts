import { requireRole } from "@/modules/auth/auth.guard";
import { query } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";

export async function GET() {
    try {
        await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);

        const [bankStats] = await Promise.all([
            query<any[]>(
                `SELECT bank_type, 
                        COUNT(*) as total_questions,
                        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_questions,
                        SUM(CASE WHEN is_active = FALSE THEN 1 ELSE 0 END) as draft_questions
                 FROM question_banks
                 GROUP BY bank_type`
            ),
        ]);

        const [pkgStats] = await Promise.all([
            query<any[]>(
                `SELECT 
                    COUNT(*) as total_packages,
                    SUM(CASE WHEN status IN ('ACTIVE', 'PUBLISHED') THEN 1 ELSE 0 END) as active_packages,
                    SUM(CASE WHEN status = 'DRAFT' THEN 1 ELSE 0 END) as draft_packages
                 FROM simulations`
            ),
        ]);

        const subjectStats = await query<any[]>(
            `SELECT s.id, s.code, s.name, 
                    COUNT(DISTINCT qb.id) as total_questions
             FROM subjects s
             LEFT JOIN question_banks qb ON qb.subject_id = s.id
             WHERE s.is_active = TRUE
             GROUP BY s.id, s.code, s.name
             ORDER BY s.id ASC`
        );

        return jsonResponse({
            success: true,
            data: {
                banks: bankStats,
                packages: pkgStats[0] || { total_packages: 0, active_packages: 0, draft_packages: 0 },
                subjects: subjectStats,
            },
        });
    } catch (error) {
        return errorResponse(error, "status");
    }
}

