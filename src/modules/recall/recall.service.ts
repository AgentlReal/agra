import { RecallRepository } from "./recall.repository";
import {
    RecallStatusResponse,
    StartRecallAttemptResponse,
    RecallAttemptDetail,
    RecallQuestion,
    SaveRecallAnswerDto,
    RecallAnswerSaveResponse,
    RecallResultResponse,
    RecallReviewResponse,
    RecallReviewItem,
} from "./recall.types";
import { NotFoundError, BadRequestError, AppError } from "@/shared/errors/app-error";

export class RecallService {
    constructor(private readonly repo = new RecallRepository()) {}

    async getRecallStatus(userId: string): Promise<RecallStatusResponse> {
        const latestAttempt = await this.repo.getLatestAttempt(userId);

        return {
            isPassed: Boolean(latestAttempt?.is_passed),
            lastAttemptId: latestAttempt ? latestAttempt.id : null,
        };
    }

    async startRecallAttempt(userId: string): Promise<StartRecallAttemptResponse> {
        const active = await this.repo.findActiveSession(userId);
        if (active) {
            return {
                attemptId: active.id,
                subjectId: null,
                totalQuestions: 30,
            };
        }

        const totalAttempts = await this.repo.countAttempts(userId);
        const questions = await this.repo.pickRecallQuestions(15, 15);

        if (questions.length < 30) {
            throw new BadRequestError(
                "Stok bank soal Recall belum mencukupi (minimal 15 Matematika dan 15 Bahasa Indonesia). Hubungi Tim Kurikulum."
            );
        }

        const sessionId = await this.repo.createSessionWithQuestions(
            userId,
            totalAttempts + 1,
            questions
        );

        return {
            attemptId: sessionId,
            subjectId: null,
            totalQuestions: 30,
        };
    }

    async getRecallAttempt(attemptId: number, userId: string): Promise<RecallAttemptDetail> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi Recall tidak ditemukan");
        }

        const rows = await this.repo.getSessionQuestionsWithOptions(attemptId);
        const savedAnswers = await this.repo.getSavedAnswers(attemptId);
        const answeredCount = await this.repo.countAnsweredQuestions(attemptId);

        const answerMap = new Map<number, { skipped: boolean; selected: number[] }>();
        for (const sa of savedAnswers) {
            const existing = answerMap.get(sa.session_question_id) || {
                skipped: Boolean(sa.is_skipped),
                selected: [],
            };
            if (sa.selected_option_id) {
                existing.selected.push(sa.selected_option_id);
            }
            answerMap.set(sa.session_question_id, existing);
        }

        const questionMap = new Map<number, RecallQuestion>();
        for (const r of rows) {
            if (!questionMap.has(r.session_question_id)) {
                const ans = answerMap.get(r.session_question_id);
                questionMap.set(r.session_question_id, {
                    session_question_id: r.session_question_id,
                    subject_id: r.subject_id,
                    question_order: r.question_order,
                    question_type: r.question_format,
                    question_text: r.question_text,
                    options: [],
                    selected_option_ids: ans?.selected || [],
                    is_skipped: ans?.skipped || false,
                    stimulus: null,
                });
            }

            questionMap.get(r.session_question_id)?.options.push({
                id: r.option_id,
                option_label: r.option_label,
                option_text: r.option_text,
            });
        }

        return {
            attemptId: session.id,
            subjectId: null,
            status: session.status,
            totalQuestions: session.total_questions,
            answeredCount,
            currentQuestionOrder: session.current_question_order,
            questions: Array.from(questionMap.values()),
        };
    }

    async saveAnswer(
        attemptId: number,
        questionId: number,
        userId: string,
        dto: SaveRecallAnswerDto
    ): Promise<RecallAnswerSaveResponse> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi Recall tidak ditemukan");
        }
        if (session.status !== "IN_PROGRESS") {
            throw new BadRequestError("Sesi pengerjaan sudah selesai atau tidak aktif");
        }

        const res = await this.repo.upsertAnswer(
            questionId,
            dto.selectedOptionIds || [],
            dto.isSkipped || false,
            dto.timeSpentSeconds || 0,
            dto.currentQuestionOrder
        );

        return {
            attemptId,
            questionId,
            selectedOptionIds: dto.selectedOptionIds || [],
            isSkipped: Boolean(dto.isSkipped),
            answeredAt: res.answeredAt.toISOString(),
            answeredCount: res.answeredCount,
            currentQuestionOrder: res.currentQuestionOrder,
        };
    }

    async submitAttempt(attemptId: number, userId: string): Promise<RecallResultResponse> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi Recall tidak ditemukan");
        }
        if (session.status === "COMPLETED") {
            return this.getResult(attemptId, userId);
        }

        const res = await this.repo.evaluateAndCompleteSession(attemptId, userId);

        return {
            totalCorrect: res.correctAnswers,
            isPassed: res.isPassed,
            xpEarned: 0,
            subjectResults: [
                {
                    subjectId: 1,
                    correctAnswers: res.mathCorrect,
                    totalQuestions: res.mathTotal || 15,
                },
                {
                    subjectId: 2,
                    correctAnswers: res.bahasaCorrect,
                    totalQuestions: res.bahasaTotal || 15,
                },
            ],
        };
    }

    async getResult(attemptId: number, userId: string): Promise<RecallResultResponse> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi Recall tidak ditemukan");
        }

        const rows = await this.repo.getReviewQuestions(attemptId);
        let mathCorrect = 0;
        let bahasaCorrect = 0;
        for (const r of rows) {
            if (r.is_answer_correct) {
                if (r.subject_id === 1) mathCorrect++;
                else if (r.subject_id === 2) bahasaCorrect++;
            }
        }

        return {
            totalCorrect: session.correct_answers,
            isPassed: Boolean(session.is_passed),
            xpEarned: 0,
            subjectResults: [
                {
                    subjectId: 1,
                    correctAnswers: mathCorrect,
                    totalQuestions: 15,
                },
                {
                    subjectId: 2,
                    correctAnswers: bahasaCorrect,
                    totalQuestions: 15,
                },
            ],
        };
    }

    async getReview(attemptId: number, userId: string): Promise<RecallReviewResponse> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi Recall tidak ditemukan");
        }
        if (session.status !== "COMPLETED") {
            throw new BadRequestError("Review hanya dapat diakses setelah sesi diselesaikan");
        }

        const rows = await this.repo.getReviewQuestions(attemptId);
        const map = new Map<number, RecallReviewItem>();

        for (const r of rows) {
            if (!map.has(r.question_order)) {
                map.set(r.question_order, {
                    session_question_id: r.question_order,
                    subject_id: r.subject_id,
                    question_order: r.question_order,
                    question_text: r.question_text,
                    options: [],
                    selected_option_ids: [],
                    is_correct: Boolean(r.is_answer_correct),
                    explanation_text: r.explanation_text || "",
                    reasoning_guide: r.reasoning_guide || null,
                    reference_url: r.reference_url || null,
                });
            }

            const item = map.get(r.question_order)!;
            item.options.push({
                id: r.option_id,
                option_label: r.option_label as "A" | "B" | "C" | "D",
                option_text: r.option_text,
                is_correct: Boolean(r.is_correct),
            });
            if (r.is_selected) {
                item.selected_option_ids.push(r.option_id);
            }
        }

        return {
            attemptId: session.id,
            reviews: Array.from(map.values()),
        };
    }
}

