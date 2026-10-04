import { query, withTransaction } from "@/shared/db";
import {
    SimulationRow,
    LearningSessionRow,
    StudentAnswerRow,
} from "@/shared/types/database.types";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { gradeSession } from "@/shared/assessment/scoring";
import { awardXp } from "@/shared/assessment/xp";
import { shuffleKeepingStimulusGroups } from "@/shared/assessment/question-selection";
import { NotFoundError, BadRequestError } from "@/shared/errors/app-error";

export class SimulationRepository {
    async checkEligibility(subjectId: number, userId: string): Promise<{
        subjectName: string;
        total: number;
        mastered: number;
        unmastered: Array<{ sub_material_id: number; material_title: string; sub_material_title: string }>;
    }> {
        const subjRows = await query<Array<RowDataPacket & { name: string }>>(
            `SELECT name FROM subjects WHERE id = ?`,
            [subjectId]
        );
        const subjectName = subjRows[0]?.name || "Mata Pelajaran";

        const rows = await query<Array<RowDataPacket & {
            sub_material_id: number;
            material_title: string;
            sub_material_title: string;
            is_mastered: number | null;
        }>>(
            `SELECT 
                sm.id AS sub_material_id,
                m.title AS material_title,
                sm.title AS sub_material_title,
                smp.is_mastered
             FROM sub_materials sm
             JOIN materials m ON m.id = sm.material_id
             LEFT JOIN student_sub_material_progress smp 
                ON smp.sub_material_id = sm.id AND smp.user_id = ?
             WHERE m.subject_id = ? AND sm.is_active = TRUE AND m.is_active = TRUE
             ORDER BY m.order_index ASC, sm.order_index ASC`,
            [userId, subjectId]
        );

        const total = rows.length;
        const unmastered: Array<{ sub_material_id: number; material_title: string; sub_material_title: string }> = [];
        let mastered = 0;

        for (const r of rows) {
            if (r.is_mastered === 1) {
                mastered++;
            } else {
                unmastered.push({
                    sub_material_id: r.sub_material_id,
                    material_title: r.material_title,
                    sub_material_title: r.sub_material_title,
                });
            }
        }

        return { subjectName, total, mastered, unmastered };
    }

    async getLruPackage(subjectId: number, userId: string): Promise<SimulationRow | null> {
        const rows = await query<SimulationRow[]>(
            `SELECT s.* 
             FROM simulations s
             LEFT JOIN learning_sessions ls 
               ON ls.simulation_id = s.id AND ls.user_id = ?
             WHERE s.subject_id = ? AND s.status = 'ACTIVE' AND s.is_active = TRUE
             GROUP BY s.id
             ORDER BY COUNT(ls.id) ASC, MAX(ls.end_time) ASC, s.id ASC
             LIMIT 1`,
            [userId, subjectId]
        );
        return rows[0] || null;
    }

    async getPackageById(id: number): Promise<SimulationRow | null> {
        const rows = await query<SimulationRow[]>(
            `SELECT * FROM simulations WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    async findActiveSession(subjectId: number, userId: string): Promise<LearningSessionRow | null> {
        const rows = await query<LearningSessionRow[]>(
            `SELECT * FROM learning_sessions 
             WHERE user_id = ? AND subject_id = ? AND session_type = 'SIMULATION' AND status = 'IN_PROGRESS'
             ORDER BY id DESC LIMIT 1`,
            [userId, subjectId]
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

    async getSessionQuestionById(sessionQuestionId: number, sessionId: number): Promise<{ id: number; question_order: number } | null> {
        const rows = await query<Array<RowDataPacket & { id: number; question_order: number }>>(
            `SELECT id, question_order FROM session_questions WHERE id = ? AND session_id = ?`,
            [sessionQuestionId, sessionId]
        );
        return rows[0] || null;
    }

    async getSessionXpEarned(sessionId: number): Promise<number> {
        const rows = await query<Array<RowDataPacket & { xp: number }>>(
            `SELECT COALESCE(SUM(xp_amount), 0) AS xp FROM xp_transactions WHERE session_id = ?`,
            [sessionId]
        );
        return Number(rows[0]?.xp || 0);
    }

    async countAttempts(userId: string, subjectId: number): Promise<number> {
        const rows = await query<(RowDataPacket & { total: number })[]>(
            `SELECT COUNT(*) AS total FROM learning_sessions 
             WHERE user_id = ? AND subject_id = ? AND session_type = 'SIMULATION'`,
            [userId, subjectId]
        );
        return rows[0]?.total || 0;
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

    async countDoubtfulAnswers(sessionId: number): Promise<number> {
        const rows = await query<(RowDataPacket & { total: number })[]>(
            `SELECT COUNT(*) AS total
             FROM student_answers sa
             JOIN session_questions sq ON sq.id = sa.session_question_id
             WHERE sq.session_id = ? AND sa.is_flagged = TRUE`,
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

    async createSession(
        userId: string,
        subjectId: number,
        simulationId: number,
        attemptNumber: number
    ): Promise<number> {
        return withTransaction(async (conn) => {
            const [pkgRows] = await conn.query<Array<RowDataPacket & { duration_minutes: number; total_questions: number }>>(
                `SELECT duration_minutes, total_questions FROM simulations WHERE id = ?`,
                [simulationId]
            );
            const durationMinutes = pkgRows[0]?.duration_minutes || 75;
            const totalQuestions = pkgRows[0]?.total_questions || 30;

            const [questions] = await conn.query<Array<RowDataPacket & { question_id: number; question_order: number; stimulus_id: number | null }>>(
                `SELECT sq.question_id, sq.question_order, qb.stimulus_id
                 FROM simulation_questions sq
                 JOIN question_banks qb ON qb.id = sq.question_id
                 WHERE sq.simulation_id = ?
                 ORDER BY sq.question_order ASC`,
                [simulationId]
            );

            // Acak urutan nomor soal namun tetap menjaga soal berstimulus tetap berurutan (DOC-10 §5.4) (Finding #4)
            const orderedQuestions = shuffleKeepingStimulusGroups(questions);

            const [sessionResult] = await conn.execute<ResultSetHeader>(
                `INSERT INTO learning_sessions 
                 (user_id, subject_id, session_type, simulation_id, attempt_number, status, total_questions, correct_answers, score, is_passed, remaining_time_seconds, current_question_order, start_time)
                 VALUES (?, ?, 'SIMULATION', ?, ?, 'IN_PROGRESS', ?, 0, 0.00, FALSE, ?, 1, NOW())`,
                [userId, subjectId, simulationId, attemptNumber, orderedQuestions.length || totalQuestions, durationMinutes * 60]
            );
            const sessionId = sessionResult.insertId;

            for (let i = 0; i < orderedQuestions.length; i++) {
                await conn.execute(
                    `INSERT INTO session_questions (session_id, question_id, question_order)
                     VALUES (?, ?, ?)`,
                    [sessionId, orderedQuestions[i].question_id, i + 1]
                );
            }

            return sessionId;
        });
    }

    async getSessionQuestions(sessionId: number): Promise<Array<RowDataPacket & {
        session_question_id: number;
        question_order: number;
        question_id: number;
        question_type: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
        question_text: string;
        question_image_url: string | null;
        stimulus_image_url: string | null;
        stimulus_id: number | null;
        stimulus_title: string | null;
        stimulus_text: string | null;
        stimulus_subject_id: number | null;
        option_id: number;
        option_label: "A" | "B" | "C" | "D";
        option_text: string;
    }>> {
        return query(
            `SELECT 
                sq.id AS session_question_id,
                sq.question_order,
                qb.id AS question_id,
                qb.question_format AS question_type,
                qb.question_text,
                qb.question_image_url AS question_image_url,
                stm.stimulus_image_url AS stimulus_image_url,
                stm.id AS stimulus_id,
                stm.title AS stimulus_title,
                stm.stimulus_text,
                stm.subject_id AS stimulus_subject_id,
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
        is_doubtful: number;
        is_skipped: number;
        time_spent_seconds: number;
        selected_option_id: number | null;
    }>> {
        return query(
            `SELECT 
                sa.session_question_id,
                sa.is_flagged AS is_doubtful,
                sa.is_skipped,
                sa.time_spent_seconds,
                sao.selected_option_id
             FROM student_answers sa
             JOIN session_questions sq ON sq.id = sa.session_question_id
             LEFT JOIN student_answer_options sao ON sao.student_answer_id = sa.id
             WHERE sq.session_id = ?`,
            [sessionId]
        );
    }

    async upsertAnswer(
        sessionQuestionId: number,
        selectedOptionIds: number[],
        isDoubtful = false,
        timeSpent = 0,
        currentQuestionOrder?: number,
        attemptId?: number
    ): Promise<{
        sessionQuestionId: number;
        answeredAt: Date;
        isDoubtful: boolean;
        remainingSeconds: number;
        currentQuestionOrder: number;
    }> {
        return withTransaction(async (conn) => {
            const querySql = attemptId
                ? `SELECT sq.session_id, sq.question_id, sq.question_order, ls.start_time, s.duration_minutes
                   FROM session_questions sq
                   JOIN learning_sessions ls ON ls.id = sq.session_id
                   LEFT JOIN simulations s ON s.id = ls.simulation_id
                   WHERE sq.id = ? AND sq.session_id = ?`
                : `SELECT sq.session_id, sq.question_id, sq.question_order, ls.start_time, s.duration_minutes
                   FROM session_questions sq
                   JOIN learning_sessions ls ON ls.id = sq.session_id
                   LEFT JOIN simulations s ON s.id = ls.simulation_id
                   WHERE sq.id = ?`;
            const queryParams = attemptId ? [sessionQuestionId, attemptId] : [sessionQuestionId];

            const [sqRows] = await conn.query<Array<RowDataPacket & {
                session_id: number;
                question_id: number;
                question_order: number;
                start_time: Date;
                duration_minutes: number | null;
            }>>(querySql, queryParams);

            if (!sqRows[0]) {
                throw new NotFoundError("Nomor soal tidak terdaftar pada sesi simulasi ini");
            }

            const sessionId = sqRows[0].session_id;
            const questionId = sqRows[0].question_id;

            // Validasi: Opsi jawaban harus milik soal tersebut (Finding #7)
            const uniqueOptionIds = Array.from(new Set(selectedOptionIds));
            if (uniqueOptionIds.length > 0) {
                const [validOpts] = await conn.query<Array<RowDataPacket & { id: number }>>(
                    `SELECT id FROM question_options WHERE question_id = ? AND id IN (?)`,
                    [questionId, uniqueOptionIds]
                );
                if (validOpts.length !== uniqueOptionIds.length) {
                    throw new BadRequestError("Opsi jawaban tidak valid untuk soal ini");
                }
            }

            const [existing] = await conn.query<StudentAnswerRow[]>(
                `SELECT id FROM student_answers WHERE session_question_id = ?`,
                [sessionQuestionId]
            );

            let answerId: number;
            const now = new Date();
            const isSkipped = uniqueOptionIds.length === 0;

            if (existing.length > 0) {
                answerId = existing[0].id;
                await conn.execute(
                    `UPDATE student_answers 
                     SET is_flagged = ?, is_skipped = ?, time_spent_seconds = time_spent_seconds + ?, answered_at = ?
                     WHERE id = ?`,
                    [isDoubtful, isSkipped, timeSpent, now, answerId]
                );
                await conn.execute(
                    `DELETE FROM student_answer_options WHERE student_answer_id = ?`,
                    [answerId]
                );
            } else {
                const [ins] = await conn.execute<ResultSetHeader>(
                    `INSERT INTO student_answers (session_question_id, is_correct, is_flagged, is_skipped, time_spent_seconds, answered_at)
                     VALUES (?, FALSE, ?, ?, ?, ?)`,
                    [sessionQuestionId, isDoubtful, isSkipped, timeSpent, now]
                );
                answerId = ins.insertId;
            }

            for (const optId of uniqueOptionIds) {
                await conn.execute(
                    `INSERT INTO student_answer_options (student_answer_id, selected_option_id)
                     VALUES (?, ?)`,
                    [answerId, optId]
                );
            }

            let effectiveQuestionOrder = sqRows[0]?.question_order || 1;
            const durationMinutes = sqRows[0]?.duration_minutes || 75;
            let remainingSeconds = durationMinutes * 60;

            if (sqRows[0]?.start_time) {
                const elapsed = Math.floor((Date.now() - new Date(sqRows[0].start_time).getTime()) / 1000);
                remainingSeconds = Math.max(0, durationMinutes * 60 - elapsed);
            }

            if (sessionId && currentQuestionOrder !== undefined) {
                await conn.execute(
                    `UPDATE learning_sessions SET current_question_order = ? WHERE id = ?`,
                    [currentQuestionOrder, sessionId]
                );
                effectiveQuestionOrder = currentQuestionOrder;
            }

            return {
                sessionQuestionId,
                answeredAt: now,
                isDoubtful,
                remainingSeconds,
                currentQuestionOrder: effectiveQuestionOrder,
            };
        });
    }

    async evaluateAndCompleteSession(
        sessionId: number,
        userId: string,
        simulationId: number,
        submissionType: "MANUAL" | "TIMEOUT"
    ): Promise<{
        totalQuestions: number;
        correctAnswers: number;
        score: number;
        isPassed: boolean;
        xpEarned: number;
        durationMinutesUsed: number;
    }> {
        return withTransaction(async (conn) => {
            // Lock session row to prevent race conditions (Finding #15)
            await conn.query<Array<RowDataPacket & { id: number }>>(
                `SELECT id FROM learning_sessions WHERE id = ? FOR UPDATE`,
                [sessionId]
            );

            // Ambil parameter konfigurasi paket simulasi (duration_minutes, passing_score, xp_reward, subject_id)
            const [pkgRows] = await conn.query<Array<RowDataPacket & {
                subject_id: number;
                duration_minutes: number;
                passing_score: number;
                xp_reward: number;
            }>>(
                `SELECT subject_id, duration_minutes, passing_score, xp_reward FROM simulations WHERE id = ?`,
                [simulationId]
            );

            const pkg = pkgRows[0];
            const pkgDuration = pkg?.duration_minutes || 75;
            const passingScore = pkg?.passing_score !== undefined ? Number(pkg.passing_score) : 90.00;
            const xpReward = pkg?.xp_reward !== undefined ? Number(pkg.xp_reward) : 500;
            const subjectId = pkg?.subject_id;

            // Penilaian bersama menggunakan shared grading helper
            const grading = await gradeSession(conn, sessionId);
            const totalQuestions = grading.totalQuestions || 30;
            const numericCorrectAnswers = Number(grading.correctAnswers);
            const score = grading.percentageScore;
            const isPassed = score >= passingScore;

            const [sess] = await conn.query<Array<RowDataPacket & { duration_used_sec: number }>>(
                `SELECT TIMESTAMPDIFF(SECOND, start_time, NOW()) AS duration_used_sec 
                 FROM learning_sessions WHERE id = ?`,
                [sessionId]
            );
            const durationMinutesUsed = Math.min(pkgDuration, Math.ceil((sess[0]?.duration_used_sec || 0) / 60));

            await conn.execute(
                `UPDATE learning_sessions 
                 SET status = 'COMPLETED', submission_type = ?, correct_answers = ?, score = ?, is_passed = ?, remaining_time_seconds = 0, end_time = NOW()
                 WHERE id = ?`,
                [submissionType, numericCorrectAnswers, score, isPassed, sessionId]
            );

            let xpEarned = 0;
            if (isPassed && subjectId) {
                // Periksa apakah reward simulasi pernah diklaim untuk MAPEL ini (Anti-Farming DOC-07) (Finding #14)
                const [existingXp] = await conn.query<Array<RowDataPacket & { id: number }>>(
                    `SELECT xt.id FROM xp_transactions xt
                     JOIN simulations s ON s.id = xt.simulation_id
                     WHERE xt.user_id = ? AND s.subject_id = ? AND xt.transaction_type = 'SIMULATION_COMPLETION'`,
                    [userId, subjectId]
                );

                if (existingXp.length === 0) {
                    xpEarned = xpReward;
                    // awardXp otomatis menambah total_xp dan memperbarui milestone tier (Finding #6)
                    await awardXp(conn, {
                        userId,
                        simulationId,
                        sessionId,
                        transactionType: "SIMULATION_COMPLETION",
                        amount: xpEarned,
                        description: `Bonus Kelulusan Prima Simulasi Ujian TKA (+${xpEarned} XP)`,
                    });
                }
            }

            return {
                totalQuestions,
                correctAnswers: numericCorrectAnswers,
                score,
                isPassed,
                xpEarned,
                durationMinutesUsed,
            };
        });
    }

    async getReviewQuestions(sessionId: number): Promise<Array<RowDataPacket & {
        session_question_id: number;
        question_order: number;
        question_text: string;
        question_image_url: string | null;
        stimulus_image_url: string | null;
        stimulus_id: number | null;
        stimulus_title: string | null;
        stimulus_text: string | null;
        stimulus_subject_id: number | null;
        is_answer_correct: number;
        time_spent_seconds: number;
        explanation_text: string | null;
        reasoning_guide: string | null;
        reference_url: string | null;
        option_id: number;
        option_label: "A" | "B" | "C" | "D";
        option_text: string;
        is_correct: number;
        is_selected: number;
    }>> {
        return query(
            `SELECT 
                sq.id AS session_question_id,
                sq.question_order,
                qb.question_text,
                qb.question_image_url AS question_image_url,
                stm.stimulus_image_url AS stimulus_image_url,
                stm.id AS stimulus_id,
                stm.title AS stimulus_title,
                stm.stimulus_text,
                stm.subject_id AS stimulus_subject_id,
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
