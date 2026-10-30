import { query, execute } from "@/shared/db";
import {
    UserProfileRow,
    PresetAvatarRow,
    MilestoneTierRow,
    XpTransactionRow,
} from "@/shared/types/database.types";
import { RowDataPacket } from "mysql2";

export interface ProfileJoinRow extends RowDataPacket {
    user_id: string;
    name: string;
    username: string;
    email: string;
    total_xp: number;
    is_recall_passed: number;
    avatar_id: number | null;
    avatar_name: string | null;
    avatar_image_url: string | null;
    tier_id: number;
    tier_number: number;
    tier_title: string;
    tier_badge_url: string | null;
    tier_min_xp: number;
    tier_max_xp: number | null;
}

export class ProfileRepository {
    async findProfileByUserId(userId: string): Promise<ProfileJoinRow | null> {
        const rows = await query<ProfileJoinRow[]>(
            `SELECT 
                up.user_id, u.name, u.username, u.email, up.total_xp, up.is_recall_passed,
                pa.id AS avatar_id, pa.name AS avatar_name, pa.image_url AS avatar_image_url,
                mt.id AS tier_id, mt.tier_number, mt.title AS tier_title, mt.badge_icon_url AS tier_badge_url,
                mt.min_xp AS tier_min_xp, mt.max_xp AS tier_max_xp
            FROM user_profiles up
            INNER JOIN users u ON u.id = up.user_id
            LEFT JOIN preset_avatars pa ON pa.id = up.preset_avatar_id
            INNER JOIN milestone_tiers mt ON mt.id = up.current_milestone_tier_id
            WHERE up.user_id = ?`,
            [userId]
        );
        return rows[0] || null;
    }

    async findRawProfile(userId: string): Promise<UserProfileRow | null> {
        const rows = await query<UserProfileRow[]>(
            `SELECT * FROM user_profiles WHERE user_id = ?`,
            [userId]
        );
        return rows[0] || null;
    }

    async createProfile(userId: string, avatarId: number = 1): Promise<void> {
        await execute(
            `INSERT INTO user_profiles (user_id, preset_avatar_id, current_milestone_tier_id, total_xp, is_recall_passed)
             VALUES (?, ?, 1, 0, FALSE)`,
            [userId, avatarId]
        );
    }

    async updateProfileName(userId: string, name: string): Promise<void> {
        await execute(
            `UPDATE users SET name = ? WHERE id = ?`,
            [name, userId]
        );
    }

    async updateAvatar(userId: string, avatarId: number): Promise<void> {
        await execute(
            `UPDATE user_profiles SET preset_avatar_id = ? WHERE user_id = ?`,
            [avatarId, userId]
        );
    }

    async getActiveAvatars(): Promise<PresetAvatarRow[]> {
        return query<PresetAvatarRow[]>(
            `SELECT * FROM preset_avatars WHERE is_active = TRUE ORDER BY id ASC`
        );
    }

    async getAvatarById(avatarId: number): Promise<PresetAvatarRow | null> {
        const rows = await query<PresetAvatarRow[]>(
            `SELECT * FROM preset_avatars WHERE id = ?`,
            [avatarId]
        );
        return rows[0] || null;
    }

    async getXpTransactions(userId: string, limit: number, offset: number): Promise<XpTransactionRow[]> {
        return query<XpTransactionRow[]>(
            `SELECT xt.*, mt.title AS tier_title
             FROM xp_transactions xt
             LEFT JOIN milestone_tiers mt ON mt.id = xt.milestone_tier_id
             WHERE xt.user_id = ?
             ORDER BY xt.created_at DESC
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );
    }

    async countXpTransactions(userId: string): Promise<number> {
        const rows = await query<(RowDataPacket & { total: number })[]>(
            `SELECT COUNT(*) AS total FROM xp_transactions WHERE user_id = ?`,
            [userId]
        );
        return rows[0]?.total || 0;
    }

    async getTierByXp(totalXp: number): Promise<MilestoneTierRow | null> {
        const rows = await query<MilestoneTierRow[]>(
            `SELECT * FROM milestone_tiers 
             WHERE ? >= min_xp AND (? <= max_xp OR max_xp IS NULL)
             ORDER BY tier_number DESC
             LIMIT 1`,
            [totalXp, totalXp]
        );
        return rows[0] || null;
    }

    async getSubjectsMasteryProgress(userId: string): Promise<Array<RowDataPacket & {
        subject_id: number;
        code: string;
        name: string;
        total_sub_materials: number;
        mastered_sub_materials: number;
    }>> {
        return query(
            `SELECT 
                s.id AS subject_id,
                s.code,
                s.name,
                COUNT(DISTINCT sm.id) AS total_sub_materials,
                COUNT(DISTINCT CASE WHEN smp.is_mastered = TRUE THEN smp.sub_material_id END) AS mastered_sub_materials
             FROM subjects s
             JOIN materials m ON m.subject_id = s.id AND m.is_active = TRUE
             JOIN sub_materials sm ON sm.material_id = m.id AND sm.is_active = TRUE
             LEFT JOIN student_sub_material_progress smp 
                ON smp.sub_material_id = sm.id AND smp.user_id = ?
             WHERE s.is_active = TRUE
             GROUP BY s.id, s.code, s.name
             ORDER BY s.id ASC`,
            [userId]
        );
    }

    async getUserActiveLearningPosition(userId: string): Promise<{
        subjectCode: "MAT" | "BIN";
        materialId: number;
        submaterialId: number;
        levelId: number;
        type: "NEXT_LEVEL" | "REMEDIAL" | "RESUME" | "SIMULATION";
        title: string;
        route: string;
    } | null> {
        const activeRows = await query<any[]>(
            `SELECT ls.id, ls.sub_material_id, ls.cognitive_level_id, sm.material_id, s.code AS subject_code
             FROM learning_sessions ls
             JOIN sub_materials sm ON sm.id = ls.sub_material_id
             JOIN materials m ON m.id = sm.material_id
             JOIN subjects s ON s.id = m.subject_id
             WHERE ls.user_id = ? AND ls.status = 'IN_PROGRESS' AND ls.session_type = 'LEVEL_PRACTICE'
             ORDER BY ls.id DESC LIMIT 1`,
            [userId]
        );
        if (activeRows.length > 0) {
            const active = activeRows[0];
            return {
                subjectCode: active.subject_code,
                materialId: active.material_id,
                submaterialId: active.sub_material_id,
                levelId: active.cognitive_level_id,
                type: "NEXT_LEVEL",
                title: "Lanjutkan Sesi Latihan Aktif",
                route: `/submaterials/${active.sub_material_id}`,
            };
        }

        const nextRows = await query<any[]>(
            `SELECT sm.id AS sub_material_id, sm.material_id, s.code AS subject_code,
                    sp.level_1_status, sp.level_2_status, sp.level_3_status
             FROM sub_materials sm
             JOIN materials m ON m.id = sm.material_id
             JOIN subjects s ON s.id = m.subject_id
             LEFT JOIN student_sub_material_progress sp ON sp.sub_material_id = sm.id AND sp.user_id = ?
             WHERE sm.is_active = TRUE AND (sp.is_mastered IS NULL OR sp.is_mastered = FALSE)
             ORDER BY s.id ASC, m.order_index ASC, sm.order_index ASC
             LIMIT 1`,
            [userId]
        );

        if (nextRows.length > 0) {
            const nextPos = nextRows[0];
            let levelNumber = 1;
            let isRemedial = false;
            if (nextPos.level_3_status === "NEEDS_REMEDIAL") {
                levelNumber = 3;
                isRemedial = true;
            } else if (nextPos.level_2_status === "COMPLETED") {
                levelNumber = 3;
            } else if (nextPos.level_1_status === "COMPLETED") {
                levelNumber = 2;
            }

            const clRows = await query<any[]>(
                `SELECT id FROM cognitive_levels WHERE level_number = ? LIMIT 1`,
                [levelNumber]
            );

            return {
                subjectCode: nextPos.subject_code,
                materialId: nextPos.material_id,
                submaterialId: nextPos.sub_material_id,
                levelId: clRows[0]?.id || levelNumber,
                type: "NEXT_LEVEL",
                title: isRemedial ? "Remedial Level Submateri" : "Lanjutkan Latihan Submateri",
                route: `/submaterials/${nextPos.sub_material_id}`,
            };
        }

        return null;
    }
}
