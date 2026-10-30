import { requireRole } from "@/modules/auth/auth.guard";
import { query } from "@/shared/db";
import { jsonResponse, errorResponse } from "@/shared/utils/response";

export async function GET() {
    try {
        await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);

        const subjects = await query<any[]>(`SELECT id, code, name, description FROM subjects WHERE is_active = TRUE ORDER BY id ASC`);
        const materials = await query<any[]>(`SELECT id, subject_id, title as name, order_index FROM materials WHERE is_active = TRUE ORDER BY order_index ASC`);
        const submaterials = await query<any[]>(`SELECT id, material_id, code, title, order_index FROM sub_materials WHERE is_active = TRUE ORDER BY order_index ASC`);
        const levels = await query<any[]>(`SELECT id, level_number, name FROM cognitive_levels ORDER BY level_number ASC`);

        const tree = subjects.map((s) => {
            const subjectMaterials = materials
                .filter((m) => m.subject_id === s.id)
                .map((m) => {
                    const materialSubmaterials = submaterials
                        .filter((sm) => sm.material_id === m.id)
                        .map((sm) => ({
                            id: sm.id,
                            code: sm.code,
                            title: sm.title,
                            orderIndex: sm.order_index,
                            cognitiveLevels: levels,
                        }));
                    return {
                        id: m.id,
                        name: m.name,
                        orderIndex: m.order_index,
                        submaterials: materialSubmaterials,
                    };
                });
            return {
                id: s.id,
                code: s.code,
                name: s.name,
                materials: subjectMaterials,
            };
        });

        return jsonResponse({
            success: true,
            data: tree,
        });
    } catch (error) {
        return errorResponse(error, "status");
    }
}

