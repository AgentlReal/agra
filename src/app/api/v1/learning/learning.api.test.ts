import { describe, it, expect, vi } from "vitest";
import { POST as startAttempt } from "./levels/[level_id]/attempts/route";
import { GET as getAttempt } from "./attempts/[attempt_id]/route";
import { PUT as saveAnswer } from "./attempts/[attempt_id]/answers/[session_question_id]/route";
import { POST as submitAttempt } from "./attempts/[attempt_id]/submit/route";
import { learningController } from "@/modules/learning/learning.controller";
import { createTestRequest, parseApiResponse } from "@/shared/testing/test-utils";

describe("Latihan Level Kognitif API Endpoints", () => {
    describe("POST /api/v1/learning/levels/:level_id/attempts", () => {
        it("harus memulai sesi baru level kognitif dengan 201 Created", async () => {
            vi.spyOn(learningController["service"], "startAttempt").mockResolvedValueOnce({
                session: {
                    attempt_id: 201,
                    sub_material_id: 1,
                    sub_material_title: "Bilangan Bulat",
                    cognitive_level_id: 1,
                    level_number: 1,
                    level_name: "Pemahaman",
                    attempt_number: 1,
                    is_remedial: false,
                    status: "IN_PROGRESS",
                    total_questions: 10,
                    answered_count: 0,
                    current_question_order: 1,
                    questions: [],
                },
                isResume: false,
            });

            const req = createTestRequest("/api/v1/learning/levels/1/attempts", {
                method: "POST",
                body: { sub_material_id: 1 },
            });

            const res = await startAttempt(req, {
                params: Promise.resolve({ level_id: "1" }),
            });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(201);
            expect(body.attempt_id).toBe(201);
            expect(body.level_number).toBe(1);
        });

        it("harus mengembalikan 200 OK jika me-resume sesi yang masih aktif", async () => {
            vi.spyOn(learningController["service"], "startAttempt").mockResolvedValueOnce({
                session: {
                    attempt_id: 201,
                    sub_material_id: 1,
                    sub_material_title: "Bilangan Bulat",
                    cognitive_level_id: 1,
                    level_number: 1,
                    level_name: "Pemahaman",
                    attempt_number: 1,
                    is_remedial: false,
                    status: "IN_PROGRESS",
                    total_questions: 10,
                    answered_count: 5,
                    current_question_order: 6,
                    questions: [],
                },
                isResume: true,
            });

            const req = createTestRequest("/api/v1/learning/levels/1/attempts", {
                method: "POST",
                body: { sub_material_id: 1 },
            });

            const res = await startAttempt(req, {
                params: Promise.resolve({ level_id: "1" }),
            });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.attempt_id).toBe(201);
        });
    });

    describe("POST /api/v1/learning/attempts/:attempt_id/submit", () => {
        it("harus mengevaluasi jawaban, memberikan XP, dan membuka aksi selanjutnya", async () => {
            vi.spyOn(learningController["service"], "submitAttempt").mockResolvedValueOnce({
                attempt_id: 201,
                level_id: 1,
                level_number: 1,
                level_name: "Pemahaman",
                score: 100,
                correct_answers: 10,
                total_questions: 10,
                is_passed: true,
                xp_earned: 50,
                total_xp: 150,
                next_action: "NEXT_LEVEL",
                sub_material_progress: {
                    sub_material_id: 1,
                    level_1_status: "COMPLETED",
                    level_2_status: "AVAILABLE",
                    level_3_status: "LOCKED",
                    level_1_score: 100,
                    level_2_score: null,
                    level_3_score: null,
                    total_cumulative_score: 100,
                    is_mastered: false,
                    mastered_at: null,
                },
            });

            const req = createTestRequest("/api/v1/learning/attempts/201/submit", { method: "POST" });
            const res = await submitAttempt(req, {
                params: Promise.resolve({ attempt_id: "201" }),
            });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.is_passed).toBe(true);
            expect(body.xp_earned).toBe(50);
            expect(body.next_action).toBe("NEXT_LEVEL");
        });
    });
});
