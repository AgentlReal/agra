import { describe, it, expect, vi, beforeEach } from "vitest";
import { RecallService } from "./recall.service";
import { RecallRepository } from "./recall.repository";
import { NotFoundError, BadRequestError, AppError } from "@/shared/errors/app-error";

describe("RecallService Unit Tests", () => {
    let mockRepo: Partial<Record<keyof RecallRepository, ReturnType<typeof vi.fn>>>;
    let service: RecallService;

    beforeEach(() => {
        mockRepo = {
            getLatestAttempt: vi.fn(),
            findActiveSession: vi.fn(),
            countAttempts: vi.fn(),
            pickRecallQuestions: vi.fn(),
            createSessionWithQuestions: vi.fn(),
            getSessionById: vi.fn(),
            getSessionQuestionsWithOptions: vi.fn(),
            getSavedAnswers: vi.fn(),
            countAnsweredQuestions: vi.fn(),
            upsertAnswer: vi.fn(),
            evaluateAndCompleteSession: vi.fn(),
            getReviewQuestions: vi.fn(),
        };
        service = new RecallService(mockRepo as unknown as RecallRepository);
    });

    describe("getRecallStatus", () => {
        it("harus mengembalikan status belum lulus jika belum ada riwayat pengerjaan", async () => {
            mockRepo.getLatestAttempt!.mockResolvedValue(null);

            const res = await service.getRecallStatus("user-1");

            expect(res.isPassed).toBe(false);
            expect(res.lastAttemptId).toBeNull();
        });

        it("harus mengembalikan status lulus jika percobaan terakhir lulus", async () => {
            mockRepo.getLatestAttempt!.mockResolvedValue({ id: 10, is_passed: 1 });

            const res = await service.getRecallStatus("user-1");

            expect(res.isPassed).toBe(true);
            expect(res.lastAttemptId).toBe(10);
        });
    });

    describe("startRecallAttempt", () => {
        it("harus me-resume sesi aktif jika sudah ada sesi yang berjalan", async () => {
            mockRepo.findActiveSession!.mockResolvedValue({ id: 105 });

            const res = await service.startRecallAttempt("user-1");

            expect(res.attemptId).toBe(105);
            expect(res.totalQuestions).toBe(30);
            expect(mockRepo.createSessionWithQuestions).not.toHaveBeenCalled();
        });

        it("harus melempar BadRequestError jika stok butir soal kurang dari 30", async () => {
            mockRepo.findActiveSession!.mockResolvedValue(null);
            mockRepo.countAttempts!.mockResolvedValue(0);
            mockRepo.pickRecallQuestions!.mockResolvedValue(new Array(20).fill({ id: 1 })); // Hanya 20 soal

            await expect(service.startRecallAttempt("user-1")).rejects.toThrow(BadRequestError);
        });

        it("harus berhasil membuat sesi Recall baru dengan 30 butir soal acak", async () => {
            mockRepo.findActiveSession!.mockResolvedValue(null);
            mockRepo.countAttempts!.mockResolvedValue(0);
            mockRepo.pickRecallQuestions!.mockResolvedValue(new Array(30).fill({ id: 1 }));
            mockRepo.createSessionWithQuestions!.mockResolvedValue(101);

            const res = await service.startRecallAttempt("user-1");

            expect(res.attemptId).toBe(101);
            expect(res.totalQuestions).toBe(30);
            expect(mockRepo.createSessionWithQuestions).toHaveBeenCalled();
        });
    });

    describe("getRecallAttempt", () => {
        it("harus melempar NotFoundError jika sesi Recall tidak ditemukan", async () => {
            mockRepo.getSessionById!.mockResolvedValue(null);

            await expect(service.getRecallAttempt(999, "user-1")).rejects.toThrow(NotFoundError);
        });

        it("harus mengembalikan detail sesi beserta susunan soal dan jawaban yang tersimpan", async () => {
            mockRepo.getSessionById!.mockResolvedValue({
                id: 101,
                status: "IN_PROGRESS",
                total_questions: 30,
                current_question_order: 1,
            });
            mockRepo.getSessionQuestionsWithOptions!.mockResolvedValue([
                {
                    session_question_id: 1,
                    subject_id: 1,
                    question_order: 1,
                    question_format: "SINGLE_CHOICE",
                    question_text: "2 + 2 = ...",
                    option_id: 10,
                    option_label: "A",
                    option_text: "4",
                },
            ]);
            mockRepo.getSavedAnswers!.mockResolvedValue([
                { session_question_id: 1, selected_option_id: 10, is_skipped: 0 },
            ]);
            mockRepo.countAnsweredQuestions!.mockResolvedValue(1);

            const res = await service.getRecallAttempt(101, "user-1");

            expect(res.attemptId).toBe(101);
            expect(res.answeredCount).toBe(1);
            expect(res.questions[0].options[0].option_text).toBe("4");
            expect(res.questions[0].selected_option_ids).toEqual([10]);
        });
    });

    describe("saveAnswer", () => {
        it("harus melempar NotFoundError jika sesi tidak ditemukan", async () => {
            mockRepo.getSessionById!.mockResolvedValue(null);

            await expect(
                service.saveAnswer(999, 1, "user-1", { selectedOptionIds: [1] })
            ).rejects.toThrow(NotFoundError);
        });

        it("harus melempar BadRequestError jika sesi sudah selesai (bukan IN_PROGRESS)", async () => {
            mockRepo.getSessionById!.mockResolvedValue({ id: 101, status: "COMPLETED" });

            await expect(
                service.saveAnswer(101, 1, "user-1", { selectedOptionIds: [1] })
            ).rejects.toThrow(BadRequestError);
        });

        it("harus berhasil menyimpan jawaban (autosave)", async () => {
            mockRepo.getSessionById!.mockResolvedValue({ id: 101, status: "IN_PROGRESS" });
            mockRepo.upsertAnswer!.mockResolvedValue({
                answeredAt: new Date(),
                answeredCount: 5,
                currentQuestionOrder: 6,
            });

            const res = await service.saveAnswer(101, 1, "user-1", {
                selectedOptionIds: [10],
                isSkipped: false,
                timeSpentSeconds: 15,
                currentQuestionOrder: 6,
            });

            expect(res.answeredCount).toBe(5);
            expect(res.currentQuestionOrder).toBe(6);
            expect(res.selectedOptionIds).toEqual([10]);
        });
    });

    describe("submitAttempt", () => {
        it("harus berhasil submit meskipun ada butir yang belum dijawab (< 30) dan mengevaluasinya sebagai salah", async () => {
            mockRepo.getSessionById!.mockResolvedValue({ id: 101, status: "IN_PROGRESS" });
            mockRepo.evaluateAndCompleteSession!.mockResolvedValue({
                correctAnswers: 20,
                isPassed: false,
                mathCorrect: 10,
                mathTotal: 15,
                bahasaCorrect: 10,
                bahasaTotal: 15,
            });

            const res = await service.submitAttempt(101, "user-1");

            expect(mockRepo.evaluateAndCompleteSession).toHaveBeenCalledWith(101, "user-1");
            expect(res.totalCorrect).toBe(20);
            expect(res.isPassed).toBe(false);
        });

        it("harus berhasil mengevaluasi sesi dan mengembalikan kelulusan", async () => {
            mockRepo.getSessionById!.mockResolvedValue({ id: 101, status: "IN_PROGRESS" });
            mockRepo.countAnsweredQuestions!.mockResolvedValue(30);
            mockRepo.evaluateAndCompleteSession!.mockResolvedValue({
                correctAnswers: 26,
                isPassed: true,
                mathCorrect: 13,
                mathTotal: 15,
                bahasaCorrect: 13,
                bahasaTotal: 15,
            });

            const res = await service.submitAttempt(101, "user-1");

            expect(res.totalCorrect).toBe(26);
            expect(res.isPassed).toBe(true);
            expect(res.subjectResults[0].correctAnswers).toBe(13);
            expect(res.subjectResults[1].correctAnswers).toBe(13);
        });
    });

    describe("getReview", () => {
        it("harus menolak reviu jika sesi belum COMPLETED", async () => {
            mockRepo.getSessionById!.mockResolvedValue({ id: 101, status: "IN_PROGRESS" });

            await expect(service.getReview(101, "user-1")).rejects.toThrow(BadRequestError);
        });

        it("harus mengembalikan pembahasan soal lengkap dengan kunci dan panduan penalaran", async () => {
            mockRepo.getSessionById!.mockResolvedValue({ id: 101, status: "COMPLETED" });
            mockRepo.getReviewQuestions!.mockResolvedValue([
                {
                    question_order: 1,
                    subject_id: 1,
                    question_text: "Soal 1",
                    option_id: 10,
                    option_label: "A",
                    option_text: "Pilihan A",
                    is_correct: 1,
                    is_selected: 1,
                    is_answer_correct: 1,
                    explanation_text: "Pembahasan mendalam.",
                    reasoning_guide: "Panduan penalaran.",
                },
            ]);

            const res = await service.getReview(101, "user-1");

            expect(res.attemptId).toBe(101);
            expect(res.reviews[0].is_correct).toBe(true);
            expect(res.reviews[0].explanation_text).toBe("Pembahasan mendalam.");
            expect(res.reviews[0].reasoning_guide).toBe("Panduan penalaran.");
        });
    });
});
