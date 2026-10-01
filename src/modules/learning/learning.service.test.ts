import { describe, it, expect, vi, beforeEach } from "vitest";
import { LearningService } from "./learning.service";
import { LearningRepository } from "./learning.repository";
import { CurriculumRepository } from "../curriculum/curriculum.repository";
import { AppError, NotFoundError, BadRequestError } from "@/shared/errors/app-error";

describe("LearningService Unit Tests", () => {
    let mockLearningRepo: Partial<Record<keyof LearningRepository, ReturnType<typeof vi.fn>>>;
    let mockCurriculumRepo: Partial<Record<keyof CurriculumRepository, ReturnType<typeof vi.fn>>>;
    let service: LearningService;

    beforeEach(() => {
        mockLearningRepo = {
            getCognitiveLevelById: vi.fn(),
            findActiveSession: vi.fn(),
            countAttempts: vi.fn(),
            pickQuestions: vi.fn(),
            createSession: vi.fn(),
            getSessionById: vi.fn(),
            getSessionQuestions: vi.fn(),
            getSavedAnswers: vi.fn(),
            countAnsweredQuestions: vi.fn(),
            upsertAnswer: vi.fn(),
            evaluateAndCompleteSession: vi.fn(),
            getUserTotalXp: vi.fn(),
            getReviewQuestions: vi.fn(),
        };
        mockCurriculumRepo = {
            isRecallPassed: vi.fn(),
            getSubMaterialById: vi.fn(),
            getSingleSubMaterialProgress: vi.fn(),
        };
        service = new LearningService(
            mockLearningRepo as unknown as LearningRepository,
            mockCurriculumRepo as unknown as CurriculumRepository
        );
    });

    describe("startAttempt", () => {
        it("harus menolak akses jika siswa belum lulus asesmen Recall Kemampuanmu", async () => {
            mockCurriculumRepo.isRecallPassed!.mockResolvedValue(false);

            await expect(service.startAttempt("user-1", 1, 10)).rejects.toMatchObject({
                statusCode: 403,
                code: "PREREQUISITE_LOCKED",
            });
        });

        it("harus melempar NotFoundError jika submateri atau level kognitif tidak ditemukan", async () => {
            mockCurriculumRepo.isRecallPassed!.mockResolvedValue(true);
            mockCurriculumRepo.getSubMaterialById!.mockResolvedValue(null);

            await expect(service.startAttempt("user-1", 1, 999)).rejects.toThrow(NotFoundError);
        });

        it("harus menolak akses Level 2 jika Level 1 belum tuntas (skor minimal 9/10)", async () => {
            mockCurriculumRepo.isRecallPassed!.mockResolvedValue(true);
            mockCurriculumRepo.getSubMaterialById!.mockResolvedValue({ id: 10, title: "Aljabar" } as any);
            mockLearningRepo.getCognitiveLevelById!.mockResolvedValue({ id: 2, level_number: 2, name: "Pengaplikasian" } as any);
            mockCurriculumRepo.getSingleSubMaterialProgress!.mockResolvedValue({
                level_1_status: "AVAILABLE",
            } as any);

            await expect(service.startAttempt("user-1", 2, 10)).rejects.toMatchObject({
                statusCode: 403,
                code: "PREREQUISITE_LOCKED",
            });
        });

        it("harus me-resume sesi jika terdapat sesi latihan yang masih aktif", async () => {
            mockCurriculumRepo.isRecallPassed!.mockResolvedValue(true);
            mockCurriculumRepo.getSubMaterialById!.mockResolvedValue({ id: 10, title: "Aljabar" } as any);
            mockLearningRepo.getCognitiveLevelById!.mockResolvedValue({ id: 1, level_number: 1, name: "Pemahaman" } as any);
            mockCurriculumRepo.getSingleSubMaterialProgress!.mockResolvedValue(null);

            mockLearningRepo.findActiveSession!.mockResolvedValue({ id: 201 });
            vi.spyOn(service, "getAttempt").mockResolvedValueOnce({
                attempt_id: 201,
            } as any);

            const res = await service.startAttempt("user-1", 1, 10);

            expect(res.isResume).toBe(true);
            expect(res.session.attempt_id).toBe(201);
            expect(mockLearningRepo.createSession).not.toHaveBeenCalled();
        });

        it("harus menandai is_remedial = true jika nomor percobaan lebih dari 1", async () => {
            mockCurriculumRepo.isRecallPassed!.mockResolvedValue(true);
            mockCurriculumRepo.getSubMaterialById!.mockResolvedValue({ id: 10, title: "Aljabar" } as any);
            mockLearningRepo.getCognitiveLevelById!.mockResolvedValue({ id: 1, level_number: 1, name: "Pemahaman" } as any);
            mockCurriculumRepo.getSingleSubMaterialProgress!.mockResolvedValue(null);
            mockLearningRepo.findActiveSession!.mockResolvedValue(null);

            mockLearningRepo.countAttempts!.mockResolvedValue(1); // Pernah mencoba 1x sebelumnya
            mockLearningRepo.pickQuestions!.mockResolvedValue(new Array(10).fill({ id: 1 }));
            mockLearningRepo.createSession!.mockResolvedValue(202);

            vi.spyOn(service, "getAttempt").mockResolvedValueOnce({
                attempt_id: 202,
                is_remedial: true,
            } as any);

            const res = await service.startAttempt("user-1", 1, 10);

            expect(res.isResume).toBe(false);
            expect(mockLearningRepo.createSession).toHaveBeenCalledWith(
                "user-1",
                10,
                1,
                2,
                true, // isRemedial
                expect.any(Array)
            );
        });
    });

    describe("saveAnswer", () => {
        it("harus melempar BadRequestError jika sesi latihan sudah berstatus COMPLETED", async () => {
            mockLearningRepo.getSessionById!.mockResolvedValue({ id: 201, status: "COMPLETED" });

            await expect(
                service.saveAnswer(201, 1, "user-1", {
                    selected_option_ids: [1],
                    is_skipped: false,
                    time_spent_seconds: 10,
                })
            ).rejects.toThrow(BadRequestError);
        });

        it("harus berhasil autosave jawaban dan menghitung sisa butir belum dijawab", async () => {
            mockLearningRepo.getSessionById!.mockResolvedValue({ id: 201, status: "IN_PROGRESS" });
            mockLearningRepo.upsertAnswer!.mockResolvedValue({
                answeredAt: new Date(),
                answeredCount: 4,
                remainingUnansweredCount: 6,
                currentQuestionOrder: 5,
            });

            const res = await service.saveAnswer(201, 1, "user-1", {
                selected_option_ids: [5],
                is_skipped: false,
                time_spent_seconds: 25,
                current_question_order: 5,
            });

            expect(res.answered_count).toBe(4);
            expect(res.remaining_unanswered_count).toBe(6);
        });
    });

    describe("submitAttempt", () => {
        it("harus berhasil submit meskipun ada butir yang belum terjawab (< 10) dan mengevaluasinya sebagai salah", async () => {
            mockLearningRepo.getSessionById!.mockResolvedValue({
                id: 201,
                status: "IN_PROGRESS",
                sub_material_id: 10,
                cognitive_level_id: 1,
            });
            mockLearningRepo.getCognitiveLevelById!.mockResolvedValue({
                id: 1,
                level_number: 1,
                name: "Pemahaman",
                xp_reward: 50,
            });
            mockLearningRepo.evaluateAndCompleteSession!.mockResolvedValue({
                correctAnswers: 5,
                score: 50,
                isPassed: false,
                xpEarned: 0,
                isSubMaterialMastered: false,
                nextLevelUnlocked: null,
            });
            mockCurriculumRepo.getSingleSubMaterialProgress!.mockResolvedValue({
                level_1_status: "NEEDS_REMEDIAL",
            } as any);
            mockLearningRepo.getUserTotalXp!.mockResolvedValue(0);

            const res = await service.submitAttempt(201, "user-1");

            expect(mockLearningRepo.evaluateAndCompleteSession).toHaveBeenCalledWith(
                201,
                "user-1",
                10,
                1,
                50
            );
            expect(res.is_passed).toBe(false);
            expect(res.score).toBe(50);
            expect(res.next_action).toBe("LEVEL_REMEDIAL");
        });

        it("harus mengevaluasi kelulusan (>=9/10), memberikan XP reward, dan mengarahkan ke NEXT_LEVEL", async () => {
            mockLearningRepo.getSessionById!.mockResolvedValue({
                id: 201,
                status: "IN_PROGRESS",
                sub_material_id: 10,
                cognitive_level_id: 1,
            });
            mockLearningRepo.countAnsweredQuestions!.mockResolvedValue(10);
            mockLearningRepo.getCognitiveLevelById!.mockResolvedValue({
                id: 1,
                level_number: 1,
                name: "Pemahaman",
                xp_reward: 50,
            });

            mockLearningRepo.evaluateAndCompleteSession!.mockResolvedValue({
                correctAnswers: 9,
                score: 90,
                isPassed: true,
                xpEarned: 50,
                isSubMaterialMastered: false,
                nextLevelUnlocked: 2,
            });

            mockCurriculumRepo.getSingleSubMaterialProgress!.mockResolvedValue({
                is_mastered: false,
                level_1_status: "COMPLETED",
                level_2_status: "AVAILABLE",
            } as any);
            mockLearningRepo.getUserTotalXp!.mockResolvedValue(50);

            const res = await service.submitAttempt(201, "user-1");

            expect(res.is_passed).toBe(true);
            expect(res.score).toBe(90);
            expect(res.xp_earned).toBe(50);
            expect(res.next_action).toBe("NEXT_LEVEL");
        });

        it("harus mengarahkan ke LEVEL_REMEDIAL jika siswa belum mencapai skor passing (< 9/10)", async () => {
            mockLearningRepo.getSessionById!.mockResolvedValue({
                id: 201,
                status: "IN_PROGRESS",
                sub_material_id: 10,
                cognitive_level_id: 1,
            });
            mockLearningRepo.countAnsweredQuestions!.mockResolvedValue(10);
            mockLearningRepo.getCognitiveLevelById!.mockResolvedValue({ id: 1, level_number: 1, name: "Pemahaman" });

            mockLearningRepo.evaluateAndCompleteSession!.mockResolvedValue({
                correctAnswers: 7,
                score: 70,
                isPassed: false,
                xpEarned: 0,
                isSubMaterialMastered: false,
                nextLevelUnlocked: null,
            });

            mockCurriculumRepo.getSingleSubMaterialProgress!.mockResolvedValue({
                level_1_status: "NEEDS_REMEDIAL",
            } as any);
            mockLearningRepo.getUserTotalXp!.mockResolvedValue(0);

            const res = await service.submitAttempt(201, "user-1");

            expect(res.is_passed).toBe(false);
            expect(res.next_action).toBe("LEVEL_REMEDIAL");
        });
    });

    describe("getReview", () => {
        it("harus melempar error REVIEW_LOCKED (409) jika sesi belum selesai", async () => {
            mockLearningRepo.getSessionById!.mockResolvedValue({ id: 201, status: "IN_PROGRESS" });

            await expect(service.getReview(201, "user-1")).rejects.toMatchObject({
                statusCode: 409,
                code: "REVIEW_LOCKED",
            });
        });

        it("harus mengembalikan pembahasan soal lengkap dengan kunci dan panduan penalaran", async () => {
            mockLearningRepo.getSessionById!.mockResolvedValue({
                id: 201,
                status: "COMPLETED",
                cognitive_level_id: 1,
                correct_answers: 9,
            });
            mockLearningRepo.getCognitiveLevelById!.mockResolvedValue({ id: 1, level_number: 1, name: "Pemahaman" });
            mockLearningRepo.getReviewQuestions!.mockResolvedValue([
                {
                    question_order: 1,
                    question_text: "Soal 1",
                    option_id: 5,
                    option_label: "A",
                    option_text: "Opsi A",
                    is_correct: 1,
                    is_selected: 1,
                    is_answer_correct: 1,
                    explanation_text: "Pembahasan soal 1",
                    reasoning_guide: "Panduan nalar",
                },
            ]);

            const res = await service.getReview(201, "user-1");

            expect(res.attempt_id).toBe(201);
            expect(res.reviews[0].is_correct).toBe(true);
            expect(res.reviews[0].explanation_text).toBe("Pembahasan soal 1");
        });
    });
});
