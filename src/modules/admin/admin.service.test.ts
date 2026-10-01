import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminService } from "./admin.service";
import { AdminRepository } from "./admin.repository";
import { NotFoundError, BadRequestError } from "@/shared/errors/app-error";

describe("AdminService Unit Tests", () => {
    let mockRepo: Partial<Record<keyof AdminRepository, ReturnType<typeof vi.fn>>>;
    let service: AdminService;

    beforeEach(() => {
        mockRepo = {
            getAdminProfile: vi.fn(),
            updateAdminProfile: vi.fn(),
            getQuestionBankStock: vi.fn(),
            listQuestions: vi.fn(),
            createQuestion: vi.fn(),
            getQuestionDetail: vi.fn(),
            updateQuestion: vi.fn(),
            toggleQuestionStatus: vi.fn(),
            getRandomQuestionsForSimulation: vi.fn(),
            listSimulationPackages: vi.fn(),
            createSimulationPackage: vi.fn(),
            getSimulationPackageById: vi.fn(),
            updateSimulationPackage: vi.fn(),
            updateSimulationPackageStatus: vi.fn(),
            getSimulationStats: vi.fn(),
        };
        service = new AdminService(mockRepo as unknown as AdminRepository);
    });

    describe("getProfile & updateProfile", () => {
        it("harus melempar NotFoundError jika profil Tim Kurikulum tidak ditemukan", async () => {
            mockRepo.getAdminProfile!.mockResolvedValue(null);

            await expect(service.getProfile("admin-999")).rejects.toThrow(NotFoundError);
        });

        it("harus berhasil mengembalikan profil Tim Kurikulum", async () => {
            mockRepo.getAdminProfile!.mockResolvedValue({
                id: "admin-1",
                email: "tim@example.com",
                username: "tim_kurikulum",
                name: "Tim Kurikulum",
            });

            const res = await service.getProfile("admin-1");

            expect(res.id).toBe("admin-1");
            expect(res.role).toBe("TIM_KURIKULUM");
        });

        it("harus berhasil memperbarui nama profil", async () => {
            mockRepo.getAdminProfile!.mockResolvedValue({
                id: "admin-1",
                email: "tim@example.com",
                username: "tim_kurikulum",
                name: "Nama Lama",
            });
            mockRepo.updateAdminProfile!.mockResolvedValue(undefined);

            const res = await service.updateProfile("admin-1", "Nama Baru");

            expect(mockRepo.updateAdminProfile).toHaveBeenCalledWith("admin-1", "Nama Baru");
        });
    });

    describe("createQuestion (Aturan Pemisahan 3 Bank Soal UCS-10)", () => {
        it("harus menolak soal RECALL jika menyertakan sub_material_id (BANK_SEPARATION_VIOLATION)", async () => {
            await expect(
                service.createQuestion({
                    subject_id: 1,
                    bank_type: "RECALL",
                    sub_material_id: 10, // Dilarang pada bank RECALL
                    question_format: "SINGLE_CHOICE",
                    question_text: "Soal",
                    options: [
                        { option_label: "A", option_text: "A", is_correct: true },
                        { option_label: "B", option_text: "B", is_correct: false },
                        { option_label: "C", option_text: "C", is_correct: false },
                        { option_label: "D", option_text: "D", is_correct: false },
                    ],
                    explanation: { explanation_text: "Penjelasan" },
                })
            ).rejects.toMatchObject({
                code: "BANK_SEPARATION_VIOLATION",
            });
        });

        it("harus menolak soal RECALL jika menyertakan cognitive_level_id (BANK_SEPARATION_VIOLATION)", async () => {
            await expect(
                service.createQuestion({
                    subject_id: 1,
                    bank_type: "RECALL",
                    cognitive_level_id: 1, // Dilarang pada bank RECALL
                    question_format: "SINGLE_CHOICE",
                    question_text: "Soal",
                    options: [
                        { option_label: "A", option_text: "A", is_correct: true },
                        { option_label: "B", option_text: "B", is_correct: false },
                        { option_label: "C", option_text: "C", is_correct: false },
                        { option_label: "D", option_text: "D", is_correct: false },
                    ],
                    explanation: { explanation_text: "Penjelasan" },
                })
            ).rejects.toMatchObject({
                code: "BANK_SEPARATION_VIOLATION",
            });
        });

        it("harus menolak soal LEVEL_EXERCISE jika TIDAK memiliki sub_material_id atau cognitive_level_id", async () => {
            await expect(
                service.createQuestion({
                    subject_id: 1,
                    bank_type: "LEVEL_EXERCISE",
                    sub_material_id: null, // Wajib diisi pada LEVEL_EXERCISE
                    cognitive_level_id: 1,
                    question_format: "SINGLE_CHOICE",
                    question_text: "Soal",
                    options: [
                        { option_label: "A", option_text: "A", is_correct: true },
                        { option_label: "B", option_text: "B", is_correct: false },
                        { option_label: "C", option_text: "C", is_correct: false },
                        { option_label: "D", option_text: "D", is_correct: false },
                    ],
                    explanation: { explanation_text: "Penjelasan" },
                })
            ).rejects.toMatchObject({
                code: "BANK_SEPARATION_VIOLATION",
            });
        });

        it("harus menolak soal jika jumlah opsi bukan tepat 4 (A, B, C, D)", async () => {
            await expect(
                service.createQuestion({
                    subject_id: 1,
                    bank_type: "RECALL",
                    question_format: "SINGLE_CHOICE",
                    question_text: "Soal",
                    options: [
                        { option_label: "A", option_text: "A", is_correct: true },
                        { option_label: "B", option_text: "B", is_correct: false },
                    ],
                    explanation: { explanation_text: "Penjelasan" },
                })
            ).rejects.toThrow(BadRequestError);
        });

        it("harus menolak soal SINGLE_CHOICE jika kunci jawaban benar tidak tepat 1", async () => {
            await expect(
                service.createQuestion({
                    subject_id: 1,
                    bank_type: "RECALL",
                    question_format: "SINGLE_CHOICE",
                    question_text: "Soal",
                    options: [
                        { option_label: "A", option_text: "A", is_correct: true },
                        { option_label: "B", option_text: "B", is_correct: true }, // Ada 2 kunci benar
                        { option_label: "C", option_text: "C", is_correct: false },
                        { option_label: "D", option_text: "D", is_correct: false },
                    ],
                    explanation: { explanation_text: "Penjelasan" },
                })
            ).rejects.toThrow(BadRequestError);
        });

        it("harus menolak soal COMPLEX_CHOICE jika kunci jawaban benar kurang dari 2", async () => {
            await expect(
                service.createQuestion({
                    subject_id: 1,
                    bank_type: "RECALL",
                    question_format: "COMPLEX_CHOICE",
                    question_text: "Soal",
                    options: [
                        { option_label: "A", option_text: "A", is_correct: true }, // Hanya 1 kunci benar
                        { option_label: "B", option_text: "B", is_correct: false },
                        { option_label: "C", option_text: "C", is_correct: false },
                        { option_label: "D", option_text: "D", is_correct: false },
                    ],
                    explanation: { explanation_text: "Penjelasan" },
                })
            ).rejects.toThrow(BadRequestError);
        });

        it("harus berhasil membuat soal yang valid dan mengembalikan detailnya", async () => {
            mockRepo.createQuestion!.mockResolvedValue(1001);
            mockRepo.getQuestionDetail!.mockResolvedValue({
                id: 1001,
                subject_id: 1,
                bank_type: "RECALL",
                question_format: "SINGLE_CHOICE",
                question_text: "Berapakah 2 + 2?",
                is_active: true,
            } as any);

            const res = await service.createQuestion({
                subject_id: 1,
                bank_type: "RECALL",
                question_format: "SINGLE_CHOICE",
                question_text: "Berapakah 2 + 2?",
                options: [
                    { option_label: "A", option_text: "4", is_correct: true },
                    { option_label: "B", option_text: "5", is_correct: false },
                    { option_label: "C", option_text: "6", is_correct: false },
                    { option_label: "D", option_text: "7", is_correct: false },
                ],
                explanation: { explanation_text: "2 + 2 = 4" },
            });

            expect(res.id).toBe(1001);
            expect(res.question_text).toBe("Berapakah 2 + 2?");
        });
    });

    describe("createSimulationPackage", () => {
        it("harus menolak pembuatan paket jika jumlah soal tidak tepat 30 butir (INVALID_PACKAGE_STRUCTURE)", async () => {
            await expect(
                service.createSimulationPackage({
                    subject_id: 1,
                    title: "Paket Gagal",
                    package_code: "PKG-01",
                    questions: [{ question_id: 1, question_order: 1 }], // Hanya 1 soal
                })
            ).rejects.toMatchObject({
                code: "INVALID_PACKAGE_STRUCTURE",
            });
        });

        it("harus berhasil membuat paket simulasi jika berisi tepat 30 butir soal", async () => {
            const thirtyQuestions = Array.from({ length: 30 }, (_, i) => ({
                question_id: i + 1,
                question_order: i + 1,
            }));

            mockRepo.createSimulationPackage!.mockResolvedValue(501);
            mockRepo.getSimulationPackageById!.mockResolvedValue({
                id: 501,
                title: "Paket Lengkap",
                total_questions: 30,
            } as any);

            const res = await service.createSimulationPackage({
                subject_id: 1,
                title: "Paket Lengkap",
                package_code: "PKG-30",
                questions: thirtyQuestions,
            });

            expect(res.id).toBe(501);
            expect(res.total_questions).toBe(30);
        });

        it("harus otomatis memilihkan 30 soal acak jika questions tidak disertakan", async () => {
            const thirtyQuestions = Array.from({ length: 30 }, (_, i) => ({ id: i + 10 }));
            mockRepo.getRandomQuestionsForSimulation!.mockResolvedValue(thirtyQuestions);
            mockRepo.createSimulationPackage!.mockResolvedValue(502);
            mockRepo.getSimulationPackageById!.mockResolvedValue({
                id: 502,
                title: "Paket Auto Select",
                total_questions: 30,
            } as any);

            const res = await service.createSimulationPackage({
                subject_id: 1,
                title: "Paket Auto Select",
            });

            expect(mockRepo.getRandomQuestionsForSimulation).toHaveBeenCalledWith(1, 30);
            expect(res.id).toBe(502);
        });

        it("harus melempar BadRequestError jika stok soal kurang dari 30 butir", async () => {
            mockRepo.getRandomQuestionsForSimulation!.mockResolvedValue([{ id: 1 }, { id: 2 }]); // Hanya 2 soal

            await expect(
                service.createSimulationPackage({
                    subject_id: 1,
                    title: "Paket Kurang Soal",
                })
            ).rejects.toMatchObject({
                code: "INSUFFICIENT_QUESTION_STOCK",
            });
        });
    });

    describe("updateQuestion", () => {
        it("harus melempar NotFoundError jika soal tidak ditemukan saat diedit", async () => {
            mockRepo.getQuestionDetail!.mockResolvedValue(null);

            await expect(
                service.updateQuestion(999, {
                    question_text: "Soal Baru",
                })
            ).rejects.toThrow(NotFoundError);
        });

        it("harus menolak update jika format SINGLE_CHOICE diubah menjadi memiliki 2 kunci jawaban benar", async () => {
            mockRepo.getQuestionDetail!.mockResolvedValue({
                id: 1,
                bank_type: "LEVEL_EXERCISE",
                sub_material_id: 1,
                cognitive_level_id: 1,
                question_format: "SINGLE_CHOICE",
            } as any);

            await expect(
                service.updateQuestion(1, {
                    options: [
                        { option_label: "A", option_text: "A", is_correct: true },
                        { option_label: "B", option_text: "B", is_correct: true },
                        { option_label: "C", option_text: "C", is_correct: false },
                        { option_label: "D", option_text: "D", is_correct: false },
                    ],
                })
            ).rejects.toThrow(BadRequestError);
        });

        it("harus berhasil memperbarui soal dan mengembalikan data terbaru", async () => {
            mockRepo.getQuestionDetail!
                .mockResolvedValueOnce({
                    id: 1,
                    bank_type: "LEVEL_EXERCISE",
                    sub_material_id: 1,
                    cognitive_level_id: 1,
                    question_format: "SINGLE_CHOICE",
                    question_text: "Soal Lama",
                } as any)
                .mockResolvedValueOnce({
                    id: 1,
                    bank_type: "LEVEL_EXERCISE",
                    sub_material_id: 1,
                    cognitive_level_id: 1,
                    question_format: "SINGLE_CHOICE",
                    question_text: "Soal Baru",
                } as any);

            mockRepo.updateQuestion!.mockResolvedValue(undefined);

            const res = await service.updateQuestion(1, {
                question_text: "Soal Baru",
            });

            expect(mockRepo.updateQuestion).toHaveBeenCalledWith(1, { question_text: "Soal Baru" });
            expect(res.question_text).toBe("Soal Baru");
        });
    });

    describe("getSimulationPackage & updateSimulationPackageStatus", () => {
        it("harus melempar NotFoundError jika paket simulasi tidak ditemukan", async () => {
            mockRepo.getSimulationPackageById!.mockResolvedValue(null);

            await expect(service.getSimulationPackage(999)).rejects.toThrow(NotFoundError);
        });

        it("harus mengembalikan detail paket simulasi jika ditemukan", async () => {
            mockRepo.getSimulationPackageById!.mockResolvedValue({
                id: 1,
                title: "Paket 1",
                total_questions: 30,
            } as any);

            const res = await service.getSimulationPackage(1);
            expect(res.id).toBe(1);
            expect(res.title).toBe("Paket 1");
        });

        it("harus berhasil mengubah status paket simulasi", async () => {
            mockRepo.getSimulationPackageById!
                .mockResolvedValueOnce({
                    id: 1,
                    title: "Paket 1",
                    status: "DRAFT",
                    is_active: false,
                } as any)
                .mockResolvedValueOnce({
                    id: 1,
                    title: "Paket 1",
                    status: "ACTIVE",
                    is_active: true,
                } as any);

            mockRepo.updateSimulationPackageStatus!.mockResolvedValue(undefined);

            const res = await service.updateSimulationPackageStatus(1, "ACTIVE", true);
            expect(mockRepo.updateSimulationPackageStatus).toHaveBeenCalledWith(1, "ACTIVE", true);
            expect(res.status).toBe("ACTIVE");
        });
    });

    describe("getSimulationPackageStats", () => {
        it("harus melempar NotFoundError jika paket simulasi tidak ditemukan", async () => {
            mockRepo.getSimulationStats!.mockResolvedValue(null);

            await expect(service.getSimulationPackageStats(999)).rejects.toThrow(NotFoundError);
        });

        it("harus mengembalikan statistik performa paket simulasi", async () => {
            mockRepo.getSimulationStats!.mockResolvedValue({
                package_id: 501,
                participant_count: 120,
                average_score: 82.5,
            });

            const res = await service.getSimulationPackageStats(501);

            expect(res.package_id).toBe(501);
            expect(res.participant_count).toBe(120);
            expect(res.average_score).toBe(82.5);
        });
    });
});

