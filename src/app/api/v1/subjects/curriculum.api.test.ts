import { describe, it, expect, vi } from "vitest";
import { GET as getSubjects } from "./route";
import { GET as getCurriculum } from "./[subjectId]/curriculum/route";
import { GET as getSubmaterialProgress } from "../submaterials/[submaterialId]/progress/route";
import { curriculumController } from "@/modules/curriculum/curriculum.controller";
import { createTestRequest, parseApiResponse } from "@/shared/testing/test-utils";

describe("Curriculum API Endpoints", () => {
    describe("GET /api/v1/subjects", () => {
        it("harus mengembalikan daftar mata pelajaran aktif", async () => {
            vi.spyOn(curriculumController["service"], "listSubjects").mockResolvedValueOnce([
                {
                    subjectId: 1,
                    code: "MAT",
                    name: "Matematika",
                    description: "Materi Matematika SMP",
                    totalMaterials: 2,
                },
                {
                    subjectId: 2,
                    code: "BIN",
                    name: "Bahasa Indonesia",
                    description: "Materi Bahasa Indonesia SMP",
                    totalMaterials: 2,
                },
            ]);

            const res = await getSubjects();
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body).toHaveLength(2);
            expect(body[0].code).toBe("MAT");
            expect(body[1].code).toBe("BIN");
        });
    });

    describe("GET /api/v1/subjects/:subjectId/curriculum", () => {
        it("harus mengembalikan struktur materi, submateri, dan level kognitif", async () => {
            vi.spyOn(curriculumController["service"], "getSubjectCurriculum").mockResolvedValueOnce([
                {
                    materialId: 1,
                    title: "Bilangan & Operasi",
                    status: "IN_PROGRESS",
                    submaterials: [
                        {
                            submaterialId: 1,
                            title: "Bilangan Bulat",
                            status: "IN_PROGRESS",
                            code: "MAT-01",
                            orderIndex: 1,
                            prerequisiteSubmaterialId: null,
                            passingThreshold: 90,
                            xpReward: 50,
                            levels: [
                                {
                                    id: 1,
                                    levelNumber: 1,
                                    name: "Pemahaman",
                                    status: "AVAILABLE",
                                    targetQuestions: 10,
                                    passingScore: 9,
                                    xpReward: 50,
                                },
                            ],
                        },
                    ],
                },
            ]);

            const req = createTestRequest("/api/v1/subjects/1/curriculum");
            const res = await getCurriculum(req, { params: Promise.resolve({ subjectId: "1" }) });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body[0].materialId).toBe(1);
            expect(body[0].submaterials[0].levels[0].status).toBe("AVAILABLE");
        });
    });

    describe("GET /api/v1/submaterials/:submaterialId/progress", () => {
        it("harus mengembalikan progres level dan status masteri submateri", async () => {
            vi.spyOn(curriculumController["service"], "getSubMaterialProgress").mockResolvedValueOnce({
                isMastered: false,
                totalCumulativeScore: 9,
                masteredAt: null,
                progressState: "IN_PROGRESS",
                levels: [
                    { level: 1, status: "COMPLETED", score: 9 },
                    { level: 2, status: "AVAILABLE", score: null },
                    { level: 3, status: "LOCKED", score: null },
                ],
            });

            const req = createTestRequest("/api/v1/submaterials/1/progress");
            const res = await getSubmaterialProgress(req, {
                params: Promise.resolve({ submaterialId: "1" }),
            });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.levels[0].status).toBe("COMPLETED");
            expect(body.levels[1].status).toBe("AVAILABLE");
        });
    });
});
