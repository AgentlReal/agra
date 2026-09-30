import { describe, it, expect, vi } from "vitest";
import { GET as getRecallStatus } from "./status/route";
import { POST as startRecallAttempt } from "./attempts/route";
import { GET as getRecallAttempt } from "./attempts/[attemptId]/route";
import { PUT as saveAnswer } from "./attempts/[attemptId]/answers/[questionId]/route";
import { POST as submitAttempt } from "./attempts/[attemptId]/submit/route";
import { recallController } from "@/modules/recall/recall.controller";
import { createTestRequest, parseApiResponse, clearMockSession } from "@/shared/testing/test-utils";

describe("Recall Kemampuanmu API Endpoints", () => {
    describe("GET /api/v1/recall/status", () => {
        it("harus mengembalikan 401 Unauthorized jika tidak ada sesi", async () => {
            clearMockSession();
            const res = await getRecallStatus();
            const { status } = await parseApiResponse(res);

            expect(status).toBe(401);
        });

        it("harus mengembalikan status kelulusan Recall", async () => {
            vi.spyOn(recallController["service"], "getRecallStatus").mockResolvedValueOnce({
                isPassed: false,
                lastAttemptId: 10,
            });

            const res = await getRecallStatus();
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.isPassed).toBe(false);
            expect(body.lastAttemptId).toBe(10);
        });
    });

    describe("POST /api/v1/recall/attempts", () => {
        it("harus mengembalikan 201 Created saat sesi baru dimulai", async () => {
            vi.spyOn(recallController["service"], "startRecallAttempt").mockResolvedValueOnce({
                attemptId: 101,
                subjectId: null,
                totalQuestions: 30,
            });

            const res = await startRecallAttempt();
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(201);
            expect(body.attemptId).toBe(101);
            expect(body.totalQuestions).toBe(30);
        });
    });

    describe("PUT /api/v1/recall/attempts/:attemptId/answers/:questionId", () => {
        it("harus berhasil menyimpan jawaban (autosave)", async () => {
            vi.spyOn(recallController["service"], "saveAnswer").mockResolvedValueOnce({
                attemptId: 101,
                questionId: 1,
                selectedOptionIds: [5],
                isSkipped: false,
                answeredAt: new Date().toISOString(),
                answeredCount: 1,
                currentQuestionOrder: 2,
            });

            const req = createTestRequest("/api/v1/recall/attempts/101/answers/1", {
                method: "PUT",
                body: {
                    selectedOptionIds: [5],
                    isSkipped: false,
                    timeSpentSeconds: 20,
                    currentQuestionOrder: 2,
                },
            });

            const res = await saveAnswer(req, {
                params: Promise.resolve({ attemptId: "101", questionId: "1" }),
            });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.answeredCount).toBe(1);
        });
    });

    describe("POST /api/v1/recall/attempts/:attemptId/submit", () => {
        it("harus mengevaluasi sesi dan mengembalikan hasil kelulusan", async () => {
            vi.spyOn(recallController["service"], "submitAttempt").mockResolvedValueOnce({
                totalCorrect: 25,
                isPassed: true,
                xpEarned: 0,
                subjectResults: [
                    { subjectId: 1, correctAnswers: 13, totalQuestions: 15 },
                    { subjectId: 2, correctAnswers: 12, totalQuestions: 15 },
                ],
            });

            const req = createTestRequest("/api/v1/recall/attempts/101/submit", { method: "POST" });
            const res = await submitAttempt(req, {
                params: Promise.resolve({ attemptId: "101" }),
            });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.isPassed).toBe(true);
            expect(body.totalCorrect).toBe(25);
        });
    });
});
