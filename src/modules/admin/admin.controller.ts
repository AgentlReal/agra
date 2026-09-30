import { AdminService } from "./admin.service";
import {
    adminProfileUpdateSchema,
    questionFilterQuerySchema,
    createQuestionSchema,
    questionIdParamSchema,
    toggleQuestionStatusSchema,
    createSimulationPackageSchema,
    packageIdParamSchema,
    paginationQuerySchema,
} from "./admin.schema";
import { validateBody, validateParams, validateQuery } from "@/shared/utils/validator";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { requireRole } from "../auth/auth.guard";

export class AdminController {
    constructor(private readonly service = new AdminService()) {}

    async getProfile() {
        try {
            const { user } = await requireRole("TIM_KURIKULUM");
            const data = await this.service.getProfile(user.id);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async updateProfile(req: Request) {
        try {
            const { user } = await requireRole("TIM_KURIKULUM");
            const dto = await validateBody(req, adminProfileUpdateSchema, { style: "status" });
            const data = await this.service.updateProfile(user.id, dto.name);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getQuestionStock() {
        try {
            await requireRole("TIM_KURIKULUM");
            const data = await this.service.getQuestionStock();
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async listQuestions(req: Request) {
        try {
            await requireRole("TIM_KURIKULUM");
            const filter = validateQuery(req, questionFilterQuerySchema);
            const data = await this.service.listQuestions(filter);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async createQuestion(req: Request) {
        try {
            await requireRole("TIM_KURIKULUM");
            const dto = await validateBody(req, createQuestionSchema, { style: "status" });
            const data = await this.service.createQuestion(dto);
            return jsonResponse(data, 201);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getQuestionDetail(params: unknown) {
        try {
            await requireRole("TIM_KURIKULUM");
            const { questionId } = validateParams(params, questionIdParamSchema);
            const data = await this.service.getQuestionDetail(questionId);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async toggleQuestionStatus(req: Request, params: unknown) {
        try {
            await requireRole("TIM_KURIKULUM");
            const { questionId } = validateParams(params, questionIdParamSchema);
            const dto = await validateBody(req, toggleQuestionStatusSchema, { style: "status" });
            const data = await this.service.toggleQuestionStatus(questionId, dto.is_active);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async listSimulationPackages(req: Request) {
        try {
            await requireRole("TIM_KURIKULUM");
            const { page, limit } = validateQuery(req, paginationQuerySchema);
            const data = await this.service.listSimulationPackages(page, limit);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async createSimulationPackage(req: Request) {
        try {
            await requireRole("TIM_KURIKULUM");
            const dto = await validateBody(req, createSimulationPackageSchema, { style: "status" });
            const data = await this.service.createSimulationPackage(dto);
            return jsonResponse(data, 201);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getSimulationPackageStats(params: unknown) {
        try {
            await requireRole("TIM_KURIKULUM");
            const { packageId } = validateParams(params, packageIdParamSchema);
            const data = await this.service.getSimulationPackageStats(packageId);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }
}

export const adminController = new AdminController();
