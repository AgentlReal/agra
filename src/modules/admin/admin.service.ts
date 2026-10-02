import { AdminRepository } from "./admin.repository";
import {
    K09_AdminProfile,
    K10_QuestionBankStock,
    K10_QuestionSummary,
    K10_Question,
    K10_QuestionInput,
    K10_QuestionUpdateInput,
    K10_QuestionFilter,
    K10_Pagination,
    K11_SimulationPackageSummary,
    K11_SimulationPackage,
    K11_SimulationPackageInput,
    K11_SimulationPackageUpdateInput,
    K11_SimulationPackageStats,
} from "./admin.types";
import { BadRequestError, NotFoundError } from "@/shared/errors/app-error";

export class AdminService {
    constructor(private readonly repo = new AdminRepository()) {}

    async getProfile(userId: string): Promise<K09_AdminProfile> {
        const profile = await this.repo.getAdminProfile(userId);
        if (!profile) {
            throw new NotFoundError("Profil Tim Kurikulum tidak ditemukan");
        }
        return {
            id: profile.id,
            email: profile.email,
            username: profile.username,
            name: profile.name,
            role: "TIM_KURIKULUM",
        };
    }

    async updateProfile(userId: string, name: string): Promise<K09_AdminProfile> {
        await this.getProfile(userId);
        await this.repo.updateAdminProfile(userId, name);
        return this.getProfile(userId);
    }

    async getQuestionStock(): Promise<K10_QuestionBankStock[]> {
        return this.repo.getQuestionBankStock();
    }

    async listQuestions(filter: K10_QuestionFilter): Promise<{
        data: K10_QuestionSummary[];
        pagination: K10_Pagination;
    }> {
        const page = filter.page || 1;
        const limit = filter.limit || 20;
        const { items, totalItems } = await this.repo.listQuestions(filter);
        const totalPages = Math.ceil(totalItems / limit) || 1;

        return {
            data: items,
            pagination: {
                page,
                limit,
                total_items: totalItems,
                total_pages: totalPages,
            },
        };
    }

    async createQuestion(input: K10_QuestionInput): Promise<K10_Question> {
        // Validasi aturan pemisahan tiga bank soal (UCS-10)
        if (input.bank_type === "RECALL") {
            if (input.sub_material_id !== null && input.sub_material_id !== undefined) {
                throw new BadRequestError(
                    "Soal RECALL tidak boleh memiliki sub_material_id.",
                    "BANK_SEPARATION_VIOLATION"
                );
            }
            if (input.cognitive_level_id !== null && input.cognitive_level_id !== undefined) {
                throw new BadRequestError(
                    "Soal RECALL tidak boleh memiliki cognitive_level_id.",
                    "BANK_SEPARATION_VIOLATION"
                );
            }
        } else {
            // LEVEL_EXERCISE atau SIMULATION
            if (!input.sub_material_id) {
                throw new BadRequestError(
                    "Soal LEVEL_EXERCISE dan SIMULATION wajib memiliki sub_material_id.",
                    "BANK_SEPARATION_VIOLATION"
                );
            }
            if (!input.cognitive_level_id) {
                throw new BadRequestError(
                    "Soal LEVEL_EXERCISE dan SIMULATION wajib memiliki cognitive_level_id.",
                    "BANK_SEPARATION_VIOLATION"
                );
            }
        }

        // Validasi opsi jawaban
        if (!input.options || input.options.length !== 4) {
            throw new BadRequestError("Setiap soal wajib memiliki tepat 4 opsi jawaban (A, B, C, D).");
        }

        const labels = input.options.map((o) => o.option_label).sort().join("");
        if (labels !== "ABCD") {
            throw new BadRequestError("Opsi jawaban harus memiliki label unik A, B, C, D.");
        }

        const correctCount = input.options.filter((o) => o.is_correct).length;
        if (input.question_format === "SINGLE_CHOICE") {
            if (correctCount !== 1) {
                throw new BadRequestError(
                    "Soal SINGLE_CHOICE wajib memiliki tepat 1 kunci jawaban benar."
                );
            }
        } else if (input.question_format === "COMPLEX_CHOICE") {
            if (correctCount < 2) {
                throw new BadRequestError(
                    "Soal COMPLEX_CHOICE wajib memiliki minimal 2 kunci jawaban benar."
                );
            }
            if (correctCount > 2) {
                throw new BadRequestError(
                    "Soal COMPLEX_CHOICE memiliki batas maksimal 2 kunci jawaban benar yang dipilih."
                );
            }
        }

        const questionId = await this.repo.createQuestion(input);
        const detail = await this.repo.getQuestionDetail(questionId);
        if (!detail) {
            throw new NotFoundError("Soal gagal dimuat setelah dibuat");
        }
        return detail;
    }

    async getQuestionDetail(questionId: number): Promise<K10_Question> {
        const detail = await this.repo.getQuestionDetail(questionId);
        if (!detail) {
            throw new NotFoundError("Butir soal tidak ditemukan");
        }
        return detail;
    }

    async updateQuestion(questionId: number, input: K10_QuestionUpdateInput): Promise<K10_Question> {
        const existing = await this.getQuestionDetail(questionId);

        const mergedBankType = input.bank_type ?? existing.bank_type;
        const mergedSubMaterialId = input.sub_material_id !== undefined ? input.sub_material_id : existing.sub_material_id;
        const mergedCognitiveLevelId = input.cognitive_level_id !== undefined ? input.cognitive_level_id : existing.cognitive_level_id;
        const mergedFormat = input.question_format ?? existing.question_format;

        // Validasi aturan pemisahan tiga bank soal (UCS-10)
        if (mergedBankType === "RECALL") {
            if (mergedSubMaterialId !== null && mergedSubMaterialId !== undefined) {
                throw new BadRequestError(
                    "Soal RECALL tidak boleh memiliki sub_material_id.",
                    "BANK_SEPARATION_VIOLATION"
                );
            }
            if (mergedCognitiveLevelId !== null && mergedCognitiveLevelId !== undefined) {
                throw new BadRequestError(
                    "Soal RECALL tidak boleh memiliki cognitive_level_id.",
                    "BANK_SEPARATION_VIOLATION"
                );
            }
        } else {
            // LEVEL_EXERCISE atau SIMULATION
            if (!mergedSubMaterialId) {
                throw new BadRequestError(
                    "Soal LEVEL_EXERCISE dan SIMULATION wajib memiliki sub_material_id.",
                    "BANK_SEPARATION_VIOLATION"
                );
            }
            if (!mergedCognitiveLevelId) {
                throw new BadRequestError(
                    "Soal LEVEL_EXERCISE dan SIMULATION wajib memiliki cognitive_level_id.",
                    "BANK_SEPARATION_VIOLATION"
                );
            }
        }

        if (input.options) {
            if (input.options.length !== 4) {
                throw new BadRequestError("Setiap soal wajib memiliki tepat 4 opsi jawaban (A, B, C, D).");
            }
            const labels = input.options.map((o) => o.option_label).sort().join("");
            if (labels !== "ABCD") {
                throw new BadRequestError("Opsi jawaban harus memiliki label unik A, B, C, D.");
            }
            const correctCount = input.options.filter((o) => o.is_correct).length;
            if (mergedFormat === "SINGLE_CHOICE") {
                if (correctCount !== 1) {
                    throw new BadRequestError(
                        "Soal SINGLE_CHOICE wajib memiliki tepat 1 kunci jawaban benar."
                    );
                }
            } else if (mergedFormat === "COMPLEX_CHOICE") {
                if (correctCount < 2) {
                    throw new BadRequestError(
                        "Soal COMPLEX_CHOICE wajib memiliki minimal 2 kunci jawaban benar."
                    );
                }
                if (correctCount > 2) {
                    throw new BadRequestError(
                        "Soal COMPLEX_CHOICE memiliki batas maksimal 2 kunci jawaban benar yang dipilih."
                    );
                }
            }
        }

        await this.repo.updateQuestion(questionId, input);
        const updated = await this.repo.getQuestionDetail(questionId);
        if (!updated) {
            throw new NotFoundError("Soal tidak ditemukan setelah diperbarui");
        }
        return updated;
    }

    async toggleQuestionStatus(questionId: number, isActive: boolean): Promise<K10_Question> {
        await this.getQuestionDetail(questionId);
        await this.repo.toggleQuestionStatus(questionId, isActive);
        return this.getQuestionDetail(questionId);
    }

    async listSimulationPackages(page = 1, limit = 20): Promise<{
        data: K11_SimulationPackageSummary[];
        pagination: K10_Pagination;
    }> {
        const { items, totalItems } = await this.repo.listSimulationPackages(page, limit);
        const totalPages = Math.ceil(totalItems / limit) || 1;

        return {
            data: items,
            pagination: {
                page,
                limit,
                total_items: totalItems,
                total_pages: totalPages,
            },
        };
    }

    async createSimulationPackage(input: K11_SimulationPackageInput): Promise<K11_SimulationPackage> {
        if (!input.questions || input.questions.length === 0) {
            const randomQuestions = await this.repo.getRandomQuestionsForSimulation(input.subject_id, 30);
            if (randomQuestions.length < 30) {
                throw new BadRequestError(
                    "Stok butir soal untuk mata pelajaran ini belum mencukupi 30 butir.",
                    "INSUFFICIENT_QUESTION_STOCK"
                );
            }
            input.questions = randomQuestions.map((q, idx) => ({
                question_id: q.id,
                question_order: idx + 1,
            }));
        } else if (input.questions.length !== 30) {
            throw new BadRequestError(
                "Paket simulasi harus terdiri dari tepat 30 butir soal.",
                "INVALID_PACKAGE_STRUCTURE"
            );
        }

        if (!input.package_code) {
            const prefix = input.subject_id === 1 ? "MAT-SIM" : input.subject_id === 2 ? "BIN-SIM" : "SIM";
            input.package_code = `${prefix}-${Date.now().toString().slice(-4)}`;
        }

        const packageId = await this.repo.createSimulationPackage(input);
        const pkg = await this.repo.getSimulationPackageById(packageId);
        if (!pkg) {
            throw new NotFoundError("Paket simulasi gagal dimuat setelah dibuat");
        }
        return pkg;
    }

    async getSimulationPackage(packageId: number): Promise<K11_SimulationPackage> {
        const pkg = await this.repo.getSimulationPackageById(packageId);
        if (!pkg) {
            throw new NotFoundError("Paket simulasi tidak ditemukan");
        }
        return pkg;
    }

    async updateSimulationPackage(packageId: number, input: K11_SimulationPackageUpdateInput): Promise<K11_SimulationPackage> {
        await this.getSimulationPackage(packageId);
        if (input.questions && input.questions.length !== 30) {
            throw new BadRequestError(
                "Paket simulasi harus terdiri dari tepat 30 butir soal.",
                "INVALID_PACKAGE_STRUCTURE"
            );
        }
        await this.repo.updateSimulationPackage(packageId, input);
        return this.getSimulationPackage(packageId);
    }

    async updateSimulationPackageStatus(packageId: number, status?: string, isActive?: boolean): Promise<K11_SimulationPackage> {
        await this.getSimulationPackage(packageId);
        await this.repo.updateSimulationPackageStatus(packageId, status, isActive);
        return this.getSimulationPackage(packageId);
    }

    async getSimulationPackageStats(packageId: number): Promise<K11_SimulationPackageStats> {
        const stats = await this.repo.getSimulationStats(packageId);
        if (!stats) {
            throw new NotFoundError("Paket simulasi tidak ditemukan");
        }
        return stats;
    }
}

