import { describe, it, expect, vi } from "vitest";
import { GET as getAdminProfile, PATCH as updateAdminProfile } from "./profile/route";
import { GET as getQuestionStock } from "./question-banks/stock/route";
import { GET as listQuestions, POST as createQuestion } from "./questions/route";
import { PATCH as updateQuestion } from "./questions/[questionId]/route";
import { GET as listPackages, POST as createPackage } from "./simulation-packages/route";
import { GET as getPackage, PATCH as updatePackage } from "./simulation-packages/[packageId]/route";
import { PATCH as updatePackageStatus } from "./simulation-packages/[packageId]/status/route";
import { POST as uploadQuestionImage } from "./question-images/route";
import { adminController } from "@/modules/admin/admin.controller";
import {
    createTestRequest,
    parseApiResponse,
    setMockSessionUser,
    defaultMockStudent,
    defaultMockCurriculum,
} from "@/shared/testing/test-utils";

describe("Admin (Tim Kurikulum) API Endpoints", () => {
    describe("Otorisasi Peran (RBAC Guard)", () => {
        it("harus menolak dengan 403 Forbidden jika diakses oleh SISWA", async () => {
            setMockSessionUser(defaultMockStudent);
            const res = await getAdminProfile();
            const { status } = await parseApiResponse(res);

            expect(status).toBe(403);
        });

        it("harus mengizinkan akses jika diakses oleh TIM_KURIKULUM", async () => {
            setMockSessionUser(defaultMockCurriculum);
            vi.spyOn(adminController["service"], "getProfile").mockResolvedValueOnce({
                id: "admin-uuid-1",
                email: "kurikulum@example.com",
                username: "tim_kurikulum",
                name: "Admin Kurikulum",
                role: "TIM_KURIKULUM",
            });

            const res = await getAdminProfile();
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.role).toBe("TIM_KURIKULUM");
        });
    });

    describe("GET /api/v1/admin/question-banks/stock", () => {
        it("harus mengembalikan monitoring stok 3 bank soal", async () => {
            setMockSessionUser(defaultMockCurriculum);
            vi.spyOn(adminController["service"], "getQuestionStock").mockResolvedValueOnce([
                {
                    bank_type: "RECALL",
                    subject_id: 1,
                    sub_material_id: null,
                    cognitive_level_id: null,
                    active_question_count: 35,
                },
            ]);

            const res = await getQuestionStock();
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body[0].bank_type).toBe("RECALL");
            expect(body[0].active_question_count).toBe(35);
        });
    });

    describe("POST /api/v1/admin/questions", () => {
        it("harus menolak pembuatan soal jika opsi jawaban tidak tepat 4 opsi", async () => {
            setMockSessionUser(defaultMockCurriculum);
            const req = createTestRequest("/api/v1/admin/questions", {
                method: "POST",
                body: {
                    subject_id: 1,
                    bank_type: "RECALL",
                    question_format: "SINGLE_CHOICE",
                    question_text: "Berapa 2 + 2?",
                    options: [
                        { option_label: "A", option_text: "4", is_correct: true },
                        { option_label: "B", option_text: "5", is_correct: false },
                    ],
                },
            });

            const res = await createQuestion(req);
            const { status } = await parseApiResponse(res);

            expect(status).toBe(400); // Bad Request validation error
        });
    });

    describe("PATCH /api/v1/admin/questions/:questionId", () => {
        it("harus berhasil mengedit butir soal", async () => {
            setMockSessionUser(defaultMockCurriculum);
            const req = createTestRequest("/api/v1/admin/questions/1", {
                method: "PATCH",
                body: {
                    question_text: "Berapa hasil dari 5 + 5?",
                },
            });

            vi.spyOn(adminController["service"], "updateQuestion").mockResolvedValueOnce({
                id: 1,
                subject_id: 1,
                sub_material_id: 1,
                cognitive_level_id: 1,
                bank_type: "LEVEL_EXERCISE",
                question_format: "SINGLE_CHOICE",
                question_text: "Berapa hasil dari 5 + 5?",
                is_active: true,
                created_at: new Date().toISOString(),
                stimulus_id: null,
                stimulus_image_url: null,
                options: [],
                explanation: { explanation_text: "10" },
            });

            const res = await updateQuestion(req, { params: Promise.resolve({ questionId: "1" }) });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.question_text).toBe("Berapa hasil dari 5 + 5?");
        });
    });

    describe("GET /api/v1/admin/simulation-packages", () => {
        it("harus mengembalikan daftar paket simulasi dan paginasi", async () => {
            setMockSessionUser(defaultMockCurriculum);
            const req = createTestRequest("/api/v1/admin/simulation-packages?page=1&limit=10");
            vi.spyOn(adminController["service"], "listSimulationPackages").mockResolvedValueOnce({
                data: [
                    {
                        id: 1,
                        subject_id: 1,
                        title: "Simulasi Mandiri Paket A",
                        package_code: "SIM-MAT-01",
                        duration_minutes: 75,
                        total_questions: 30,
                        passing_score: 75,
                        xp_reward: 100,
                        status: "ACTIVE",
                        is_active: true,
                        created_at: new Date().toISOString(),
                    },
                ],
                pagination: {
                    page: 1,
                    limit: 10,
                    total_items: 1,
                    total_pages: 1,
                },
            });

            const res = await listPackages(req);
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.data).toHaveLength(1);
            expect(body.pagination.total_items).toBe(1);
        });
    });

    describe("GET /api/v1/admin/simulation-packages/:packageId", () => {
        it("harus mengembalikan detail paket simulasi", async () => {
            setMockSessionUser(defaultMockCurriculum);
            const req = createTestRequest("/api/v1/admin/simulation-packages/1");
            vi.spyOn(adminController["service"], "getSimulationPackage").mockResolvedValueOnce({
                id: 1,
                subject_id: 1,
                title: "Simulasi Mandiri Paket A",
                package_code: "SIM-MAT-01",
                duration_minutes: 75,
                total_questions: 30,
                passing_score: 90,
                xp_reward: 500,
                status: "ACTIVE",
                is_active: true,
                created_at: new Date().toISOString(),
                questions: [],
            });

            const res = await getPackage(req, { params: Promise.resolve({ packageId: "1" }) });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.id).toBe(1);
            expect(body.package_code).toBe("SIM-MAT-01");
        });
    });

    describe("PATCH /api/v1/admin/simulation-packages/:packageId/status", () => {
        it("harus berhasil mengubah status publikasi paket simulasi", async () => {
            setMockSessionUser(defaultMockCurriculum);
            const req = createTestRequest("/api/v1/admin/simulation-packages/1/status", {
                method: "PATCH",
                body: {
                    status: "ACTIVE",
                },
            });

            vi.spyOn(adminController["service"], "updateSimulationPackageStatus").mockResolvedValueOnce({
                id: 1,
                subject_id: 1,
                title: "Simulasi Mandiri Paket A",
                package_code: "SIM-MAT-01",
                duration_minutes: 75,
                total_questions: 30,
                passing_score: 90,
                xp_reward: 500,
                status: "ACTIVE",
                is_active: true,
                created_at: new Date().toISOString(),
                questions: [],
            });

            const res = await updatePackageStatus(req, { params: Promise.resolve({ packageId: "1" }) });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.status).toBe("ACTIVE");
        });
    });

    describe("POST /api/v1/admin/question-images", () => {
        it("harus menolak unggah gambar jika request bukan multipart/form-data", async () => {
            setMockSessionUser(defaultMockCurriculum);
            const req = createTestRequest("/api/v1/admin/question-images", {
                method: "POST",
                body: { notAFile: true },
            });

            const res = await uploadQuestionImage(req);
            const { status } = await parseApiResponse(res);

            expect(status).toBe(400);
        });
    });
});

