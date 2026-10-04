import { PoolConnection, RowDataPacket } from "mysql2/promise";

export interface QuestionEvalInput {
    questionFormat: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
    totalCorrectOptions: number;
    selectedCorrectCount: number;
    selectedIncorrectCount: number;
}

export interface QuestionEvalResult {
    score: number;
    isCorrect: boolean;
}

/**
 * Menghitung nilai butir soal.
 * - SINGLE_CHOICE: 1 benar dan 0 salah -> 1.00 (benar), lainnya -> 0.00 (salah)
 * - COMPLEX_CHOICE:
 *   - >= 2 benar dan 0 salah -> 1.00 (benar)
 *   - 1 benar dan 0 salah -> 0.50 (nilai setengah, isCorrect: false)
 *   - lainnya (ada salah atau 0 benar) -> 0.00 (salah)
 */
export function scoreQuestion(input: QuestionEvalInput): QuestionEvalResult {
    const isComplex = input.questionFormat === "COMPLEX_CHOICE" || input.totalCorrectOptions > 1;
    const selectedCorrect = Number(input.selectedCorrectCount || 0);
    const selectedIncorrect = Number(input.selectedIncorrectCount || 0);

    if (isComplex) {
        if (selectedCorrect >= 2 && selectedIncorrect === 0) {
            return { score: 1.0, isCorrect: true };
        } else if (selectedCorrect === 1 && selectedIncorrect === 0) {
            // Ketika 1 yang benar dan tidak ada yang salah maka diberi nilai setengah (0.50)
            return { score: 0.5, isCorrect: false };
        } else {
            return { score: 0.0, isCorrect: false };
        }
    } else {
        if (selectedCorrect === 1 && selectedIncorrect === 0) {
            return { score: 1.0, isCorrect: true };
        } else {
            return { score: 0.0, isCorrect: false };
        }
    }
}

export interface GradedAnswerItem {
    sessionQuestionId: number;
    studentAnswerId: number | null;
    subjectId?: number;
    questionFormat: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
    score: number;
    isCorrect: boolean;
}

export interface SessionGradingResult {
    totalQuestions: number;
    totalScore: number;
    correctAnswers: number;
    percentageScore: number;
    items: GradedAnswerItem[];
    subjectBreakdown: Map<number, { correct: number; total: number }>;
}

/**
 * Melakukan penilaian dan memperbarui student_answers dalam sesi pengerjaan.
 */
export async function gradeSession(
    conn: PoolConnection,
    sessionId: number
): Promise<SessionGradingResult> {
    const [evalRows] = await conn.query<Array<RowDataPacket & {
        session_question_id: number;
        student_answer_id: number | null;
        subject_id?: number;
        question_format: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
        total_correct_options: number;
        selected_correct_count: number;
        selected_incorrect_count: number;
    }>>(
        `SELECT 
            sq.id AS session_question_id,
            sa.id AS student_answer_id,
            qb.subject_id,
            qb.question_format,
            COUNT(DISTINCT CASE WHEN qo.is_correct = TRUE THEN qo.id END) AS total_correct_options,
            COUNT(DISTINCT CASE WHEN qo.is_correct = TRUE AND sao.selected_option_id IS NOT NULL THEN qo.id END) AS selected_correct_count,
            COUNT(DISTINCT CASE WHEN qo.is_correct = FALSE AND sao.selected_option_id IS NOT NULL THEN qo.id END) AS selected_incorrect_count
         FROM session_questions sq
         JOIN question_banks qb ON qb.id = sq.question_id
         LEFT JOIN student_answers sa ON sa.session_question_id = sq.id
         LEFT JOIN question_options qo ON qo.question_id = qb.id
         LEFT JOIN student_answer_options sao 
            ON sao.student_answer_id = sa.id AND sao.selected_option_id = qo.id
         WHERE sq.session_id = ?
         GROUP BY sq.id, sa.id, qb.subject_id, qb.question_format`,
        [sessionId]
    );

    let totalScore = 0;
    const items: GradedAnswerItem[] = [];
    const subjectBreakdown = new Map<number, { correct: number; total: number }>();

    for (const r of evalRows) {
        const evalRes = scoreQuestion({
            questionFormat: r.question_format,
            totalCorrectOptions: Number(r.total_correct_options || 0),
            selectedCorrectCount: Number(r.selected_correct_count || 0),
            selectedIncorrectCount: Number(r.selected_incorrect_count || 0),
        });

        if (r.student_answer_id) {
            await conn.execute(
                `UPDATE student_answers SET is_correct = ?, score = ? WHERE id = ?`,
                [evalRes.isCorrect, evalRes.score, r.student_answer_id]
            );
        } else {
            await conn.execute(
                `INSERT INTO student_answers (session_question_id, score, is_correct, is_flagged, is_skipped, time_spent_seconds, answered_at)
                 VALUES (?, ?, FALSE, FALSE, TRUE, 0, NOW())`,
                [r.session_question_id, evalRes.score]
            );
        }

        totalScore += evalRes.score;
        items.push({
            sessionQuestionId: r.session_question_id,
            studentAnswerId: r.student_answer_id,
            subjectId: r.subject_id,
            questionFormat: r.question_format,
            score: evalRes.score,
            isCorrect: evalRes.isCorrect,
        });

        if (r.subject_id !== undefined && r.subject_id !== null) {
            const subj = subjectBreakdown.get(r.subject_id) || { correct: 0, total: 0 };
            subj.total += 1;
            subj.correct += evalRes.score;
            subjectBreakdown.set(r.subject_id, subj);
        }
    }

    const totalQuestions = evalRows.length;
    const percentageScore = totalQuestions > 0
        ? Math.round((totalScore / totalQuestions) * 100 * 100) / 100
        : 0;

    return {
        totalQuestions,
        totalScore,
        correctAnswers: totalScore,
        percentageScore,
        items,
        subjectBreakdown,
    };
}
