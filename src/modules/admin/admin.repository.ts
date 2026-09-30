import { query, execute, withTransaction } from "@/shared/db";
import {
    K09_AdminProfile,
    K10_QuestionBankStock,
    K10_QuestionSummary,
    K10_Question,
    K10_QuestionInput,
    K10_QuestionFilter,
    K11_SimulationPackageSummary,
    K11_SimulationPackage,
    K11_SimulationPackageInput,
    K11_SimulationPackageStats,
} from "./admin.types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class AdminRepository {
    async getAdminProfile(userId: string): Promise<K09_AdminProfile | null> {
        const rows = await query<Array<RowDataPacket & K09_AdminProfile>>(
            `SELECT id, email, username, name, role FROM users WHERE id = ?`,
            [userId]
        );
        return rows[0] || null;
    }

    async updateAdminProfile(userId: string, name: string): Promise<void> {
        await execute(`UPDATE users SET name = ? WHERE id = ?`, [name, userId]);
    }

    async getQuestionBankStock(): Promise<K10_QuestionBankStock[]> {
        const rows = await query<Array<RowDataPacket & {
            bank_type: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
            subject_id: number;
            sub_material_id: number | null;
            cognitive_level_id: number | null;
            active_question_count: number;
        }>>(
            `SELECT 
                qb.bank_type,
                qb.subject_id,
                qb.sub_material_id,
                qb.cognitive_level_id,
                COUNT(CASE WHEN qb.is_active = TRUE THEN 1 END) AS active_question_count
             FROM question_banks qb
             GROUP BY qb.bank_type, qb.subject_id, qb.sub_material_id, qb.cognitive_level_id
             ORDER BY qb.bank_type, qb.subject_id, qb.sub_material_id, qb.cognitive_level_id`
        );

        return rows.map((r) => ({
            bank_type: r.bank_type,
            subject_id: r.subject_id,
            sub_material_id: r.sub_material_id,
            cognitive_level_id: r.cognitive_level_id,
            active_question_count: Number(r.active_question_count),
        }));
    }

    async listQuestions(filter: K10_QuestionFilter): Promise<{
        items: K10_QuestionSummary[];
        totalItems: number;
    }> {
        const whereClauses: string[] = [];
        const params: (string | number | boolean)[] = [];

        if (filter.bank) {
            whereClauses.push("qb.bank_type = ?");
            params.push(filter.bank);
        }
        if (filter.subject) {
            whereClauses.push("qb.subject_id = ?");
            params.push(filter.subject);
        }
        if (filter.material) {
            whereClauses.push("sm.material_id = ?");
            params.push(filter.material);
        }
        if (filter.submaterial) {
            whereClauses.push("qb.sub_material_id = ?");
            params.push(filter.submaterial);
        }
        if (filter.level) {
            whereClauses.push("qb.cognitive_level_id = ?");
            params.push(filter.level);
        }
        if (filter.type) {
            whereClauses.push("qb.question_format = ?");
            params.push(filter.type);
        }
        if (filter.is_active !== undefined) {
            whereClauses.push("qb.is_active = ?");
            params.push(filter.is_active);
        }

        const whereSql = whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM question_banks qb
            LEFT JOIN sub_materials sm ON sm.id = qb.sub_material_id
            ${whereSql}
        `;
        const countRows = await query<Array<RowDataPacket & { total: number }>>(countQuery, params);
        const totalItems = countRows[0]?.total || 0;

        const page = filter.page || 1;
        const limit = filter.limit || 20;
        const offset = (page - 1) * limit;

        const dataQuery = `
            SELECT 
                qb.id,
                qb.subject_id,
                qb.sub_material_id,
                qb.cognitive_level_id,
                qb.bank_type,
                qb.question_format,
                qb.question_text,
                qb.is_active,
                qb.created_at
            FROM question_banks qb
            LEFT JOIN sub_materials sm ON sm.id = qb.sub_material_id
            ${whereSql}
            ORDER BY qb.id DESC
            LIMIT ? OFFSET ?
        `;
        const dataRows = await query<Array<RowDataPacket & {
            id: number;
            subject_id: number;
            sub_material_id: number | null;
            cognitive_level_id: number | null;
            bank_type: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
            question_format: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
            question_text: string;
            is_active: number;
            created_at: Date;
        }>>(dataQuery, [...params, limit, offset]);

        const items: K10_QuestionSummary[] = dataRows.map((r) => ({
            id: r.id,
            subject_id: r.subject_id,
            sub_material_id: r.sub_material_id,
            cognitive_level_id: r.cognitive_level_id,
            bank_type: r.bank_type,
            question_format: r.question_format,
            question_text: r.question_text,
            is_active: Boolean(r.is_active),
            created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        }));

        return { items, totalItems };
    }

    async createQuestion(input: K10_QuestionInput): Promise<number> {
        return withTransaction(async (conn) => {
            let stimulusId = input.stimulus_id || null;

            if (input.stimulus) {
                const [stmRes] = await conn.execute<ResultSetHeader>(
                    `INSERT INTO stimuli (subject_id, title, stimulus_text, stimulus_image_url)
                     VALUES (?, ?, ?, ?)`,
                    [
                        input.subject_id,
                        input.stimulus.title,
                        input.stimulus.stimulus_text,
                        input.stimulus.stimulus_image_url || null,
                    ]
                );
                stimulusId = stmRes.insertId;
            }

            const [qbRes] = await conn.execute<ResultSetHeader>(
                `INSERT INTO question_banks 
                 (subject_id, sub_material_id, cognitive_level_id, stimulus_id, bank_type, question_format, question_text, stimulus_image_url, is_active)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
                [
                    input.subject_id,
                    input.sub_material_id || null,
                    input.cognitive_level_id || null,
                    stimulusId,
                    input.bank_type,
                    input.question_format,
                    input.question_text,
                    input.stimulus_image_url || null,
                ]
            );
            const questionId = qbRes.insertId;

            for (const opt of input.options) {
                await conn.execute(
                    `INSERT INTO question_options (question_id, option_label, option_text, is_correct)
                     VALUES (?, ?, ?, ?)`,
                    [questionId, opt.option_label, opt.option_text, opt.is_correct]
                );
            }

            if (input.explanation) {
                await conn.execute(
                    `INSERT INTO question_explanations (question_id, explanation_text, reasoning_guide, reference_url)
                     VALUES (?, ?, ?, ?)`,
                    [
                        questionId,
                        input.explanation.explanation_text,
                        input.explanation.reasoning_guide || null,
                        input.explanation.reference_url || null,
                    ]
                );
            }

            return questionId;
        });
    }

    async getQuestionDetail(questionId: number): Promise<K10_Question | null> {
        const rows = await query<Array<RowDataPacket & {
            id: number;
            subject_id: number;
            sub_material_id: number | null;
            cognitive_level_id: number | null;
            bank_type: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
            question_format: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
            question_text: string;
            is_active: number;
            created_at: Date;
            stimulus_id: number | null;
            stimulus_image_url: string | null;
            stm_title: string | null;
            stm_text: string | null;
            stm_subject_id: number | null;
            stm_image_url: string | null;
        }>>(
            `SELECT 
                qb.*,
                stm.title AS stm_title,
                stm.stimulus_text AS stm_text,
                stm.subject_id AS stm_subject_id,
                stm.stimulus_image_url AS stm_image_url
             FROM question_banks qb
             LEFT JOIN stimuli stm ON stm.id = qb.stimulus_id
             WHERE qb.id = ?`,
            [questionId]
        );

        if (rows.length === 0) return null;
        const q = rows[0];

        const optionRows = await query<Array<RowDataPacket & {
            id: number;
            option_label: "A" | "B" | "C" | "D";
            option_text: string;
            is_correct: number;
        }>>(
            `SELECT id, option_label, option_text, is_correct 
             FROM question_options 
             WHERE question_id = ? 
             ORDER BY option_label ASC`,
            [questionId]
        );

        const expRows = await query<Array<RowDataPacket & {
            explanation_text: string;
            reasoning_guide: string | null;
            reference_url: string | null;
        }>>(
            `SELECT explanation_text, reasoning_guide, reference_url 
             FROM question_explanations 
             WHERE question_id = ?`,
            [questionId]
        );

        return {
            id: q.id,
            subject_id: q.subject_id,
            sub_material_id: q.sub_material_id,
            cognitive_level_id: q.cognitive_level_id,
            bank_type: q.bank_type,
            question_format: q.question_format,
            question_text: q.question_text,
            is_active: Boolean(q.is_active),
            created_at: q.created_at ? new Date(q.created_at).toISOString() : new Date().toISOString(),
            stimulus_id: q.stimulus_id,
            stimulus_image_url: q.stimulus_image_url,
            stimulus: q.stimulus_id
                ? {
                      id: q.stimulus_id,
                      subject_id: q.stm_subject_id || q.subject_id,
                      title: q.stm_title || "",
                      stimulus_text: q.stm_text || "",
                      stimulus_image_url: q.stm_image_url,
                  }
                : null,
            options: optionRows.map((o) => ({
                id: o.id,
                option_label: o.option_label,
                option_text: o.option_text,
                is_correct: Boolean(o.is_correct),
            })),
            explanation: expRows[0] || {
                explanation_text: "Pembahasan belum tersedia.",
                reasoning_guide: null,
                reference_url: null,
            },
        };
    }

    async toggleQuestionStatus(questionId: number, isActive: boolean): Promise<void> {
        await execute(`UPDATE question_banks SET is_active = ? WHERE id = ?`, [isActive, questionId]);
    }

    async listSimulationPackages(page = 1, limit = 20): Promise<{
        items: K11_SimulationPackageSummary[];
        totalItems: number;
    }> {
        const countRows = await query<Array<RowDataPacket & { total: number }>>(
            `SELECT COUNT(*) AS total FROM simulations`
        );
        const totalItems = countRows[0]?.total || 0;

        const offset = (page - 1) * limit;
        const rows = await query<Array<RowDataPacket & {
            id: number;
            subject_id: number;
            title: string;
            package_code: string;
            duration_minutes: number;
            total_questions: number;
            passing_score: number;
            xp_reward: number;
            status: "DRAFT" | "ACTIVE" | "ARCHIVED";
            is_active: number;
            created_at: Date;
        }>>(
            `SELECT * FROM simulations ORDER BY id DESC LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        const items: K11_SimulationPackageSummary[] = rows.map((r) => ({
            id: r.id,
            subject_id: r.subject_id,
            title: r.title,
            package_code: r.package_code,
            duration_minutes: r.duration_minutes || 75,
            total_questions: r.total_questions || 30,
            passing_score: Number(r.passing_score) || 90,
            xp_reward: r.xp_reward || 500,
            status: r.status,
            is_active: Boolean(r.is_active),
            created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        }));

        return { items, totalItems };
    }

    async createSimulationPackage(input: K11_SimulationPackageInput): Promise<number> {
        return withTransaction(async (conn) => {
            const [pkgRes] = await conn.execute<ResultSetHeader>(
                `INSERT INTO simulations 
                 (subject_id, title, package_code, duration_minutes, total_questions, passing_score, xp_reward, status, is_active)
                 VALUES (?, ?, ?, 75, ?, 90.00, 500, 'DRAFT', TRUE)`,
                [
                    input.subject_id,
                    input.title,
                    input.package_code,
                    input.questions.length,
                ]
            );
            const packageId = pkgRes.insertId;

            for (const q of input.questions) {
                await conn.execute(
                    `INSERT INTO simulation_questions (simulation_id, question_id, question_order)
                     VALUES (?, ?, ?)`,
                    [packageId, q.question_id, q.question_order]
                );
            }

            return packageId;
        });
    }

    async getSimulationPackageById(packageId: number): Promise<K11_SimulationPackage | null> {
        const rows = await query<Array<RowDataPacket & {
            id: number;
            subject_id: number;
            title: string;
            package_code: string;
            duration_minutes: number;
            total_questions: number;
            passing_score: number;
            xp_reward: number;
            status: "DRAFT" | "ACTIVE" | "ARCHIVED";
            is_active: number;
            created_at: Date;
        }>>(
            `SELECT * FROM simulations WHERE id = ?`,
            [packageId]
        );
        if (rows.length === 0) return null;
        const p = rows[0];

        const questionRows = await query<Array<RowDataPacket & {
            question_id: number;
            question_order: number;
        }>>(
            `SELECT question_id, question_order FROM simulation_questions WHERE simulation_id = ? ORDER BY question_order ASC`,
            [packageId]
        );

        return {
            id: p.id,
            subject_id: p.subject_id,
            title: p.title,
            package_code: p.package_code,
            duration_minutes: p.duration_minutes || 75,
            total_questions: p.total_questions || 30,
            passing_score: Number(p.passing_score) || 90,
            xp_reward: p.xp_reward || 500,
            status: p.status,
            is_active: Boolean(p.is_active),
            created_at: p.created_at ? new Date(p.created_at).toISOString() : new Date().toISOString(),
            questions: questionRows.map((q) => ({
                question_id: q.question_id,
                question_order: q.question_order,
            })),
        };
    }

    async getSimulationStats(packageId: number): Promise<K11_SimulationPackageStats | null> {
        const pkgRows = await query<Array<RowDataPacket & { id: number }>>(
            `SELECT id FROM simulations WHERE id = ?`,
            [packageId]
        );
        if (pkgRows.length === 0) return null;

        const rows = await query<Array<RowDataPacket & {
            participant_count: number;
            average_score: number;
        }>>(
            `SELECT 
                COUNT(DISTINCT user_id) AS participant_count,
                COALESCE(AVG(score), 0) AS average_score
             FROM learning_sessions 
             WHERE simulation_id = ? AND status = 'COMPLETED'`,
            [packageId]
        );

        return {
            package_id: packageId,
            participant_count: Number(rows[0]?.participant_count || 0),
            average_score: Math.round(Number(rows[0]?.average_score || 0) * 100) / 100,
        };
    }
}
