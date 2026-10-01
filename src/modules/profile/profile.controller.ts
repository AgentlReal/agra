import { ProfileService } from "./profile.service";
import {
    completeProfileSchema,
    updateProfileNameSchema,
    updateAvatarSchema,
    xpPaginationSchema,
} from "./profile.schema";
import { validateBody, validateQuery } from "@/shared/utils/validator";
import { successResponse, jsonResponse, errorResponse } from "@/shared/utils/response";
import { requireAuth } from "../auth/auth.guard";

export class ProfileController {
    constructor(private readonly service = new ProfileService()) {}

    async getProfile() {
        try {
            const { user } = await requireAuth();
            const data = await this.service.getProfile(user.id);
            return successResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async completeProfile(req: Request) {
        try {
            const { user } = await requireAuth();
            const dto = await validateBody(req, completeProfileSchema, {
                defaultCode: "VALIDATION_ERROR",
                statusCode: 400,
            });
            const data = await this.service.completeProfile(user.id, dto);
            return successResponse(data, 201);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async updateProfile(req: Request) {
        try {
            const { user } = await requireAuth();
            const dto = await validateBody(req, updateProfileNameSchema, {
                defaultCode: "VALIDATION_ERROR",
                statusCode: 422,
            });
            const data = await this.service.updateProfileName(user.id, dto);
            return successResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async getAvatars() {
        try {
            const { user } = await requireAuth();
            const data = await this.service.getAvatars(user.id);
            return successResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async updateAvatar(req: Request) {
        try {
            const { user } = await requireAuth();
            const dto = await validateBody(req, updateAvatarSchema, {
                defaultCode: "INVALID_AVATAR_ID",
                statusCode: 400,
            });
            const data = await this.service.changeAvatar(user.id, dto.avatarId);
            return jsonResponse({
                success: true,
                message: "Avatar berhasil diperbarui.",
                data,
            });
        } catch (error) {
            return errorResponse(error);
        }
    }

    async getXpTransactions(req: Request) {
        try {
            const { user } = await requireAuth();
            const pagination = validateQuery(req, xpPaginationSchema);
            const result = await this.service.getXpTransactions(user.id, pagination.page, pagination.limit);
            return successResponse(result);
        } catch (error) {
            return errorResponse(error);
        }
    }

    async getDashboard() {
        try {
            const { user } = await requireAuth();
            const data = await this.service.getDashboard(user.id);
            return successResponse(data);
        } catch (error) {
            return errorResponse(error);
        }
    }
}

export const profileController = new ProfileController();
