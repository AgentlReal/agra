import { LearningRepository } from "./learning.repository";
import { CurriculumRepository } from "../curriculum/curriculum.repository";
import {
    M04_LevelSessionDetail,
    M04_SaveAnswerRequestDto,
    M04_SaveAnswerResponse,
    M04_LevelResultResponse,
    M04_LevelReviewResponse,
    M04_QuestionReviewItem,
    M04_SessionQuestionItem,
    M04_SubMaterialMasteryProgress,
} from "./learning.types";
import { NotFoundError, BadRequestError, AppError } from "@/shared/errors/app-error";

export class LearningService {
    constructor(
        private readonly repo = new LearningRepository(),
        private readonly curriculumRepo = new CurriculumRepository()
    ) {}

    async startAttempt(
        userId: string,
        levelId: number,
        subMaterialId: number
    ): Promise<{ session: M04_LevelSessionDetail; isResume: boolean }> {
        const isRecallPassed = await this.curriculumRepo.isRecallPassed(userId);
        if (!isRecallPassed) {
            throw new AppError(
                "Siswa belum lulus Recall Kemampuanmu",
                403,
                "PREREQUISITE_LOCKED"
            );
        }

        const subMaterial = await this.curriculumRepo.getSubMaterialById(subMaterialId);
        if (!subMaterial) {
            throw new NotFoundError("Submateri tidak ditemukan", "NOT_FOUND");
        }

        const level = await this.repo.getCognitiveLevelById(levelId);
        if (!level) {
            throw new NotFoundError("Level kognitif tidak ditemukan", "NOT_FOUND");
        }

        const progress = await this.curriculumRepo.getSingleSubMaterialProgress(userId, subMaterialId);
        if (level.level_number === 2) {
            if (!progress || progress.level_1_status !== "COMPLETED") {
                throw new AppError(
                    "Level 2 belum dapat diakses sebelum Level 1 tuntas dikuasai (skor minimal 9/10).",
                    403,
                    "PREREQUISITE_LOCKED"
                );
            }
        } else if (level.level_number === 3) {
            if (!progress || progress.level_2_status !== "COMPLETED") {
                throw new AppError(
                    "Level 3 belum dapat diakses sebelum Level 2 tuntas dikuasai (skor minimal 9/10).",
                    403,
                    "PREREQUISITE_LOCKED"
                );
            }
        }

        const active = await this.repo.findActiveSession(userId, subMaterialId, level.id);
        if (active) {
            const session = await this.getAttempt(active.id, userId);
            return { session, isResume: true };
        }

        const attemptCount = await this.repo.countAttempts(userId, subMaterialId, level.id);
        const isRemedial = attemptCount > 0;
        const questions = await this.repo.pickQuestions(subMaterialId, level.id, 10);

        if (questions.length < 10) {
            throw new BadRequestError(
                `Stok butir soal untuk submateri ini pada level ${level.level_number} belum mencukupi (minimal 10 butir). Hubungi Tim Kurikulum.`
            );
        }

        const sessionId = await this.repo.createSession(
            userId,
            subMaterialId,
            level.id,
            attemptCount + 1,
            isRemedial,
            questions
        );

        const session = await this.getAttempt(sessionId, userId);
        return { session, isResume: false };
    }

    async getAttempt(attemptId: number, userId: string): Promise<M04_LevelSessionDetail> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi latihan tidak ditemukan", "NOT_FOUND");
        }

        const subMaterial = await this.curriculumRepo.getSubMaterialById(session.sub_material_id!);
        const level = await this.repo.getCognitiveLevelById(session.cognitive_level_id!);
        const rows = await this.repo.getSessionQuestions(attemptId);
        const savedAnswers = await this.repo.getSavedAnswers(attemptId);
        const answeredCount = await this.repo.countAnsweredQuestions(attemptId);

        const answerMap = new Map<number, { selected: number[]; isSkipped: boolean }>();
        for (const sa of savedAnswers) {
            const existing = answerMap.get(sa.session_question_id) || {
                selected: [],
                isSkipped: false,
            };
            if (sa.selected_option_id) {
                existing.selected.push(sa.selected_option_id);
            }
            answerMap.set(sa.session_question_id, existing);
        }

        const questionMap = new Map<number, M04_SessionQuestionItem>();
        for (const r of rows) {
            if (!questionMap.has(r.session_question_id)) {
                const ans = answerMap.get(r.session_question_id);
                questionMap.set(r.session_question_id, {
                    session_question_id: r.session_question_id,
                    question_order: r.question_order,
                    question_type: r.question_format,
                    question_text: r.question_text,
                    stimulus_image_url: r.stimulus_image_url || null,
                    question_image_url: r.question_image_url || r.stimulus_image_url || null,
                    options: [],
                    selected_option_ids: ans?.selected || [],
                    is_skipped: ans?.isSkipped || false,
                    stimulus: r.stimulus_text ? {
                        id: 0,
                        subject_id: 2,
                        title: "",
                        content_text: r.stimulus_text,
                        source_citation: null,
                        image_url: r.stimulus_image_url || null,
                    } : null,
                });
            }

            questionMap.get(r.session_question_id)?.options.push({
                id: r.option_id,
                option_label: r.option_label,
                option_text: r.option_text,
            });
        }

        const customLevelName =
            level?.level_number === 1
                ? subMaterial?.level_1_name
                : level?.level_number === 2
                ? subMaterial?.level_2_name
                : subMaterial?.level_3_name;
        const levelName = customLevelName || level?.name || "Pemahaman";

        return {
            attempt_id: session.id,
            sub_material_id: session.sub_material_id!,
            sub_material_title: subMaterial?.title || "Submateri",
            cognitive_level_id: session.cognitive_level_id!,
            level_number: (level?.level_number || 1) as 1 | 2 | 3,
            level_name: levelName,
            attempt_number: session.attempt_number,
            is_remedial: Boolean(session.is_remedial),
            status: session.status,
            total_questions: 10,
            answered_count: answeredCount,
            current_question_order: session.current_question_order,
            questions: Array.from(questionMap.values()),
        };
    }

    async saveAnswer(
        attemptId: number,
        sessionQuestionId: number,
        userId: string,
        dto: M04_SaveAnswerRequestDto
    ): Promise<M04_SaveAnswerResponse> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi latihan tidak ditemukan", "NOT_FOUND");
        }
        if (session.status !== "IN_PROGRESS") {
            throw new BadRequestError("Sesi pengerjaan sudah selesai atau tidak aktif");
        }

        if (dto.selected_option_ids && dto.selected_option_ids.length > 2) {
            throw new BadRequestError("Batas maksimal jawaban yang dipilih adalah 2 butir opsi");
        }

        const res = await this.repo.upsertAnswer(
            attemptId,
            sessionQuestionId,
            dto.selected_option_ids || [],
            dto.is_skipped || false,
            dto.time_spent_seconds || 0,
            dto.current_question_order
        );

        return {
            session_question_id: sessionQuestionId,
            answered_at: res.answeredAt.toISOString(),
            answered_count: res.answeredCount,
            remaining_unanswered_count: res.remainingUnansweredCount,
            current_question_order: res.currentQuestionOrder,
        };
    }

    async submitAttempt(attemptId: number, userId: string): Promise<M04_LevelResultResponse> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi latihan tidak ditemukan", "NOT_FOUND");
        }
        if (session.status === "COMPLETED") {
            return this.getResult(attemptId, userId);
        }

        const level = await this.repo.getCognitiveLevelById(session.cognitive_level_id!);
        const res = await this.repo.evaluateAndCompleteSession(
            attemptId,
            userId,
            session.sub_material_id!,
            level?.level_number || 1,
            level?.xp_reward || 50
        );

        return this.buildResultResponse(session.id, userId, session.sub_material_id!, level!, res);
    }

    async getResult(attemptId: number, userId: string): Promise<M04_LevelResultResponse> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi latihan tidak ditemukan", "NOT_FOUND");
        }

        if (session.session_type !== "LEVEL_EXERCISE" || !session.cognitive_level_id) {
            throw new BadRequestError("Sesi bukan merupakan sesi latihan level kognitif");
        }

        const level = await this.repo.getCognitiveLevelById(session.cognitive_level_id);
        return this.buildResultResponse(session.id, userId, session.sub_material_id!, level!);
    }

    private async buildResultResponse(
        sessionId: number,
        userId: string,
        subMaterialId: number,
        level: { id: number; level_number: number; name: string },
        evalResult?: {
            correctAnswers: number;
            score: number;
            isPassed: boolean;
            xpEarned: number;
            isSubMaterialMastered: boolean;
            nextLevelUnlocked: number | null;
        }
    ): Promise<M04_LevelResultResponse> {
        const session = (await this.repo.getSessionById(sessionId, userId))!;
        const prog = await this.curriculumRepo.getSingleSubMaterialProgress(userId, subMaterialId);
        const totalXp = await this.repo.getUserTotalXp(userId);

        const isPassed = evalResult ? evalResult.isPassed : Boolean(session.is_passed);
        const correctAnswers = evalResult ? evalResult.correctAnswers : Number(session.correct_answers);
        const score = evalResult ? evalResult.score : Number(session.score);
        const xpEarned = evalResult ? evalResult.xpEarned : 0;
        const isMastered = evalResult ? evalResult.isSubMaterialMastered : Boolean(prog?.is_mastered);

        let nextAction: "NEXT_LEVEL" | "LEVEL_REMEDIAL" | "SUB_MATERIAL_MASTERED" | "NEXT_SUB_MATERIAL" =
            "LEVEL_REMEDIAL";
        if (isMastered) {
            nextAction = "SUB_MATERIAL_MASTERED";
        } else if (isPassed) {
            nextAction = level.level_number < 3 ? "NEXT_LEVEL" : "NEXT_SUB_MATERIAL";
        }

        const subMaterialProgress: M04_SubMaterialMasteryProgress = {
            sub_material_id: subMaterialId,
            level_1_status: (prog?.level_1_status as "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL") || "AVAILABLE",
            level_2_status: (prog?.level_2_status as "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL") || "LOCKED",
            level_3_status: (prog?.level_3_status as "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL") || "LOCKED",
            level_1_score: prog?.level_1_score !== undefined && prog.level_1_score !== null ? Number(prog.level_1_score) : null,
            level_2_score: prog?.level_2_score !== undefined && prog.level_2_score !== null ? Number(prog.level_2_score) : null,
            level_3_score: prog?.level_3_score !== undefined && prog.level_3_score !== null ? Number(prog.level_3_score) : null,
            total_cumulative_score: Number(prog?.total_cumulative_score || 0),
            is_mastered: Boolean(prog?.is_mastered),
            mastered_at: prog?.mastered_at ? new Date(prog.mastered_at).toISOString() : null,
        };

        const subMaterial = await this.curriculumRepo.getSubMaterialById(subMaterialId);
        const customLevelName =
            level.level_number === 1
                ? subMaterial?.level_1_name
                : level.level_number === 2
                ? subMaterial?.level_2_name
                : subMaterial?.level_3_name;
        const levelName = customLevelName || level.name;

        return {
            attempt_id: session.id,
            level_id: level.id,
            level_number: level.level_number as 1 | 2 | 3,
            level_name: levelName,
            score,
            correct_answers: correctAnswers,
            total_questions: 10,
            is_passed: isPassed,
            xp_earned: xpEarned,
            total_xp: totalXp,
            next_action: nextAction,
            sub_material_progress: subMaterialProgress,
        };
    }

    async getReview(attemptId: number, userId: string): Promise<M04_LevelReviewResponse> {
        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi latihan tidak ditemukan", "NOT_FOUND");
        }
        if (session.status !== "COMPLETED") {
            throw new AppError(
                "Pembahasan hanya dapat dibuka setelah sesi latihan berstatus COMPLETED",
                409,
                "REVIEW_LOCKED"
            );
        }

        const level = await this.repo.getCognitiveLevelById(session.cognitive_level_id!);
        const subMaterial = session.sub_material_id
            ? await this.curriculumRepo.getSubMaterialById(session.sub_material_id)
            : null;
        const customLevelName =
            level?.level_number === 1
                ? subMaterial?.level_1_name
                : level?.level_number === 2
                ? subMaterial?.level_2_name
                : subMaterial?.level_3_name;
        const levelName = customLevelName || level?.name || "Pemahaman";

        const rows = await this.repo.getReviewQuestions(attemptId);
        const map = new Map<number, M04_QuestionReviewItem>();

        for (const r of rows) {
            const sqId = r.session_question_id || r.question_order;
            if (!map.has(r.question_order)) {
                map.set(r.question_order, {
                    session_question_id: sqId,
                    question_order: r.question_order,
                    question_text: r.question_text,
                    stimulus_image_url: r.stimulus_image_url || null,
                    question_image_url: r.question_image_url || r.stimulus_image_url || null,
                    options: [],
                    selected_option_ids: [],
                    correct_option_ids: [],
                    is_correct: Boolean(r.is_answer_correct),
                    time_spent_seconds: 30,
                    explanation_text: r.explanation_text || "",
                    reasoning_guide: r.reasoning_guide || "",
                    reference_url: r.reference_url || null,
                });
            }

            const item = map.get(r.question_order)!;
            const existingOpt = item.options.find((o) => o.id === r.option_id);
            if (!existingOpt) {
                item.options.push({
                    id: r.option_id,
                    option_label: r.option_label as "A" | "B" | "C" | "D",
                    option_text: r.option_text,
                    is_correct: Boolean(r.is_correct),
                });
            }
            if (r.is_correct && !item.correct_option_ids.includes(r.option_id)) {
                item.correct_option_ids.push(r.option_id);
            }
            if (r.is_selected && !item.selected_option_ids.includes(r.option_id)) {
                item.selected_option_ids.push(r.option_id);
            }
        }

        return {
            attempt_id: session.id,
            level_number: (level?.level_number || 1) as 1 | 2 | 3,
            level_name: levelName,
            total_questions: 10,
            correct_answers: Number(session.correct_answers),
            reviews: Array.from(map.values()),
        };
    }
}
