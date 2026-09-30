import { query, withTransaction } from "@/shared/db";
import {
    LearningSessionRow,
    QuestionBankRow,
    StudentSubMaterialProgressRow,
    StudentAnswerRow,
} from "@/shared/types/database.types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class LearningRepository {
    async findActiveSession(
        userId: string,
        subMaterialId: number,
        cognitiveLevelId: number
    ): Promise<LearningSessionRow | null> {
        const rows = await query<LearningSessionRow[]>(
            `SELECT * FROM learning_sessions 
             WHERE user_id = ? AND sub_material_id = ? AND cognitive_level_id = ? 
               AND session_type = 'LEVEL_EXERCISE' AND status = 'IN_PROGRESS'
             ORDER BY id DESC LIMIT 1`,
            [userId, subMaterialId, cognitiveLevelId]
        );
        return rows[0] || null;
    }

    async getSessionById(sessionId: number, userId: string): Promise<LearningSessionRow | null> {
        const rows = await query<LearningSessionRow[]>(
            `SELECT * FROM learning_sessions WHERE id = ? AND user_id = ?`,
            [sessionId, userId]
        );
        return rows[0] || null;
    }

    async countAttempts(userId: string, subMaterialId: number, cognitiveLevelId: number): Promise<number> {
        const rows = await query<(RowDataPacket & { total: number })[]>(
            `SELECT COUNT(*) AS total FROM learning_sessions 
             WHERE user_id = ? AND sub_material_id = ? AND cognitive_level_id = ? AND session_type = 'LEVEL_EXERCISE'`,
            [userId, subMaterialId, cognitiveLevelId]
        );
        return rows[0]?.total || 0;
    }

    async pickQuestions(
        subMaterialId: number,
        cognitiveLevelId: number,
        limit = 10
    ): Promise<QuestionBankRow[]> {
        // Ambil 10 butir soal dari bank LEVEL_EXERCISE
        // Soal dengan stimulus wacana yang sama disusun berurutan
        return query<QuestionBankRow[]>(
            `SELECT * FROM question_banks 
             WHERE sub_material_id = ? AND cognitive_level_id = ? 
               AND bank_type = 'LEVEL_EXERCISE' AND is_active = TRUE
             ORDER BY stimulus_id IS NULL, stimulus_id, RAND()
             LIMIT ?`,
            [subMaterialId, cognitiveLevelId, limit]
        );
    }

    async createSession(
        userId: string,
        subMaterialId: number,
        cognitiveLevelId: number,
        attemptNumber: number,
        isRemedial: boolean,
        questions: QuestionBankRow[]
    ): Promise<number> {
        return withTransaction(async (conn) => {
            const [sessionResult] = await conn.execute<ResultSetHeader>(
                `INSERT INTO learning_sessions 
                 (user_id, session_type, sub_material_id, cognitive_level_id, attempt_number, is_remedial, status, total_questions, correct_answers, score, is_passed, current_question_order, start_time)
                 VALUES (?, 'LEVEL_EXERCISE', ?, ?, ?, ?, 'IN_PROGRESS', ?, 0, 0.00, FALSE, 1, NOW())`,
                [userId, subMaterialId, cognitiveLevelId, attemptNumber, isRemedial, questions.length]
            );
            const sessionId = sessionResult.insertId;

            for (let i = 0; i < questions.length; i++) {
                await conn.execute(
                    `INSERT INTO session_questions (session_id, question_id, question_order)
                     VALUES (?, ?, ?)`,
                    [sessionId, questions[i].id, i + 1]
                );
            }

            return sessionId;
        });
    }

    async getSessionQuestions(sessionId: number): Promise<Array<RowDataPacket & {
        session_question_id: number;
        question_order: number;
        question_id: number;
        question_text: string;
        question_format: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
        stimulus_text: string | null;
        stimulus_image_url: string | null;
        option_id: number;
        option_label: "A" | "B" | "C" | "D";
        option_text: string;
    }>> {
        return query(
            `SELECT 
                sq.id AS session_question_id,
                sq.question_order,
                qb.id AS question_id,
                qb.question_text,
                qb.question_format,
                stm.stimulus_text,
                COALESCE(qb.stimulus_image_url, stm.stimulus_image_url) AS stimulus_image_url,
                qo.id AS option_id,
                qo.option_label,
                qo.option_text
             FROM session_questions sq
             JOIN question_banks qb ON qb.id = sq.question_id
             LEFT JOIN stimuli stm ON stm.id = qb.stimulus_id
             JOIN question_options qo ON qo.question_id = qb.id
             WHERE sq.session_id = ?
             ORDER BY sq.question_order ASC, qo.option_label ASC`,
            [sessionId]
        );
    }

    async getSavedAnswers(sessionId: number): Promise<Array<RowDataPacket & {
        session_question_id: number;
        is_flagged: number;
        selected_option_id: number;
    }>> {
        return query(
            `SELECT 
                sa.session_question_id,
                sa.is_flagged,
                sao.selected_option_id
             FROM student_answers sa
             JOIN session_questions sq ON sq.id = sa.session_question_id
             LEFT JOIN student_answer_options sao ON sao.student_answer_id = sa.id
             WHERE sq.session_id = ?`,
            [sessionId]
        );
    }

    async countAnsweredQuestions(sessionId: number): Promise<number> {
        const rows = await query<(RowDataPacket & { total: number })[]>(
            `SELECT COUNT(DISTINCT sa.session_question_id) AS total
             FROM student_answers sa
             JOIN student_answer_options sao ON sao.student_answer_id = sa.id
             JOIN session_questions sq ON sq.id = sa.session_question_id
             WHERE sq.session_id = ? AND sa.is_skipped = FALSE`,
            [sessionId]
        );
        return rows[0]?.total || 0;
    }

    async getUserTotalXp(userId: string): Promise<number> {
        const rows = await query<Array<RowDataPacket & { total_xp: number }>>(
            `SELECT total_xp FROM user_profiles WHERE user_id = ?`,
            [userId]
        );
        return rows[0]?.total_xp || 0;
    }

    async getCognitiveLevelById(id: number) {
        const rows = await query<Array<RowDataPacket & { id: number; level_number: number; name: string; xp_reward: number }>>(
            `SELECT id, level_number, name, xp_reward FROM cognitive_levels WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    async upsertAnswer(
        sessionQuestionId: number,
        selectedOptionIds: number[],
        isSkipped = false,
        timeSpent = 0,
        currentQuestionOrder?: number
    ): Promise<{
        sessionQuestionId: number;
        answeredAt: Date;
        answeredCount: number;
        remainingUnansweredCount: number;
        currentQuestionOrder: number;
    }> {
        return withTransaction(async (conn) => {
            const [sqRows] = await conn.query<Array<RowDataPacket & { session_id: number; question_order: number }>>(
                `SELECT session_id, question_order FROM session_questions WHERE id = ?`,
                [sessionQuestionId]
            );
            const sessionId = sqRows[0]?.session_id;

            const [existing] = await conn.query<StudentAnswerRow[]>(
                `SELECT id FROM student_answers WHERE session_question_id = ?`,
                [sessionQuestionId]
            );

            let answerId: number;
            const now = new Date();
            if (existing.length > 0) {
                answerId = existing[0].id;
                await conn.execute(
                    `UPDATE student_answers 
                     SET is_skipped = ?, time_spent_seconds = time_spent_seconds + ?, answered_at = ?
                     WHERE id = ?`,
                    [isSkipped, timeSpent, now, answerId]
                );
                await conn.execute(
                    `DELETE FROM student_answer_options WHERE student_answer_id = ?`,
                    [answerId]
                );
            } else {
                const [ins] = await conn.execute<ResultSetHeader>(
                    `INSERT INTO student_answers (session_question_id, is_correct, is_flagged, is_skipped, time_spent_seconds, answered_at)
                     VALUES (?, FALSE, FALSE, ?, ?, ?)`,
                    [sessionQuestionId, isSkipped, timeSpent, now]
                );
                answerId = ins.insertId;
            }

            if (!isSkipped && selectedOptionIds.length > 0) {
                for (const optId of selectedOptionIds) {
                    await conn.execute(
                        `INSERT INTO student_answer_options (student_answer_id, selected_option_id)
                         VALUES (?, ?)`,
                        [answerId, optId]
                    );
                }
            }

            let effectiveQuestionOrder = sqRows[0]?.question_order || 1;
            if (sessionId) {
                if (currentQuestionOrder !== undefined) {
                    await conn.execute(
                        `UPDATE learning_sessions SET current_question_order = ? WHERE id = ?`,
                        [currentQuestionOrder, sessionId]
                    );
                    effectiveQuestionOrder = currentQuestionOrder;
                } else {
                    const [sess] = await conn.query<Array<RowDataPacket & { current_question_order: number }>>(
                        `SELECT current_question_order FROM learning_sessions WHERE id = ?`,
                        [sessionId]
                    );
                    effectiveQuestionOrder = sess[0]?.current_question_order || effectiveQuestionOrder;
                }
            }

            let answeredCount = 0;
            if (sessionId) {
                const [countRows] = await conn.query<Array<RowDataPacket & { total: number }>>(
                    `SELECT COUNT(DISTINCT sa.session_question_id) AS total
                     FROM student_answers sa
                     JOIN student_answer_options sao ON sao.student_answer_id = sa.id
                     JOIN session_questions sq ON sq.id = sa.session_question_id
                     WHERE sq.session_id = ? AND sa.is_skipped = FALSE`,
                    [sessionId]
                );
                answeredCount = countRows[0]?.total || 0;
            }

            const remainingUnansweredCount = Math.max(0, 10 - answeredCount);

            return {
                sessionQuestionId,
                answeredAt: now,
                answeredCount,
                remainingUnansweredCount,
                currentQuestionOrder: effectiveQuestionOrder,
            };
        });
    }


    async evaluateAndCompleteSession(
        sessionId: number,
        userId: string,
        subMaterialId: number,
        levelNumber: number,
        xpRewardLevel: number
    ): Promise<{
        totalQuestions: number;
        correctAnswers: number;
        score: number;
        isPassed: boolean;
        xpEarned: number;
        masteryBonusEarned: number;
        isSubMaterialMastered: boolean;
        nextLevelUnlocked: number | null;
        needsRemedial: boolean;
    }> {
        return withTransaction(async (conn) => {
            // Hitung kebenaran tiap soal
            const [evalRows] = await conn.query<Array<RowDataPacket & {
                student_answer_id: number;
                is_question_correct: number;
            }>>(
                `SELECT 
                    sa.id AS student_answer_id,
                    CASE 
                        WHEN COUNT(CASE WHEN qo.is_correct = TRUE AND sao.selected_option_id IS NULL THEN 1 END) = 0
                         AND COUNT(CASE WHEN qo.is_correct = FALSE AND sao.selected_option_id IS NOT NULL THEN 1 END) = 0
                         AND COUNT(sao.selected_option_id) > 0
                        THEN 1 
                        ELSE 0 
                    END AS is_question_correct
                 FROM session_questions sq
                 JOIN question_banks qb ON qb.id = sq.question_id
                 LEFT JOIN student_answers sa ON sa.session_question_id = sq.id
                 LEFT JOIN question_options qo ON qo.question_id = qb.id
                 LEFT JOIN student_answer_options sao 
                    ON sao.student_answer_id = sa.id AND sao.selected_option_id = qo.id
                 WHERE sq.session_id = ?
                 GROUP BY sa.id`,
                [sessionId]
            );

            let correctAnswers = 0;
            for (const r of evalRows) {
                const isCorrect = Boolean(r.is_question_correct);
                if (r.student_answer_id) {
                    await conn.execute(
                        `UPDATE student_answers SET is_correct = ? WHERE id = ?`,
                        [isCorrect, r.student_answer_id]
                    );
                }
                if (isCorrect) correctAnswers++;
            }

            const totalQuestions = evalRows.length || 10;
            const score = Math.round((correctAnswers / totalQuestions) * 100 * 100) / 100;
            const isPassed = correctAnswers >= 9; // Syarat >= 9 dari 10 (90%)
            const needsRemedial = !isPassed;

            // Selesaikan session
            await conn.execute(
                `UPDATE learning_sessions 
                 SET status = 'COMPLETED', submission_type = 'MANUAL', correct_answers = ?, score = ?, is_passed = ?, end_time = NOW()
                 WHERE id = ?`,
                [correctAnswers, score, isPassed, sessionId]
            );

            // Ambil / inisialisasi student_sub_material_progress
            const [progRows] = await conn.query<StudentSubMaterialProgressRow[]>(
                `SELECT * FROM student_sub_material_progress 
                 WHERE user_id = ? AND sub_material_id = ?`,
                [userId, subMaterialId]
            );

            let prog = progRows[0];
            if (!prog) {
                await conn.execute(
                    `INSERT INTO student_sub_material_progress 
                     (user_id, sub_material_id, level_1_status, level_2_status, level_3_status, level_1_score, level_2_score, level_3_score, total_cumulative_score, is_mastered, is_xp_awarded, progress_state)
                     VALUES (?, ?, 'AVAILABLE', 'LOCKED', 'LOCKED', 0, 0, 0, 0.00, FALSE, FALSE, 'IN_PROGRESS')`,
                    [userId, subMaterialId]
                );
                const [newProg] = await conn.query<StudentSubMaterialProgressRow[]>(
                    `SELECT * FROM student_sub_material_progress WHERE user_id = ? AND sub_material_id = ?`,
                    [userId, subMaterialId]
                );
                prog = newProg[0];
            }

            // Update status dan skor level terkait
            let l1Score = prog.level_1_score;
            let l2Score = prog.level_2_score;
            let l3Score = prog.level_3_score;
            let l1Status = prog.level_1_status;
            let l2Status = prog.level_2_status;
            let l3Status = prog.level_3_status;

            if (levelNumber === 1) {
                l1Score = Math.max(l1Score, correctAnswers);
                l1Status = isPassed ? "COMPLETED" : "NEEDS_REMEDIAL";
                if (isPassed && l2Status === "LOCKED") l2Status = "AVAILABLE";
            } else if (levelNumber === 2) {
                l2Score = Math.max(l2Score, correctAnswers);
                l2Status = isPassed ? "COMPLETED" : "NEEDS_REMEDIAL";
                if (isPassed && l3Status === "LOCKED") l3Status = "AVAILABLE";
            } else if (levelNumber === 3) {
                l3Score = Math.max(l3Score, correctAnswers);
                l3Status = isPassed ? "COMPLETED" : "NEEDS_REMEDIAL";
            }

            const totalCumulative = l1Score + l2Score + l3Score;
            const allLevelsCompleted = l1Status === "COMPLETED" && l2Status === "COMPLETED" && l3Status === "COMPLETED";
            const isMastered = allLevelsCompleted && totalCumulative >= 27;

            let xpEarned = 0;
            let masteryBonusEarned = 0;

            // Beri XP kelulusan level
            if (isPassed) {
                xpEarned = xpRewardLevel;
                await conn.execute(
                    `INSERT INTO xp_transactions (user_id, sub_material_id, session_id, transaction_type, xp_amount, description)
                     VALUES (?, ?, ?, 'LEVEL_COMPLETION', ?, ?)`,
                    [userId, subMaterialId, sessionId, xpEarned, `Kelulusan Level ${levelNumber}`]
                );
            }

            // Beri bonus Mastery +250 XP (Hanya 1x seumur hidup via flag is_xp_awarded)
            let isXpAwarded = prog.is_xp_awarded;
            if (isMastered && !isXpAwarded) {
                masteryBonusEarned = 250;
                isXpAwarded = true;
                await conn.execute(
                    `INSERT INTO xp_transactions (user_id, sub_material_id, transaction_type, xp_amount, description)
                     VALUES (?, ?, 'SUB_MATERIAL_MASTERY', ?, 'Bonus Puncak Dual-Condition Mastery (+250 XP)')`,
                    [userId, subMaterialId, masteryBonusEarned]
                );
            }

            // Perbarui student_sub_material_progress
            await conn.execute(
                `UPDATE student_sub_material_progress 
                 SET level_1_status = ?, level_2_status = ?, level_3_status = ?,
                     level_1_score = ?, level_2_score = ?, level_3_score = ?,
                     total_cumulative_score = ?, is_mastered = ?, is_xp_awarded = ?,
                     progress_state = ?, mastered_at = ?, updated_at = NOW()
                 WHERE id = ?`,
                [
                    l1Status,
                    l2Status,
                    l3Status,
                    l1Score,
                    l2Score,
                    l3Score,
                    totalCumulative,
                    isMastered,
                    isXpAwarded,
                    isMastered ? "MASTERED" : "IN_PROGRESS",
                    isMastered && !prog.mastered_at ? new Date() : prog.mastered_at,
                    prog.id,
                ]
            );

            // Tambahkan total XP di user_profiles dan update tier jika naik tingkat
            const totalXpToAdd = xpEarned + masteryBonusEarned;
            if (totalXpToAdd > 0) {
                await conn.execute(
                    `UPDATE user_profiles SET total_xp = total_xp + ? WHERE user_id = ?`,
                    [totalXpToAdd, userId]
                );

                // Cek apakah naik milestone tier
                const [prof] = await conn.query<Array<RowDataPacket & { total_xp: number }>>(
                    `SELECT total_xp FROM user_profiles WHERE user_id = ?`,
                    [userId]
                );
                const currentTotalXp = prof[0]?.total_xp || 0;

                const [newTier] = await conn.query<Array<RowDataPacket & { id: number }>>(
                    `SELECT id FROM milestone_tiers 
                     WHERE ? >= min_xp AND (? <= max_xp OR max_xp IS NULL)
                     ORDER BY tier_number DESC LIMIT 1`,
                    [currentTotalXp, currentTotalXp]
                );
                if (newTier[0]) {
                    await conn.execute(
                        `UPDATE user_profiles SET current_milestone_tier_id = ? WHERE user_id = ?`,
                        [newTier[0].id, userId]
                    );
                }
            }

            let nextLevelUnlocked: number | null = null;
            if (isPassed && levelNumber < 3) {
                nextLevelUnlocked = levelNumber + 1;
            }

            return {
                totalQuestions,
                correctAnswers,
                score,
                isPassed,
                xpEarned,
                masteryBonusEarned,
                isSubMaterialMastered: isMastered,
                nextLevelUnlocked,
                needsRemedial,
            };
        });
    }

    async getReviewQuestions(sessionId: number): Promise<Array<RowDataPacket & {
        question_order: number;
        question_text: string;
        stimulus_text: string | null;
        is_answer_correct: number;
        explanation_text: string | null;
        reasoning_guide: string | null;
        reference_url: string | null;
        option_id: number;
        option_label: string;
        option_text: string;
        is_correct: number;
        is_selected: number;
    }>> {
        return query(
            `SELECT 
                sq.question_order,
                qb.question_text,
                stm.stimulus_text,
                COALESCE(sa.is_correct, 0) AS is_answer_correct,
                qe.explanation_text,
                qe.reasoning_guide,
                qe.reference_url,
                qo.id AS option_id,
                qo.option_label,
                qo.option_text,
                qo.is_correct,
                CASE WHEN sao.selected_option_id IS NOT NULL THEN 1 ELSE 0 END AS is_selected
             FROM session_questions sq
             JOIN question_banks qb ON qb.id = sq.question_id
             LEFT JOIN stimuli stm ON stm.id = qb.stimulus_id
             LEFT JOIN question_explanations qe ON qe.question_id = qb.id
             JOIN question_options qo ON qo.question_id = qb.id
             LEFT JOIN student_answers sa ON sa.session_question_id = sq.id
             LEFT JOIN student_answer_options sao 
                ON sao.student_answer_id = sa.id AND sao.selected_option_id = qo.id
             WHERE sq.session_id = ?
             ORDER BY sq.question_order ASC, qo.option_label ASC`,
            [sessionId]
        );
    }
}
