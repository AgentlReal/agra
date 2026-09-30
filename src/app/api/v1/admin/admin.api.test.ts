import { describe, it, expect, vi } from "vitest";
import { GET as getAdminProfile, PATCH as updateAdminProfile } from "./profile/route";
import { GET as getQuestionStock } from "./question-banks/stock/route";
import { GET as listQuestions, POST as createQuestion } from "./questions/route";
import { GET as listPackages, POST as createPackage } from "./simulation-packages/route";
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
});
