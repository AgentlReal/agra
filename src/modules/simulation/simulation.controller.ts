import { SimulationService } from "./simulation.service";
import {
    simulationSubjectParamSchema,
    simulationAttemptParamSchema,
    simulationAnswerParamSchema,
    saveSimulationAnswerSchema,
} from "./simulation.schema";
import { validateBody, validateParams } from "@/shared/utils/validator";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { requireRole } from "../auth/auth.guard";

export class SimulationController {
    constructor(private readonly service = new SimulationService()) {}

    async getEligibility(params: unknown) {
        try {
            const { user } = await requireRole("SISWA");
            const { subject_id } = validateParams(params, simulationSubjectParamSchema);
            const data = await this.service.checkEligibility(subject_id, user.id);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async startAttempt(params: unknown) {
        try {
            const { user } = await requireRole("SISWA");
            const { subject_id } = validateParams(params, simulationSubjectParamSchema);
            const data = await this.service.startAttempt(subject_id, user.id);
            return jsonResponse(data, 201);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getAttempt(params: unknown) {
        try {
            const { user } = await requireRole("SISWA");
            const { attempt_id } = validateParams(params, simulationAttemptParamSchema);
            const data = await this.service.getAttemptState(attempt_id, user.id);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async saveAnswer(req: Request, params: unknown) {
        try {
            const { user } = await requireRole("SISWA");
            const { attempt_id, session_question_id } = validateParams(params, simulationAnswerParamSchema);
            const dto = await validateBody(req, saveSimulationAnswerSchema, { style: "status" });
            const data = await this.service.saveAnswer(attempt_id, session_question_id, user.id, dto);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async submitAttempt(params: unknown) {
        try {
            const { user } = await requireRole("SISWA");
            const { attempt_id } = validateParams(params, simulationAttemptParamSchema);
            const data = await this.service.submitAttempt(attempt_id, user.id);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getResult(params: unknown) {
        try {
            const { user } = await requireRole("SISWA");
            const { attempt_id } = validateParams(params, simulationAttemptParamSchema);
            const data = await this.service.getResult(attempt_id, user.id);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getReview(params: unknown) {
        try {
            const { user } = await requireRole("SISWA");
            const { attempt_id } = validateParams(params, simulationAttemptParamSchema);
            const data = await this.service.getReview(attempt_id, user.id);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }
}

export const simulationController = new SimulationController();
