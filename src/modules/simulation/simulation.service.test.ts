import { describe, it, expect, vi, beforeEach } from "vitest";
import { SimulationService } from "./simulation.service";
import { SimulationRepository } from "./simulation.repository";
import { CurriculumRepository } from "../curriculum/curriculum.repository";
import { ProfileRepository } from "../profile/profile.repository";
import { NotFoundError, ForbiddenError, ConflictError } from "@/shared/errors/app-error";

describe("SimulationService Unit Tests", () => {
    let mockSimRepo: Partial<Record<keyof SimulationRepository, ReturnType<typeof vi.fn>>>;
    let mockCurriculumRepo: Partial<Record<keyof CurriculumRepository, ReturnType<typeof vi.fn>>>;
    let mockProfileRepo: Partial<Record<keyof ProfileRepository, ReturnType<typeof vi.fn>>>;
    let service: SimulationService;

    beforeEach(() => {
        mockSimRepo = {
            checkEligibility: vi.fn(),
            findActiveSession: vi.fn(),
            getPackageById: vi.fn(),
            getLruPackage: vi.fn(),
            countAttempts: vi.fn(),
            createSession: vi.fn(),
            getSessionById: vi.fn(),
            evaluateAndCompleteSession: vi.fn(),
            countAnsweredQuestions: vi.fn(),
            countDoubtfulAnswers: vi.fn(),
            getSessionQuestions: vi.fn(),
            getSavedAnswers: vi.fn(),
            getSessionQuestionById: vi.fn(),
            upsertAnswer: vi.fn(),
            getUserTotalXp: vi.fn(),
            getSessionXpEarned: vi.fn(),
            getReviewQuestions: vi.fn(),
        };
        mockCurriculumRepo = {
            getSubjectById: vi.fn(),
        };
        mockProfileRepo = {
            findRawProfile: vi.fn(),
        };

        service = new SimulationService(
            mockSimRepo as unknown as SimulationRepository,
            mockCurriculumRepo as unknown as CurriculumRepository,
            mockProfileRepo as unknown as ProfileRepository
        );
    });

    describe("checkEligibility", () => {
        it("harus melempar ConflictError PROFILE_INCOMPLETE jika siswa belum melengkapi profil", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue(null);

            await expect(service.checkEligibility(1, "user-1")).rejects.toMatchObject({
                code: "PROFILE_INCOMPLETE",
            });
        });

        it("harus menyatakan is_eligible = false jika masih ada submateri yang belum MASTERED", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockCurriculumRepo.getSubjectById!.mockResolvedValue({ id: 1, name: "Matematika" });
            mockSimRepo.checkEligibility!.mockResolvedValue({
                subjectName: "Matematika",
                total: 10,
                mastered: 8,
                unmastered: [{ sub_material_id: 9, material_title: "Geometri", sub_material_title: "Sudut" }],
            });

            const res = await service.checkEligibility(1, "user-1");

            expect(res.is_eligible).toBe(false);
            expect(res.completion_percentage).toBe(80);
            expect(res.unmastered_sub_materials).toHaveLength(1);
        });

        it("harus menyatakan is_eligible = true jika seluruh submateri telah tuntas (MASTERED)", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockCurriculumRepo.getSubjectById!.mockResolvedValue({ id: 1, name: "Matematika" });
            mockSimRepo.checkEligibility!.mockResolvedValue({
                subjectName: "Matematika",
                total: 10,
                mastered: 10,
                unmastered: [],
            });

            const res = await service.checkEligibility(1, "user-1");

            expect(res.is_eligible).toBe(true);
            expect(res.completion_percentage).toBe(100);
            expect(res.unmastered_sub_materials).toHaveLength(0);
        });
    });

    describe("startAttempt", () => {
        it("harus menolak memulai simulasi (403 Forbidden) jika siswa belum eligible", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockCurriculumRepo.getSubjectById!.mockResolvedValue({ id: 1, name: "Matematika" });
            mockSimRepo.checkEligibility!.mockResolvedValue({
                subjectName: "Matematika",
                total: 10,
                mastered: 5,
                unmastered: [{ sub_material_id: 6, material_title: "Materi", sub_material_title: "Sub" }],
            });

            await expect(service.startAttempt(1, "user-1")).rejects.toThrow(ForbiddenError);
        });

        it("harus me-resume sesi aktif jika sisa waktu 75m masih tersedia", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockCurriculumRepo.getSubjectById!.mockResolvedValue({ id: 1, name: "Matematika" });
            mockSimRepo.checkEligibility!.mockResolvedValue({
                subjectName: "Matematika",
                total: 10,
                mastered: 10,
                unmastered: [],
            });

            mockSimRepo.findActiveSession!.mockResolvedValue({
                id: 301,
                simulation_id: 5,
                attempt_number: 1,
                start_time: new Date(Date.now() - 10 * 60 * 1000), // Baru berjalan 10 menit
            });
            mockSimRepo.getPackageById!.mockResolvedValue({ id: 5, title: "Simulasi Mandiri Paket A" });

            const res = await service.startAttempt(1, "user-1");

            expect(res.attempt_id).toBe(301);
            expect(res.package_id).toBe(5);
            expect(res.timing.remaining_seconds).toBeGreaterThan(0);
        });

        it("harus memilih paket baru dengan aturan LRU jika belum ada sesi aktif", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockCurriculumRepo.getSubjectById!.mockResolvedValue({ id: 1, name: "Matematika" });
            mockSimRepo.checkEligibility!.mockResolvedValue({
                subjectName: "Matematika",
                total: 10,
                mastered: 10,
                unmastered: [],
            });

            mockSimRepo.findActiveSession!.mockResolvedValue(null);
            mockSimRepo.getLruPackage!.mockResolvedValue({ id: 7, title: "Paket LRU" });
            mockSimRepo.countAttempts!.mockResolvedValue(0);
            mockSimRepo.createSession!.mockResolvedValue(302);
            mockSimRepo.getSessionById!.mockResolvedValue({
                id: 302,
                start_time: new Date(),
            });

            const res = await service.startAttempt(1, "user-1");

            expect(res.attempt_id).toBe(302);
            expect(res.package_id).toBe(7);
            expect(res.timing.duration_minutes).toBe(75);
            expect(mockSimRepo.getLruPackage).toHaveBeenCalledWith(1, "user-1");
        });
    });

    describe("saveAnswer", () => {
        it("harus melempar error TIME_EXPIRED dan auto-submit jika batas 75 menit telah habis", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockSimRepo.getSessionById!.mockResolvedValue({
                id: 301,
                status: "IN_PROGRESS",
                simulation_id: 5,
                start_time: new Date(Date.now() - 80 * 60 * 1000), // Sudah lewat 80 menit
            });

            await expect(
                service.saveAnswer(301, 1, "user-1", {
                    selected_option_ids: [1],
                    is_doubtful: false,
                    time_spent_seconds: 10,
                    current_question_order: 1,
                })
            ).rejects.toMatchObject({
                code: "TIME_EXPIRED",
            });

            expect(mockSimRepo.evaluateAndCompleteSession).toHaveBeenCalledWith(
                301,
                "user-1",
                5,
                "TIMEOUT"
            );
        });

        it("harus berhasil menyimpan jawaban beserta status ragu-ragu (is_doubtful)", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockSimRepo.getSessionById!.mockResolvedValue({
                id: 301,
                status: "IN_PROGRESS",
                simulation_id: 5,
                start_time: new Date(),
            });
            mockSimRepo.getSessionQuestionById!.mockResolvedValue({ id: 1 });
            mockSimRepo.upsertAnswer!.mockResolvedValue({
                sessionQuestionId: 1,
                answeredAt: new Date(),
                isDoubtful: true,
                remainingSeconds: 4000,
                currentQuestionOrder: 2,
            });

            const res = await service.saveAnswer(301, 1, "user-1", {
                selected_option_ids: [15],
                is_doubtful: true,
                time_spent_seconds: 45,
                current_question_order: 2,
            });

            expect(res.is_doubtful).toBe(true);
            expect(res.remaining_seconds).toBe(4000);
        });

        it("harus menolak simpan jawaban jika pilihan jawaban yang dipilih lebih dari 2 butir opsi", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockSimRepo.getSessionById!.mockResolvedValue({
                id: 301,
                status: "IN_PROGRESS",
                simulation_id: 5,
                start_time: new Date(),
            });
            mockSimRepo.getSessionQuestionById!.mockResolvedValue({ id: 1 });

            await expect(
                service.saveAnswer(301, 1, "user-1", {
                    selected_option_ids: [1, 2, 3], // 3 opsi -> melebihi batas 2
                    is_doubtful: false,
                    time_spent_seconds: 10,
                    current_question_order: 1,
                })
            ).rejects.toThrow("Batas maksimal jawaban yang dipilih adalah 2 butir opsi");
        });

        it("harus berhasil menyimpan jawaban untuk pilihan ganda kompleks dengan 2 butir opsi terpilih", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockSimRepo.getSessionById!.mockResolvedValue({
                id: 301,
                status: "IN_PROGRESS",
                simulation_id: 5,
                start_time: new Date(),
            });
            mockSimRepo.getSessionQuestionById!.mockResolvedValue({ id: 1 });
            mockSimRepo.upsertAnswer!.mockResolvedValue({
                sessionQuestionId: 1,
                answeredAt: new Date(),
                remainingSeconds: 3600,
            });

            const res = await service.saveAnswer(301, 1, "user-1", {
                selected_option_ids: [1, 2], // 2 opsi -> batas maksimal pilihan
                is_doubtful: false,
                time_spent_seconds: 15,
                current_question_order: 1,
            });

            expect(res.session_question_id).toBe(1);
            expect(res.remaining_seconds).toBe(3600);
        });
    });

    describe("submitAttempt & getResult", () => {
        it("harus menolak submit jika sesi sudah pernah disubmit sebelumnya", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockSimRepo.getSessionById!.mockResolvedValue({
                id: 301,
                status: "COMPLETED",
            });

            await expect(service.submitAttempt(301, "user-1")).rejects.toMatchObject({
                code: "SIMULATION_ALREADY_SUBMITTED",
            });
        });

        it("harus berhasil mengevaluasi ujian secara MANUAL jika dikumpulkan sebelum waktu habis", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            // Panggilan pertama saat submitAttempt
            mockSimRepo.getSessionById!.mockResolvedValueOnce({
                id: 301,
                status: "IN_PROGRESS",
                simulation_id: 5,
                start_time: new Date(),
            });
            mockSimRepo.evaluateAndCompleteSession!.mockResolvedValue(undefined);

            // Mock getResult
            vi.spyOn(service, "getResult").mockResolvedValueOnce({
                attempt_id: 301,
                score: 85,
                correct_answers: 25,
                total_questions: 30,
                is_passed: true,
                xp_earned: 150,
                total_xp: 300,
                submission_type: "MANUAL",
            } as any);

            const res = await service.submitAttempt(301, "user-1");

            expect(mockSimRepo.evaluateAndCompleteSession).toHaveBeenCalledWith(
                301,
                "user-1",
                5,
                "MANUAL"
            );
            expect(res.is_passed).toBe(true);
            expect(res.submission_type).toBe("MANUAL");
        });
    });

    describe("getReview", () => {
        it("harus melempar error REVIEW_LOCKED jika ujian masih berjalan dan sisa waktu masih ada", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockSimRepo.getSessionById!.mockResolvedValue({
                id: 301,
                status: "IN_PROGRESS",
                start_time: new Date(), // Waktu masih banyak
            });

            await expect(service.getReview(301, "user-1")).rejects.toMatchObject({
                code: "REVIEW_LOCKED",
            });
        });

        it("harus mengembalikan daftar pembahasan soal lengkap dengan penjelasan", async () => {
            mockProfileRepo.findRawProfile!.mockResolvedValue({ user_id: "user-1" } as any);
            mockSimRepo.getSessionById!.mockResolvedValue({
                id: 301,
                status: "COMPLETED",
                simulation_id: 5,
                correct_answers: 28,
            });
            mockSimRepo.getPackageById!.mockResolvedValue({ title: "Simulasi Paket A" });
            mockSimRepo.getReviewQuestions!.mockResolvedValue([
                {
                    session_question_id: 1,
                    question_order: 1,
                    question_text: "Soal Simulasi 1",
                    option_id: 10,
                    option_label: "A",
                    option_text: "Jawaban A",
                    is_correct: 1,
                    is_selected: 1,
                    is_answer_correct: 1,
                    time_spent_seconds: 50,
                    explanation_text: "Pembahasan komprehensif",
                    reasoning_guide: "Petunjuk penalaran",
                },
            ]);

            const res = await service.getReview(301, "user-1");

            expect(res.attempt_id).toBe(301);
            expect(res.reviews[0].is_correct).toBe(true);
            expect(res.reviews[0].explanation_text).toBe("Pembahasan komprehensif");
        });
    });
});
