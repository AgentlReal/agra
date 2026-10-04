import { query, withTransaction } from "@/shared/db";
import { NotFoundError, BadRequestError } from "@/shared/errors/app-error";
import {
    LearningSessionRow,
    QuestionBankRow,
    StudentSubMaterialProgressRow,
    StudentAnswerRow,
} from "@/shared/types/database.types";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { gradeSession } from "@/shared/assessment/scoring";
import { awardXp } from "@/shared/assessment/xp";
import { selectUnseenFirst } from "@/shared/assessment/question-selection";

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
        limit = 10,
        userId?: string
    ): Promise<QuestionBankRow[]> {
        const candidates = await query<QuestionBankRow[]>(
            `SELECT * FROM question_banks 
             WHERE sub_material_id = ? AND cognitive_level_id = ? 
               AND bank_type = 'LEVEL_EXERCISE' AND is_active = TRUE
             ORDER BY id ASC`,
            [subMaterialId, cognitiveLevelId]
        );

        if (!userId) {
            return selectUnseenFirst(candidates, { limit });
        }

        const lastSeenRows = await query<Array<RowDataPacket & { question_id: number; last_seen_at: Date }>>(
            `SELECT sq.question_id, MAX(ls.start_time) AS last_seen_at
             FROM session_questions sq
             JOIN learning_sessions ls ON ls.id = sq.session_id
             WHERE ls.user_id = ? AND ls.sub_material_id = ? AND ls.cognitive_level_id = ?
               AND ls.session_type = 'LEVEL_EXERCISE'
             GROUP BY sq.question_id`,
            [userId, subMaterialId, cognitiveLevelId]
        );

        const lastSeenMap = new Map<number, Date>();
        for (const row of lastSeenRows) {
            lastSeenMap.set(row.question_id, row.last_seen_at);
        }

        const prevAttemptRows = await query<Array<RowDataPacket & { question_id: number }>>(
            `SELECT sq.question_id
             FROM session_questions sq
             JOIN learning_sessions ls ON ls.id = sq.session_id
             WHERE ls.user_id = ? AND ls.sub_material_id = ? AND ls.cognitive_level_id = ?
               AND ls.session_type = 'LEVEL_EXERCISE'
             ORDER BY ls.id DESC
             LIMIT ?`,
            [userId, subMaterialId, cognitiveLevelId, limit]
        );

        const lastAttemptQuestionIds = prevAttemptRows.map((r) => r.question_id);

        return selectUnseenFirst(candidates, {
            limit,
            lastSeenMap,
            lastAttemptQuestionIds,
        });
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
        stimulus_id: number | null;
        stimulus_title: string | null;
        stimulus_subject_id: number | null;
        stimulus_text: string | null;
        stimulus_image_url: string | null;
        question_image_url: string | null;
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
                stm.id AS stimulus_id,
                stm.title AS stimulus_title,
                stm.subject_id AS stimulus_subject_id,
                stm.stimulus_text,
                stm.stimulus_image_url AS stimulus_image_url,
                qb.question_image_url AS question_image_url,
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
        attemptId: number,
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
            const [sqRows] = await conn.query<Array<RowDataPacket & { session_id: number; question_id: number; question_order: number; total_questions: number }>>(
                `SELECT sq.session_id, sq.question_id, sq.question_order, ls.total_questions
                 FROM session_questions sq
                 JOIN learning_sessions ls ON ls.id = sq.session_id
                 WHERE sq.id = ? AND sq.session_id = ?`,
                [sessionQuestionId, attemptId]
            );
            if (!sqRows[0]) {
                throw new NotFoundError("Nomor soal tidak terdaftar pada sesi latihan ini");
            }
            const sessionId = sqRows[0].session_id;

            const uniqueOptionIds = Array.from(new Set(selectedOptionIds));
            if (!isSkipped && uniqueOptionIds.length > 0) {
                const [validOpts] = await conn.query<Array<RowDataPacket & { id: number }>>(
                    `SELECT id FROM question_options WHERE question_id = ? AND id IN (?)`,
                    [sqRows[0].question_id, uniqueOptionIds]
                );
                if (validOpts.length !== uniqueOptionIds.length) {
                    throw new BadRequestError("Opsi jawaban tidak valid untuk soal ini");
                }
            }

            const totalQuestions = Number(sqRows[0].total_questions) || 10;
            if (currentQuestionOrder !== undefined && currentQuestionOrder > totalQuestions) {
                throw new BadRequestError(`Nomor urut soal melebihi jumlah soal sesi (${totalQuestions})`);
            }

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

            if (!isSkipped && uniqueOptionIds.length > 0) {
                for (const optId of uniqueOptionIds) {
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

            const remainingUnansweredCount = Math.max(0, totalQuestions - answeredCount);

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
            // Lock session row to prevent race conditions (Finding #15)
            await conn.query<Array<RowDataPacket & { id: number }>>(
                `SELECT id FROM learning_sessions WHERE id = ? FOR UPDATE`,
                [sessionId]
            );

            // Hitung kebenaran tiap soal menggunakan shared grading helper
            const grading = await gradeSession(conn, sessionId);

            const totalQuestions = grading.totalQuestions || 10;
            const numericCorrectAnswers = Number(grading.correctAnswers);
            const score = grading.percentageScore;
            const isPassed = numericCorrectAnswers >= 9; // Syarat >= 9 dari 10 (90%)
            const needsRemedial = !isPassed;

            // Selesaikan session
            await conn.execute(
                `UPDATE learning_sessions 
                 SET status = 'COMPLETED', submission_type = 'MANUAL', correct_answers = ?, score = ?, is_passed = ?, end_time = NOW()
                 WHERE id = ?`,
                [numericCorrectAnswers, score, isPassed, sessionId]
            );

            // Ambil / inisialisasi student_sub_material_progress dengan FOR UPDATE
            const [progRows] = await conn.query<StudentSubMaterialProgressRow[]>(
                `SELECT * FROM student_sub_material_progress 
                 WHERE user_id = ? AND sub_material_id = ? FOR UPDATE`,
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
            let l1Score = Number(prog.level_1_score) || 0;
            let l2Score = Number(prog.level_2_score) || 0;
            let l3Score = Number(prog.level_3_score) || 0;
            let l1Status = prog.level_1_status;
            let l2Status = prog.level_2_status;
            let l3Status = prog.level_3_status;

            const wasLevelAlreadyCompleted =
                (levelNumber === 1 && l1Status === "COMPLETED") ||
                (levelNumber === 2 && l2Status === "COMPLETED") ||
                (levelNumber === 3 && l3Status === "COMPLETED");

            if (levelNumber === 1) {
                l1Score = Math.max(l1Score, numericCorrectAnswers);
                if (isPassed) {
                    l1Status = "COMPLETED";
                    if (l2Status === "LOCKED") l2Status = "AVAILABLE";
                } else if (l1Status !== "COMPLETED") {
                    // Finding #1: Jangan menimpa status jika sudah COMPLETED sebelumnya
                    l1Status = "NEEDS_REMEDIAL";
                }
            } else if (levelNumber === 2) {
                l2Score = Math.max(l2Score, numericCorrectAnswers);
                if (isPassed) {
                    l2Status = "COMPLETED";
                    if (l3Status === "LOCKED") l3Status = "AVAILABLE";
                } else if (l2Status !== "COMPLETED") {
                    // Finding #1: Jangan menimpa status jika sudah COMPLETED sebelumnya
                    l2Status = "NEEDS_REMEDIAL";
                }
            } else if (levelNumber === 3) {
                l3Score = Math.max(l3Score, numericCorrectAnswers);
                if (isPassed) {
                    l3Status = "COMPLETED";
                } else if (l3Status !== "COMPLETED") {
                    // Finding #1: Jangan menimpa status jika sudah COMPLETED sebelumnya
                    l3Status = "NEEDS_REMEDIAL";
                }
            }

            const totalCumulative = l1Score + l2Score + l3Score;
            const allLevelsCompleted = l1Status === "COMPLETED" && l2Status === "COMPLETED" && l3Status === "COMPLETED";
            const isMastered = allLevelsCompleted && totalCumulative >= 27;

            let xpEarned = 0;
            let masteryBonusEarned = 0;

            // Beri XP kelulusan level HANYA saat pertama kali lulus (Anti-Farming DOC-06) (Finding #2)
            if (isPassed && !wasLevelAlreadyCompleted) {
                xpEarned = xpRewardLevel;
                await awardXp(conn, {
                    userId,
                    subMaterialId,
                    sessionId,
                    transactionType: "LEVEL_COMPLETION",
                    amount: xpEarned,
                    description: `Kelulusan Level ${levelNumber}`,
                });
            }

            // Beri bonus Mastery +250 XP (Hanya 1x seumur hidup via flag is_xp_awarded)
            let isXpAwarded = prog.is_xp_awarded;
            if (isMastered && !isXpAwarded) {
                masteryBonusEarned = 250;
                isXpAwarded = true;
                await awardXp(conn, {
                    userId,
                    subMaterialId,
                    transactionType: "SUB_MATERIAL_MASTERY",
                    amount: masteryBonusEarned,
                    description: "Bonus Puncak Dual-Condition Mastery (+250 XP)",
                });
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

            let nextLevelUnlocked: number | null = null;
            if (isPassed && levelNumber < 3) {
                nextLevelUnlocked = levelNumber + 1;
            }

            return {
                totalQuestions,
                correctAnswers: numericCorrectAnswers,
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
        session_question_id: number;
        question_order: number;
        question_text: string;
        stimulus_id: number | null;
        stimulus_title: string | null;
        stimulus_subject_id: number | null;
        stimulus_text: string | null;
        stimulus_image_url: string | null;
        question_image_url: string | null;
        is_answer_correct: number;
        time_spent_seconds: number;
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
                sq.id AS session_question_id,
                sq.question_order,
                qb.question_text,
                stm.id AS stimulus_id,
                stm.title AS stimulus_title,
                stm.subject_id AS stimulus_subject_id,
                stm.stimulus_text,
                stm.stimulus_image_url AS stimulus_image_url,
                qb.question_image_url AS question_image_url,
                COALESCE(sa.is_correct, 0) AS is_answer_correct,
                COALESCE(sa.time_spent_seconds, 0) AS time_spent_seconds,
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
