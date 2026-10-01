import { query, withTransaction } from "@/shared/db";
import {
    LearningSessionRow,
    QuestionBankRow,
    StudentAnswerRow,
} from "@/shared/types/database.types";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class RecallRepository {
    async findActiveSession(userId: string): Promise<LearningSessionRow | null> {
        const rows = await query<LearningSessionRow[]>(
            `SELECT * FROM learning_sessions 
             WHERE user_id = ? AND session_type = 'RECALL' AND status = 'IN_PROGRESS'
             ORDER BY id DESC LIMIT 1`,
            [userId]
        );
        return rows[0] || null;
    }

    async countAttempts(userId: string): Promise<number> {
        const rows = await query<(RowDataPacket & { total: number })[]>(
            `SELECT COUNT(*) AS total FROM learning_sessions 
             WHERE user_id = ? AND session_type = 'RECALL'`,
            [userId]
        );
        return rows[0]?.total || 0;
    }

    async getLatestAttempt(userId: string): Promise<LearningSessionRow | null> {
        const rows = await query<LearningSessionRow[]>(
            `SELECT * FROM learning_sessions 
             WHERE user_id = ? AND session_type = 'RECALL'
             ORDER BY id DESC LIMIT 1`,
            [userId]
        );
        return rows[0] || null;
    }

    async pickRecallQuestions(matCount = 15, binCount = 15): Promise<QuestionBankRow[]> {
        // Ambil soal MAT (subject_id = 1) dan BIN (subject_id = 2) dari bank RECALL
        const matQuestions = await query<QuestionBankRow[]>(
            `SELECT * FROM question_banks 
             WHERE bank_type = 'RECALL' AND subject_id = 1 AND is_active = TRUE
             ORDER BY RAND() LIMIT ?`,
            [matCount]
        );

        const binQuestions = await query<QuestionBankRow[]>(
            `SELECT * FROM question_banks 
             WHERE bank_type = 'RECALL' AND subject_id = 2 AND is_active = TRUE
             ORDER BY RAND() LIMIT ?`,
            [binCount]
        );

        return [...matQuestions, ...binQuestions];
    }

    async createSessionWithQuestions(
        userId: string,
        attemptNumber: number,
        questions: QuestionBankRow[]
    ): Promise<number> {
        return withTransaction(async (conn) => {
            const [sessionResult] = await conn.execute<ResultSetHeader>(
                `INSERT INTO learning_sessions 
                 (user_id, session_type, attempt_number, status, total_questions, correct_answers, score, is_passed, current_question_order, start_time)
                 VALUES (?, 'RECALL', ?, 'IN_PROGRESS', ?, 0, 0.00, FALSE, 1, NOW())`,
                [userId, attemptNumber, questions.length]
            );
            const sessionId = sessionResult.insertId;

            // Masukkan butir lembar soal teracak
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

    async getSessionById(sessionId: number, userId: string): Promise<LearningSessionRow | null> {
        const rows = await query<LearningSessionRow[]>(
            `SELECT * FROM learning_sessions WHERE id = ? AND user_id = ?`,
            [sessionId, userId]
        );
        return rows[0] || null;
    }

    async getSessionQuestionsWithOptions(sessionId: number): Promise<Array<RowDataPacket & {
        session_question_id: number;
        question_order: number;
        question_id: number;
        subject_id: number;
        question_text: string;
        question_format: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
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
                qb.subject_id,
                qb.question_text,
                qb.question_format,
                qb.stimulus_image_url,
                qo.id AS option_id,
                qo.option_label,
                qo.option_text
             FROM session_questions sq
             JOIN question_banks qb ON qb.id = sq.question_id
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

    async upsertAnswer(
        sessionQuestionId: number,
        selectedOptionIds: number[],
        isSkipped = false,
        timeSpent = 0,
        currentQuestionOrder?: number
    ): Promise<{ answeredAt: Date; answeredCount: number; currentQuestionOrder: number }> {
        return withTransaction(async (conn) => {
            const [sqRows] = await conn.query<Array<RowDataPacket & { session_id: number }>>(
                `SELECT session_id FROM session_questions WHERE id = ?`,
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

            let effectiveQuestionOrder = 1;
            if (sessionId) {
                if (currentQuestionOrder !== undefined) {
                    await conn.execute(
                        `UPDATE learning_sessions SET current_question_order = ? WHERE id = ?`,
                        [currentQuestionOrder, sessionId]
                    );
                    effectiveQuestionOrder = currentQuestionOrder;
                } else {
                    const [sessRows] = await conn.query<Array<RowDataPacket & { current_question_order: number }>>(
                        `SELECT current_question_order FROM learning_sessions WHERE id = ?`,
                        [sessionId]
                    );
                    effectiveQuestionOrder = sessRows[0]?.current_question_order || 1;
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

            return {
                answeredAt: now,
                answeredCount,
                currentQuestionOrder: effectiveQuestionOrder,
            };
        });
    }

    async evaluateAndCompleteSession(sessionId: number, userId: string): Promise<{
        totalQuestions: number;
        correctAnswers: number;
        score: number;
        isPassed: boolean;
        mathCorrect: number;
        mathTotal: number;
        bahasaCorrect: number;
        bahasaTotal: number;
    }> {
        return withTransaction(async (conn) => {
            // Evaluasi All-or-Nothing setiap butir soal
            const [evalRows] = await conn.query<Array<RowDataPacket & {
                session_question_id: number;
                student_answer_id: number | null;
                subject_id: number;
                is_question_correct: number;
            }>>(
                `SELECT 
                    sq.id AS session_question_id,
                    sa.id AS student_answer_id,
                    qb.subject_id,
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
                 GROUP BY sq.id, sa.id, qb.subject_id`,
                [sessionId]
            );

            let mathCorrect = 0;
            let mathTotal = 0;
            let bahasaCorrect = 0;
            let bahasaTotal = 0;
            let totalCorrect = 0;

            for (const r of evalRows) {
                const isCorrect = Boolean(r.is_question_correct);
                if (r.student_answer_id) {
                    await conn.execute(
                        `UPDATE student_answers SET is_correct = ?, score = ? WHERE id = ?`,
                        [isCorrect, isCorrect ? 1.00 : 0.00, r.student_answer_id]
                    );
                } else {
                    await conn.execute(
                        `INSERT INTO student_answers (session_question_id, score, is_correct, is_flagged, is_skipped, time_spent_seconds, answered_at)
                         VALUES (?, 0.00, FALSE, FALSE, TRUE, 0, NOW())`,
                        [r.session_question_id]
                    );
                }
                if (isCorrect) totalCorrect++;

                if (r.subject_id === 1) {
                    mathTotal++;
                    if (isCorrect) mathCorrect++;
                } else if (r.subject_id === 2) {
                    bahasaTotal++;
                    if (isCorrect) bahasaCorrect++;
                }
            }

            const totalQuestions = evalRows.length || 30;
            const score = Math.round((totalCorrect / totalQuestions) * 100 * 100) / 100;
            const isPassed = totalCorrect >= 27; // Ambang kelulusan Recall V6 adalah 27/30 (90%) sesuai API.yaml

            await conn.execute(
                `UPDATE learning_sessions 
                 SET status = 'COMPLETED', submission_type = 'MANUAL', correct_answers = ?, score = ?, is_passed = ?, end_time = NOW()
                 WHERE id = ?`,
                [totalCorrect, score, isPassed, sessionId]
            );

            if (isPassed) {
                await conn.execute(
                    `INSERT INTO user_profiles (user_id, is_recall_passed) 
                     VALUES (?, TRUE)
                     ON DUPLICATE KEY UPDATE is_recall_passed = TRUE`,
                    [userId]
                );
            }

            return {
                totalQuestions,
                correctAnswers: totalCorrect,
                score,
                isPassed,
                mathCorrect,
                mathTotal,
                bahasaCorrect,
                bahasaTotal,
            };
        });
    }


    async getReviewQuestions(sessionId: number): Promise<Array<RowDataPacket & {
        question_order: number;
        subject_id: number;
        question_text: string;
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
                qb.subject_id,
                qb.question_text,
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
