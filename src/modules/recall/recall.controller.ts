import { RecallService } from "./recall.service";
import {
    saveRecallAnswerSchema,
    recallAttemptParamSchema,
    recallAnswerParamSchema,
} from "./recall.schema";
import { validateBody, validateParams } from "@/shared/utils/validator";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { requireAuth } from "../auth/auth.guard";

export class RecallController {
    constructor(private readonly service = new RecallService()) {}

    async getStatus() {
        try {
            const { user } = await requireAuth();
            const data = await this.service.getRecallStatus(user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async startAttempt() {
        try {
            const { user } = await requireAuth();
            const data = await this.service.startRecallAttempt(user.id);
            return jsonResponse(data, 201);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async getAttempt(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attemptId } = validateParams(params, recallAttemptParamSchema);
            const data = await this.service.getRecallAttempt(attemptId, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async saveAnswer(req: Request, params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attemptId, questionId } = validateParams(params, recallAnswerParamSchema);
            const dto = await validateBody(req, saveRecallAnswerSchema);
            const data = await this.service.saveAnswer(attemptId, questionId, user.id, dto);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async submitAttempt(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attemptId } = validateParams(params, recallAttemptParamSchema);
            const data = await this.service.submitAttempt(attemptId, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async getResult(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attemptId } = validateParams(params, recallAttemptParamSchema);
            const data = await this.service.getResult(attemptId, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async getReview(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { attemptId } = validateParams(params, recallAttemptParamSchema);
            const data = await this.service.getReview(attemptId, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }
}

export const recallController = new RecallController();

