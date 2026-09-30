import { describe, it, expect, vi, beforeEach } from "vitest";
import { CurriculumService } from "./curriculum.service";
import { CurriculumRepository } from "./curriculum.repository";
import { NotFoundError } from "@/shared/errors/app-error";

describe("CurriculumService Unit Tests", () => {
    let mockRepo: Partial<Record<keyof CurriculumRepository, ReturnType<typeof vi.fn>>>;
    let service: CurriculumService;

    beforeEach(() => {
        mockRepo = {
            getActiveSubjects: vi.fn(),
            getSubjectById: vi.fn(),
            isRecallPassed: vi.fn(),
            getMaterialsBySubject: vi.fn(),
            getSubMaterialsBySubject: vi.fn(),
            getCognitiveLevels: vi.fn(),
            getUserProgressForSubMaterials: vi.fn(),
            getSubMaterialById: vi.fn(),
            getSingleSubMaterialProgress: vi.fn(),
        };
        service = new CurriculumService(mockRepo as unknown as CurriculumRepository);
    });

    describe("listSubjects", () => {
        it("harus mengembalikan daftar mata pelajaran aktif beserta total materinya", async () => {
            mockRepo.getActiveSubjects!.mockResolvedValue([
                { id: 1, name: "Matematika", code: "MAT", description: "Deskripsi", total_materials: 3 },
            ]);

            const res = await service.listSubjects();

            expect(res).toHaveLength(1);
            expect(res[0].subjectId).toBe(1);
            expect(res[0].code).toBe("MAT");
            expect(res[0].totalMaterials).toBe(3);
        });
    });

    describe("getSubjectCurriculum", () => {
        it("harus melempar NotFoundError jika mata pelajaran tidak ada", async () => {
            mockRepo.getSubjectById!.mockResolvedValue(null);

            await expect(service.getSubjectCurriculum(999, "user-1")).rejects.toThrow(NotFoundError);
        });

        it("harus mengunci seluruh materi jika siswa belum lulus Recall Kemampuanmu", async () => {
            mockRepo.getSubjectById!.mockResolvedValue({ id: 1, name: "Matematika" });
            mockRepo.isRecallPassed!.mockResolvedValue(false);
            mockRepo.getMaterialsBySubject!.mockResolvedValue([
                { id: 1, title: "Aljabar", prerequisite_material_id: null },
            ]);
            mockRepo.getSubMaterialsBySubject!.mockResolvedValue([
                { id: 10, material_id: 1, title: "Persamaan Linier", order_index: 1, prerequisite_sub_material_id: null },
            ]);
            mockRepo.getCognitiveLevels!.mockResolvedValue([
                { id: 1, level_number: 1, name: "Pemahaman", target_questions: 10, passing_score: 9, xp_reward: 50 },
            ]);
            mockRepo.getUserProgressForSubMaterials!.mockResolvedValue([]);

            const res = await service.getSubjectCurriculum(1, "user-1");

            expect(res[0].status).toBe("LOCKED");
            expect(res[0].submaterials[0].status).toBe("LOCKED");
            expect(res[0].submaterials[0].levels[0].status).toBe("LOCKED");
        });

        it("harus membuka materi awal dan Level 1 jika siswa sudah lulus Recall", async () => {
            mockRepo.getSubjectById!.mockResolvedValue({ id: 1, name: "Matematika" });
            mockRepo.isRecallPassed!.mockResolvedValue(true);
            mockRepo.getMaterialsBySubject!.mockResolvedValue([
                { id: 1, title: "Bilangan", prerequisite_material_id: null },
            ]);
            mockRepo.getSubMaterialsBySubject!.mockResolvedValue([
                { id: 10, material_id: 1, title: "Bilangan Bulat", order_index: 1, prerequisite_sub_material_id: null, passing_threshold: 90, xp_reward: 50 },
            ]);
            mockRepo.getCognitiveLevels!.mockResolvedValue([
                { id: 1, level_number: 1, name: "Pemahaman", target_questions: 10, passing_score: 9, xp_reward: 50 },
                { id: 2, level_number: 2, name: "Pengaplikasian", target_questions: 10, passing_score: 9, xp_reward: 75 },
            ]);
            mockRepo.getUserProgressForSubMaterials!.mockResolvedValue([]);

            const res = await service.getSubjectCurriculum(1, "user-1");

            expect(res[0].status).toBe("IN_PROGRESS");
            expect(res[0].submaterials[0].status).toBe("IN_PROGRESS");
            expect(res[0].submaterials[0].levels[0].status).toBe("AVAILABLE");
            expect(res[0].submaterials[0].levels[1].status).toBe("LOCKED");
        });

        it("harus mengunci materi kedua jika materi prasyarat belum seluruhnya tuntas (MASTERED)", async () => {
            mockRepo.getSubjectById!.mockResolvedValue({ id: 1, name: "Matematika" });
            mockRepo.isRecallPassed!.mockResolvedValue(true);
            mockRepo.getMaterialsBySubject!.mockResolvedValue([
                { id: 1, title: "Materi 1", prerequisite_material_id: null },
                { id: 2, title: "Materi 2", prerequisite_material_id: 1 },
            ]);
            mockRepo.getSubMaterialsBySubject!.mockResolvedValue([
                { id: 10, material_id: 1, title: "Sub 1.1", prerequisite_sub_material_id: null },
                { id: 20, material_id: 2, title: "Sub 2.1", prerequisite_sub_material_id: null },
            ]);
            mockRepo.getCognitiveLevels!.mockResolvedValue([]);
            // Sub 1.1 belum tuntas
            mockRepo.getUserProgressForSubMaterials!.mockResolvedValue([
                { sub_material_id: 10, is_mastered: false },
            ]);

            const res = await service.getSubjectCurriculum(1, "user-1");

            const mat2 = res.find((m) => m.materialId === 2);
            expect(mat2?.status).toBe("LOCKED");
        });
    });

    describe("getSubMaterialProgress", () => {
        it("harus melempar NotFoundError jika submateri tidak ditemukan", async () => {
            mockRepo.getSubMaterialById!.mockResolvedValue(null);

            await expect(service.getSubMaterialProgress(999, "user-1")).rejects.toThrow(NotFoundError);
        });

        it("harus mengembalikan progres lengkap submateri", async () => {
            mockRepo.getSubMaterialById!.mockResolvedValue({ id: 1, title: "Aljabar" });
            mockRepo.getSingleSubMaterialProgress!.mockResolvedValue({
                is_mastered: true,
                level_1_status: "COMPLETED",
                level_1_score: 10,
                level_2_status: "COMPLETED",
                level_2_score: 9,
                level_3_status: "COMPLETED",
                level_3_score: 9,
                total_cumulative_score: 28,
                mastered_at: "2026-09-30T10:00:00.000Z",
                progress_state: "MASTERED",
            });

            const res = await service.getSubMaterialProgress(1, "user-1");

            expect(res.isMastered).toBe(true);
            expect(res.levels[0].score).toBe(10);
            expect(res.totalCumulativeScore).toBe(28);
            expect(res.progressState).toBe("MASTERED");
        });
    });
});
