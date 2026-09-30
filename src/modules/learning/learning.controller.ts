import { LearningService } from "./learning.service";
import {
    startLevelAttemptParamSchema,
    startLevelAttemptBodySchema,
    learningAttemptParamSchema,
    learningAnswerParamSchema,
    saveLearningAnswerSchema,
} from "./learning.schema";
import { validateBody, validateParams } from "@/shared/utils/validator";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { requireAuth } from "../auth/auth.guard";

export class LearningController {
    constructor(private readonly service = new LearningService()) {}

    async startAttempt(req: Request, params: unknown) {
        try {
            const { user } = await requireAuth();
            const { level_id } = validateParams(params, startLevelAttemptParamSchema);
            const body = await validateBody(req, startLevelAttemptBodySchema, { style: "status" });
            const { session, isResume } = await this.service.startAttempt(
                user.id,
                level_id,
                body.sub_material_id
            );
            return jsonResponse(session, isResume ? 200 : 201);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getAttempt(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attempt_id } = validateParams(params, learningAttemptParamSchema);
            const data = await this.service.getAttempt(attempt_id, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async saveAnswer(req: Request, params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attempt_id, session_question_id } = validateParams(params, learningAnswerParamSchema);
            const dto = await validateBody(req, saveLearningAnswerSchema, { style: "status" });
            const data = await this.service.saveAnswer(attempt_id, session_question_id, user.id, dto);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async submitAttempt(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attempt_id } = validateParams(params, learningAttemptParamSchema);
            const data = await this.service.submitAttempt(attempt_id, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getResult(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attempt_id } = validateParams(params, learningAttemptParamSchema);
            const data = await this.service.getResult(attempt_id, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getReview(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attempt_id } = validateParams(params, learningAttemptParamSchema);
            const data = await this.service.getReview(attempt_id, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }
}

export const learningController = new LearningController();
