import { describe, it, expect, vi } from "vitest";
import { GET as getEligibility } from "./[subject_id]/eligibility/route";
import { POST as startAttempt } from "./[subject_id]/attempts/route";
import { GET as getAttempt } from "../simulation-attempts/[attempt_id]/route";
import { PUT as saveAnswer } from "../simulation-attempts/[attempt_id]/answers/[session_question_id]/route";
import { POST as submitAttempt } from "../simulation-attempts/[attempt_id]/submit/route";
import { simulationController } from "@/modules/simulation/simulation.controller";
import {
    createTestRequest,
    parseApiResponse,
    setMockSessionUser,
    defaultMockCurriculum,
    defaultMockStudent,
} from "@/shared/testing/test-utils";

describe("Simulasi TKA API Endpoints", () => {
    describe("GET /api/v1/simulations/:subject_id/eligibility", () => {
        it("harus menolak akses jika peran bukan SISWA (misal TIM_KURIKULUM mencoba akses)", async () => {
            setMockSessionUser(defaultMockCurriculum);
            const req = createTestRequest("/api/v1/simulations/1/eligibility");
            const res = await getEligibility(req, {
                params: Promise.resolve({ subject_id: "1" }),
            });
            const { status } = await parseApiResponse(res);

            expect(status).toBe(403);
        });

        it("harus mengembalikan kelayakan ujian saat diakses oleh SISWA", async () => {
            setMockSessionUser(defaultMockStudent);
            vi.spyOn(simulationController["service"], "checkEligibility").mockResolvedValueOnce({
                subject_id: 1,
                subject_name: "Matematika",
                is_eligible: true,
                total_sub_materials: 10,
                mastered_sub_materials: 10,
                completion_percentage: 100,
                unmastered_sub_materials: [],
            });

            const req = createTestRequest("/api/v1/simulations/1/eligibility");
            const res = await getEligibility(req, {
                params: Promise.resolve({ subject_id: "1" }),
            });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.is_eligible).toBe(true);
            expect(body.completion_percentage).toBe(100);
        });
    });

    describe("POST /api/v1/simulations/:subject_id/attempts", () => {
        it("harus memulai sesi simulasi CBT dengan timer 75 menit (201 Created)", async () => {
            setMockSessionUser(defaultMockStudent);
            vi.spyOn(simulationController["service"], "startAttempt").mockResolvedValueOnce({
                attempt_id: 301,
                package_id: 1,
                package_title: "Simulasi TKA Mandiri Paket A",
                attempt_number: 1,
                total_questions: 30,
                timing: {
                    server_time: new Date().toISOString(),
                    duration_minutes: 75,
                    deadline_at: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
                    remaining_seconds: 4500,
                },
            });

            const req = createTestRequest("/api/v1/simulations/1/attempts", { method: "POST" });
            const res = await startAttempt(req, {
                params: Promise.resolve({ subject_id: "1" }),
            });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(201);
            expect(body.attempt_id).toBe(301);
            expect(body.timing.duration_minutes).toBe(75);
            expect(body.timing.remaining_seconds).toBe(4500);
        });
    });

    describe("PUT /api/v1/simulation-attempts/:attempt_id/answers/:session_question_id", () => {
        it("harus berhasil autosave jawaban simulasi termasuk status ragu-ragu (is_doubtful)", async () => {
            setMockSessionUser(defaultMockStudent);
            vi.spyOn(simulationController["service"], "saveAnswer").mockResolvedValueOnce({
                session_question_id: 1,
                answered_at: new Date().toISOString(),
                is_doubtful: true,
                remaining_seconds: 4200,
                current_question_order: 2,
            });

            const req = createTestRequest("/api/v1/simulation-attempts/301/answers/1", {
                method: "PUT",
                body: {
                    selected_option_ids: [12],
                    is_doubtful: true,
                    time_spent_seconds: 45,
                    current_question_order: 2,
                },
            });

            const res = await saveAnswer(req, {
                params: Promise.resolve({ attempt_id: "301", session_question_id: "1" }),
            });
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.is_doubtful).toBe(true);
            expect(body.remaining_seconds).toBe(4200);
        });
    });
});
