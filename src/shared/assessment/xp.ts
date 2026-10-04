import { PoolConnection, RowDataPacket } from "mysql2/promise";

export interface AwardXpParams {
    userId: string;
    amount: number;
    transactionType: "LEVEL_COMPLETION" | "SUB_MATERIAL_MASTERY" | "SIMULATION_COMPLETION";
    description: string;
    subMaterialId?: number | null;
    simulationId?: number | null;
    sessionId?: number | null;
}

export interface AwardXpResult {
    xpAdded: number;
    newTotalXp: number;
    newTierId: number | null;
}

/**
 * Menambahkan XP ke user profile, menentukan milestone tier baru,
 * dan mencatat entri buku besar xp_transactions.
 */
export async function awardXp(
    conn: PoolConnection,
    params: AwardXpParams
): Promise<AwardXpResult> {
    if (params.amount <= 0) {
        const [prof] = await conn.query<Array<RowDataPacket & { total_xp: number; current_milestone_tier_id: number | null }>>(
            `SELECT total_xp, current_milestone_tier_id FROM user_profiles WHERE user_id = ?`,
            [params.userId]
        );
        return {
            xpAdded: 0,
            newTotalXp: prof[0]?.total_xp || 0,
            newTierId: prof[0]?.current_milestone_tier_id || null,
        };
    }

    // 1. Tambahkan total XP di user_profiles
    await conn.execute(
        `UPDATE user_profiles SET total_xp = total_xp + ? WHERE user_id = ?`,
        [params.amount, params.userId]
    );

    // 2. Ambil total XP terbaru
    const [prof] = await conn.query<Array<RowDataPacket & { total_xp: number; current_milestone_tier_id: number | null }>>(
        `SELECT total_xp, current_milestone_tier_id FROM user_profiles WHERE user_id = ?`,
        [params.userId]
    );
    const currentTotalXp = prof[0]?.total_xp || 0;

    // 3. Cek milestone tier berdasarkan total XP
    const [newTier] = await conn.query<Array<RowDataPacket & { id: number }>>(
        `SELECT id FROM milestone_tiers 
         WHERE ? >= min_xp AND (? <= max_xp OR max_xp IS NULL)
         ORDER BY tier_number DESC LIMIT 1`,
        [currentTotalXp, currentTotalXp]
    );

    const targetTierId = newTier[0]?.id || prof[0]?.current_milestone_tier_id || null;

    if (targetTierId && targetTierId !== prof[0]?.current_milestone_tier_id) {
        await conn.execute(
            `UPDATE user_profiles SET current_milestone_tier_id = ? WHERE user_id = ?`,
            [targetTierId, params.userId]
        );
    }

    // 4. Catat transaksi XP dengan milestone_tier_id
    await conn.execute(
        `INSERT INTO xp_transactions 
         (user_id, sub_material_id, simulation_id, session_id, milestone_tier_id, transaction_type, xp_amount, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            params.userId,
            params.subMaterialId || null,
            params.simulationId || null,
            params.sessionId || null,
            targetTierId,
            params.transactionType,
            params.amount,
            params.description,
        ]
    );

    return {
        xpAdded: params.amount,
        newTotalXp: currentTotalXp,
        newTierId: targetTierId,
    };
}
