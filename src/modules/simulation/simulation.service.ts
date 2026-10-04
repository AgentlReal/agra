import { SimulationRepository } from "./simulation.repository";
import { CurriculumRepository } from "../curriculum/curriculum.repository";
import { ProfileRepository } from "../profile/profile.repository";
import {
    M05_SimulationEligibilityResponse,
    M05_StartSimulationResponse,
    M05_SimulationAttemptDetail,
    M05_SimulationQuestionItem,
    M05_SaveSimulationAnswerResponse,
    M05_SimulationResultResponse,
    M05_SimulationReviewResponse,
    M05_SimulationQuestionReviewItem,
    M05_SimulationTiming,
} from "./simulation.types";
import { SaveSimulationAnswerInput } from "./simulation.schema";
import {
    NotFoundError,
    ForbiddenError,
    ConflictError,
    BadRequestError,
} from "@/shared/errors/app-error";

export class SimulationService {
    constructor(
        private readonly repo = new SimulationRepository(),
        private readonly curriculumRepo = new CurriculumRepository(),
        private readonly profileRepo = new ProfileRepository()
    ) { }

    private async ensureStudentProfile(userId: string): Promise<void> {
        const profile = await this.profileRepo.findRawProfile(userId);
        if (!profile) {
            throw new ConflictError(
                "PROFILE_INCOMPLETE - Lengkapi profil terlebih dahulu",
                "PROFILE_INCOMPLETE"
            );
        }
    }

    private calculateTiming(startTime: Date | string, durationMinutes = 75): M05_SimulationTiming {
        const now = Date.now();
        const start = new Date(startTime).getTime();
        const duration = durationMinutes || 75;
        const deadline = new Date(start + duration * 60 * 1000);
        const remainingSeconds = Math.max(0, Math.floor((deadline.getTime() - now) / 1000));

        return {
            server_time: new Date(now).toISOString(),
            duration_minutes: duration,
            deadline_at: deadline.toISOString(),
            remaining_seconds: remainingSeconds,
        };
    }

    async checkEligibility(subjectId: number, userId: string): Promise<M05_SimulationEligibilityResponse> {
        await this.ensureStudentProfile(userId);

        const subject = await this.curriculumRepo.getSubjectById(subjectId);
        if (!subject) {
            throw new NotFoundError("Mata pelajaran tidak ditemukan");
        }

        const eligibility = await this.repo.checkEligibility(subjectId, userId);
        const total = eligibility.total;
        const mastered = eligibility.mastered;
        const isEligible = total > 0 && mastered === total;
        const completionPercentage = total > 0 ? Math.round((mastered / total) * 100 * 10) / 10 : 0;

        return {
            subject_id: subjectId,
            subject_name: eligibility.subjectName,
            is_eligible: isEligible,
            total_sub_materials: total,
            mastered_sub_materials: mastered,
            completion_percentage: completionPercentage,
            unmastered_sub_materials: eligibility.unmastered,
        };
    }

    async startAttempt(subjectId: number, userId: string): Promise<M05_StartSimulationResponse> {
        await this.ensureStudentProfile(userId);

        const eligibility = await this.checkEligibility(subjectId, userId);
        if (!eligibility.is_eligible) {
            throw new ForbiddenError(
                "SIMULATION_NOT_ELIGIBLE - Seluruh submateri pada mata pelajaran ini harus berstatus MASTERED",
                "SIMULATION_NOT_ELIGIBLE"
            );
        }

        // Cek apakah ada sesi simulasi aktif
        const active = await this.repo.findActiveSession(subjectId, userId);
        if (active) {
            const activePkg = await this.repo.getPackageById(active.simulation_id || 0);
            const duration = activePkg?.duration_minutes || 75;
            const timing = this.calculateTiming(active.start_time, duration);
            if (timing.remaining_seconds <= 0) {
                await this.repo.evaluateAndCompleteSession(
                    active.id,
                    userId,
                    active.simulation_id || 0,
                    "TIMEOUT"
                );
            } else {
                return {
                    attempt_id: active.id,
                    package_id: active.simulation_id || 0,
                    package_title: activePkg?.title || "Simulasi CBT Mandiri",
                    attempt_number: active.attempt_number || 1,
                    total_questions: (active.total_questions || activePkg?.total_questions || 30) as 30,
                    timing,
                };
            }
        }

        // Pemilihan paket otomatis dengan aturan LRU (Least Recently Used)
        const pkg = await this.repo.getLruPackage(subjectId, userId);
        if (!pkg) {
            throw new NotFoundError("Tidak ada paket simulasi aktif yang tersedia");
        }

        const previousAttempts = await this.repo.countAttempts(userId, subjectId);
        const attemptNumber = previousAttempts + 1;

        const sessionId = await this.repo.createSession(userId, subjectId, pkg.id, attemptNumber);
        const session = await this.repo.getSessionById(sessionId, userId);
        const timing = this.calculateTiming(session?.start_time || new Date(), pkg.duration_minutes || 75);

        return {
            attempt_id: sessionId,
            package_id: pkg.id,
            package_title: pkg.title,
            attempt_number: attemptNumber,
            total_questions: (session?.total_questions || pkg.total_questions || 30) as 30,
            timing,
        };
    }

    async getAttemptState(attemptId: number, userId: string): Promise<M05_SimulationAttemptDetail> {
        await this.ensureStudentProfile(userId);

        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi simulasi tidak ditemukan atau bukan milik siswa aktif");
        }

        const pkg = await this.repo.getPackageById(session.simulation_id || 0);
        const timing = this.calculateTiming(session.start_time, pkg?.duration_minutes || 75);
        let status = session.status as "IN_PROGRESS" | "COMPLETED";

        // Jika waktu habis dan sesi masih IN_PROGRESS, auto-submit sesi dengan alasan TIMEOUT
        if (timing.remaining_seconds === 0 && session.status === "IN_PROGRESS") {
            await this.repo.evaluateAndCompleteSession(
                attemptId,
                userId,
                session.simulation_id || 0,
                "TIMEOUT"
            );
            status = "COMPLETED";
        }

        const answeredCount = await this.repo.countAnsweredQuestions(attemptId);
        const doubtfulCount = await this.repo.countDoubtfulAnswers(attemptId);

        const rows = await this.repo.getSessionQuestions(attemptId);
        const savedAnswerRows = await this.repo.getSavedAnswers(attemptId);

        const savedAnswerMap = new Map<
            number,
            { selected_option_ids: number[]; is_doubtful: boolean; is_skipped: boolean; time_spent_seconds: number }
        >();

        for (const sa of savedAnswerRows) {
            const existing = savedAnswerMap.get(sa.session_question_id) || {
                selected_option_ids: [],
                is_doubtful: Boolean(sa.is_doubtful),
                is_skipped: Boolean(sa.is_skipped),
                time_spent_seconds: sa.time_spent_seconds || 0,
            };
            if (sa.selected_option_id) {
                existing.selected_option_ids.push(sa.selected_option_id);
            }
            savedAnswerMap.set(sa.session_question_id, existing);
        }

        const questionMap = new Map<number, M05_SimulationQuestionItem>();
        for (const r of rows) {
            if (!questionMap.has(r.session_question_id)) {
                const ans = savedAnswerMap.get(r.session_question_id);
                questionMap.set(r.session_question_id, {
                    session_question_id: r.session_question_id,
                    question_id: r.question_id,
                    question_order: r.question_order,
                    question_type: r.question_type,
                    question_text: r.question_text,
                    question_image_url: r.question_image_url || null,
                    stimulus_image_url: r.stimulus_image_url || r.question_image_url || null,
                    options: [],
                    saved_answer: ans
                        ? {
                            selected_option_ids: ans.selected_option_ids,
                            is_doubtful: ans.is_doubtful,
                            is_skipped: ans.is_skipped,
                            time_spent_seconds: ans.time_spent_seconds,
                        }
                        : null,
                    stimulus: r.stimulus_id
                        ? {
                            id: r.stimulus_id,
                            subject_id: r.stimulus_subject_id || 0,
                            title: r.stimulus_title || "",
                            stimulus_text: r.stimulus_text || "",
                            stimulus_image_url: r.stimulus_image_url,
                        }
                        : null,
                });
            }

            questionMap.get(r.session_question_id)?.options.push({
                id: r.option_id,
                option_label: r.option_label,
                option_text: r.option_text,
            });
        }

        return {
            attempt_id: session.id,
            package_id: session.simulation_id || 0,
            package_title: pkg?.title || "Simulasi CBT Mandiri",
            attempt_number: session.attempt_number || 1,
            status,
            total_questions: (session.total_questions || pkg?.total_questions || 30) as 30,
            answered_count: answeredCount,
            doubtful_count: doubtfulCount,
            current_question_order: session.current_question_order || 1,
            timing,
            questions: Array.from(questionMap.values()),
        };
    }

    async saveAnswer(
        attemptId: number,
        sessionQuestionId: number,
        userId: string,
        input: SaveSimulationAnswerInput
    ): Promise<M05_SaveSimulationAnswerResponse> {
        await this.ensureStudentProfile(userId);

        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi simulasi tidak ditemukan");
        }
        if (session.status !== "IN_PROGRESS") {
            throw new ConflictError(
                "SESSION_CLOSED - Batas pengerjaan simulasi sudah ditutup",
                "SESSION_CLOSED"
            );
        }

        const pkg = await this.repo.getPackageById(session.simulation_id || 0);
        const timing = this.calculateTiming(session.start_time, pkg?.duration_minutes || 75);
        if (timing.remaining_seconds <= 0) {
            await this.repo.evaluateAndCompleteSession(
                attemptId,
                userId,
                session.simulation_id || 0,
                "TIMEOUT"
            );
            throw new ConflictError(
                `TIME_EXPIRED - Batas waktu ${pkg?.duration_minutes || 75} menit ujian telah habis. Jawaban otomatis dikumpulkan.`,
                "TIME_EXPIRED"
            );
        }

        const validQuestion = await this.repo.getSessionQuestionById(sessionQuestionId, attemptId);
        if (!validQuestion) {
            throw new NotFoundError("Nomor soal tidak terdaftar pada sesi simulasi ini");
        }

        if (input.selected_option_ids && input.selected_option_ids.length > 2) {
            throw new BadRequestError("Batas maksimal jawaban yang dipilih adalah 2 butir opsi");
        }

        const result = await this.repo.upsertAnswer(
            sessionQuestionId,
            input.selected_option_ids,
            input.is_doubtful,
            input.time_spent_seconds,
            input.current_question_order,
            attemptId
        );

        return {
            session_question_id: result.sessionQuestionId,
            answered_at: result.answeredAt.toISOString(),
            is_doubtful: result.isDoubtful,
            remaining_seconds: result.remainingSeconds,
            current_question_order: result.currentQuestionOrder,
        };
    }

    async submitAttempt(attemptId: number, userId: string): Promise<M05_SimulationResultResponse> {
        await this.ensureStudentProfile(userId);

        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi simulasi tidak ditemukan");
        }
        if (session.status === "COMPLETED") {
            throw new ConflictError(
                "SIMULATION_ALREADY_SUBMITTED - Sesi simulasi ini sudah diselesaikan sebelumnya",
                "SIMULATION_ALREADY_SUBMITTED"
            );
        }

        const pkg = await this.repo.getPackageById(session.simulation_id || 0);
        const timing = this.calculateTiming(session.start_time, pkg?.duration_minutes || 75);
        const submissionType = timing.remaining_seconds <= 0 ? "TIMEOUT" : "MANUAL";

        await this.repo.evaluateAndCompleteSession(
            attemptId,
            userId,
            session.simulation_id || 0,
            submissionType
        );

        return this.getResult(attemptId, userId);
    }

    async getResult(attemptId: number, userId: string): Promise<M05_SimulationResultResponse> {
        await this.ensureStudentProfile(userId);

        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi simulasi tidak ditemukan");
        }

        const pkg = await this.repo.getPackageById(session.simulation_id || 0);
        if (session.status === "IN_PROGRESS") {
            const timing = this.calculateTiming(session.start_time, pkg?.duration_minutes || 75);
            if (timing.remaining_seconds <= 0) {
                await this.repo.evaluateAndCompleteSession(
                    attemptId,
                    userId,
                    session.simulation_id || 0,
                    "TIMEOUT"
                );
                return this.getResult(attemptId, userId);
            }
            throw new ConflictError(
                "RESULT_NOT_READY - Ujian simulasi masih berjalan",
                "RESULT_NOT_READY"
            );
        }

        const totalXp = await this.repo.getUserTotalXp(userId);
        const xpEarned = await this.repo.getSessionXpEarned(attemptId);

        return {
            attempt_id: session.id,
            package_id: session.simulation_id || 0,
            package_title: pkg?.title || "Simulasi CBT Mandiri",
            score: Number(session.score),
            correct_answers: Number(session.correct_answers),
            total_questions: (session.total_questions || pkg?.total_questions || 30) as 30,
            is_passed: Boolean(session.is_passed),
            xp_earned: xpEarned,
            total_xp: totalXp,
            completed_at: session.end_time ? new Date(session.end_time).toISOString() : new Date().toISOString(),
            submission_type: (session.submission_type as "MANUAL" | "TIMEOUT") || "MANUAL",
            can_retake: true,
        };
    }

    async getReview(attemptId: number, userId: string): Promise<M05_SimulationReviewResponse> {
        await this.ensureStudentProfile(userId);

        const session = await this.repo.getSessionById(attemptId, userId);
        if (!session) {
            throw new NotFoundError("Sesi simulasi tidak ditemukan");
        }

        const pkg = await this.repo.getPackageById(session.simulation_id || 0);

        if (session.status !== "COMPLETED") {
            const timing = this.calculateTiming(session.start_time, pkg?.duration_minutes || 75);
            if (timing.remaining_seconds <= 0) {
                await this.repo.evaluateAndCompleteSession(
                    attemptId,
                    userId,
                    session.simulation_id || 0,
                    "TIMEOUT"
                );
            } else {
                throw new ConflictError(
                    "REVIEW_LOCKED - Pembahasan hanya dapat diakses setelah ujian simulasi disubmit",
                    "REVIEW_LOCKED"
                );
            }
        }

        const rows = await this.repo.getReviewQuestions(attemptId);

        const reviewMap = new Map<number, M05_SimulationQuestionReviewItem>();

        for (const r of rows) {
            if (!reviewMap.has(r.session_question_id)) {
                reviewMap.set(r.session_question_id, {
                    session_question_id: r.session_question_id,
                    question_order: r.question_order,
                    question_text: r.question_text,
                    question_image_url: r.question_image_url || null,
                    stimulus_image_url: r.stimulus_image_url || r.question_image_url || null,
                    options: [],
                    selected_option_ids: [],
                    correct_option_ids: [],
                    is_correct: Boolean(r.is_answer_correct),
                    time_spent_seconds: r.time_spent_seconds,
                    explanation_text: r.explanation_text || "Tidak ada pembahasan khusus.",
                    reasoning_guide: r.reasoning_guide || "Analisis soal berdasarkan konsep kurikulum.",
                    reference_url: r.reference_url,
                    stimulus: r.stimulus_id
                        ? {
                            id: r.stimulus_id,
                            subject_id: r.stimulus_subject_id || 0,
                            title: r.stimulus_title || "",
                            stimulus_text: r.stimulus_text || "",
                            stimulus_image_url: r.stimulus_image_url,
                        }
                        : null,
                });
            }

            const item = reviewMap.get(r.session_question_id)!;
            const existingOpt = item.options.find((o) => o.id === r.option_id);
            if (!existingOpt) {
                item.options.push({
                    id: r.option_id,
                    option_label: r.option_label,
                    option_text: r.option_text,
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
            package_title: pkg?.title || "Simulasi CBT Mandiri",
            total_questions: (session.total_questions || pkg?.total_questions || 30) as 30,
            correct_answers: Number(session.correct_answers),
            reviews: Array.from(reviewMap.values()),
        };
    }
}
