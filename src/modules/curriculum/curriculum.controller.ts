import { CurriculumService } from "./curriculum.service";
import { subjectParamSchema, subMaterialParamSchema } from "./curriculum.schema";
import { validateParams } from "@/shared/utils/validator";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { requireAuth } from "../auth/auth.guard";

export class CurriculumController {
    constructor(private readonly service = new CurriculumService()) {}

    async listSubjects() {
        try {
            const data = await this.service.listSubjects();
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async getCurriculum(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { subjectId } = validateParams(params, subjectParamSchema);
            const data = await this.service.getSubjectCurriculum(subjectId, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async getSubMaterialProgress(params: unknown) {
        try {
            const { user } = await requireAuth();
            const { submaterialId } = validateParams(params, subMaterialParamSchema);
            const data = await this.service.getSubMaterialProgress(submaterialId, user.id);
            return jsonResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }
}

export const curriculumController = new CurriculumController();

