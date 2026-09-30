import { query } from "@/shared/db";
import {
    SubjectRow,
    MaterialRow,
    SubMaterialRow,
    StudentSubMaterialProgressRow,
    CognitiveLevelRow,
} from "@/shared/types/database.types";
import { RowDataPacket } from "mysql2";

export class CurriculumRepository {
    async getActiveSubjects(): Promise<Array<SubjectRow & { total_materials: number }>> {
        return query<Array<SubjectRow & { total_materials: number }>>(
            `SELECT 
                s.*,
                COUNT(m.id) AS total_materials
             FROM subjects s
             LEFT JOIN materials m ON m.subject_id = s.id AND m.is_active = TRUE
             WHERE s.is_active = TRUE
             GROUP BY s.id
             ORDER BY s.id ASC`
        );
    }

    async getCognitiveLevels(): Promise<CognitiveLevelRow[]> {
        return query<CognitiveLevelRow[]>(
            `SELECT * FROM cognitive_levels ORDER BY level_number ASC`
        );
    }


    async getSubjectById(id: number): Promise<SubjectRow | null> {
        const rows = await query<SubjectRow[]>(
            `SELECT * FROM subjects WHERE id = ? AND is_active = TRUE`,
            [id]
        );
        return rows[0] || null;
    }

    async getMaterialsBySubject(subjectId: number): Promise<MaterialRow[]> {
        return query<MaterialRow[]>(
            `SELECT * FROM materials 
             WHERE subject_id = ? AND is_active = TRUE 
             ORDER BY order_index ASC`,
            [subjectId]
        );
    }

    async getSubMaterialsBySubject(subjectId: number): Promise<SubMaterialRow[]> {
        return query<SubMaterialRow[]>(
            `SELECT sm.* 
             FROM sub_materials sm
             JOIN materials m ON m.id = sm.material_id
             WHERE m.subject_id = ? AND sm.is_active = TRUE AND m.is_active = TRUE
             ORDER BY sm.order_index ASC`,
            [subjectId]
        );
    }

    async getSubMaterialById(subMaterialId: number): Promise<SubMaterialRow | null> {
        const rows = await query<SubMaterialRow[]>(
            `SELECT * FROM sub_materials WHERE id = ? AND is_active = TRUE`,
            [subMaterialId]
        );
        return rows[0] || null;
    }

    async getUserProgressForSubMaterials(
        userId: string,
        subMaterialIds: number[]
    ): Promise<StudentSubMaterialProgressRow[]> {
        if (subMaterialIds.length === 0) return [];
        return query<StudentSubMaterialProgressRow[]>(
            `SELECT * FROM student_sub_material_progress 
             WHERE user_id = ? AND sub_material_id IN (?)`,
            [userId, subMaterialIds]
        );
    }

    async getSingleSubMaterialProgress(
        userId: string,
        subMaterialId: number
    ): Promise<StudentSubMaterialProgressRow | null> {
        const rows = await query<StudentSubMaterialProgressRow[]>(
            `SELECT * FROM student_sub_material_progress 
             WHERE user_id = ? AND sub_material_id = ?`,
            [userId, subMaterialId]
        );
        return rows[0] || null;
    }

    async isRecallPassed(userId: string): Promise<boolean> {
        const rows = await query<(RowDataPacket & { is_recall_passed: number })[]>(
            `SELECT is_recall_passed FROM user_profiles WHERE user_id = ?`,
            [userId]
        );
        return Boolean(rows[0]?.is_recall_passed);
    }
}
