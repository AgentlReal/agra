import { AdminService } from "./admin.service";
import {
    adminProfileUpdateSchema,
    questionFilterQuerySchema,
    createQuestionSchema,
    updateQuestionSchema,
    questionIdParamSchema,
    toggleQuestionStatusSchema,
    createSimulationPackageSchema,
    updateSimulationPackageSchema,
    updateSimulationPackageStatusSchema,
    packageIdParamSchema,
    paginationQuerySchema,
    simulationPackageFilterQuerySchema,
} from "./admin.schema";
import { validateBody, validateParams, validateQuery } from "@/shared/utils/validator";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { requireRole } from "../auth/auth.guard";
import { BadRequestError } from "@/shared/errors/app-error";
import { detectImageExtension } from "@/shared/utils/image-validator";
import { uploadToR2 } from "@/lib/r2-client";

export class AdminController {
    constructor(private readonly service = new AdminService()) {}

    async getProfile() {
        try {
            const { user } = await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const data = await this.service.getProfile(user.id);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async updateProfile(req: Request) {
        try {
            const { user } = await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const dto = await validateBody(req, adminProfileUpdateSchema, { style: "status" });
            const data = await this.service.updateProfile(user.id, dto.name, dto.email);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getQuestionStock() {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const data = await this.service.getQuestionStock();
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async listQuestions(req: Request) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const filter = validateQuery(req, questionFilterQuerySchema);
            const data = await this.service.listQuestions(filter);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async createQuestion(req: Request) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const dto = await validateBody(req, createQuestionSchema, { style: "status" });
            const data = await this.service.createQuestion(dto);
            return jsonResponse(data, 201);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getQuestionDetail(params: unknown) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const { questionId } = validateParams(params, questionIdParamSchema);
            const data = await this.service.getQuestionDetail(questionId);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async updateQuestion(req: Request, params: unknown) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const { questionId } = validateParams(params, questionIdParamSchema);
            const dto = await validateBody(req, updateQuestionSchema, { style: "status" });
            const data = await this.service.updateQuestion(questionId, dto);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async toggleQuestionStatus(req: Request, params: unknown) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const { questionId } = validateParams(params, questionIdParamSchema);
            const dto = await validateBody(req, toggleQuestionStatusSchema, { style: "status" });
            const data = await this.service.toggleQuestionStatus(questionId, dto.is_active, dto.revision_notes);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async deleteQuestion(params: unknown) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const { questionId } = validateParams(params, questionIdParamSchema);
            await this.service.deleteQuestion(questionId);
            return jsonResponse({ message: "Soal berhasil dihapus." }, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async uploadQuestionImage(req: Request) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const contentType = req.headers.get("content-type") || "";
            if (!contentType.includes("multipart/form-data")) {
                throw new BadRequestError("Content-Type harus berupa multipart/form-data", "INVALID_CONTENT_TYPE");
            }

            const formData = await req.formData();
            const file = (formData.get("image") || formData.get("file")) as File | null;

            if (!file || typeof file === "string") {
                throw new BadRequestError("Berkas gambar tidak ditemukan pada form-data (field: image)", "IMAGE_REQUIRED");
            }

            const maxSize = 1 * 1024 * 1024; // 1MB
            if (file.size > maxSize) {
                throw new BadRequestError("Ukuran gambar melebihi batas maksimal 1MB", "FILE_TOO_LARGE");
            }

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Ekstensi ditentukan dari isi berkas (magic bytes), bukan dari nama berkas / header MIME klien.
            const detectedExt = detectImageExtension(buffer);
            if (!detectedExt) {
                throw new BadRequestError(
                    "Format berkas tidak valid. Hanya gambar JPEG, PNG, WebP, atau GIF yang diizinkan (SVG tidak didukung).",
                    "INVALID_FILE_TYPE"
                );
            }

            const uniqueName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${detectedExt}`;
            const fileUrl = await uploadToR2(buffer, uniqueName, detectedExt);
            return jsonResponse(
                {
                    image_url: fileUrl,
                    imageUrl: fileUrl,
                    url: fileUrl,
                },
                201
            );
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async listSimulationPackages(req: Request) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const { page, limit, subject_id } = validateQuery(req, simulationPackageFilterQuerySchema);
            const data = await this.service.listSimulationPackages(page, limit, subject_id);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async createSimulationPackage(req: Request) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const dto = await validateBody(req, createSimulationPackageSchema, { style: "status" });
            const data = await this.service.createSimulationPackage(dto);
            return jsonResponse(data, 201);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getSimulationPackage(params: unknown) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const { packageId } = validateParams(params, packageIdParamSchema);
            const data = await this.service.getSimulationPackage(packageId);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async updateSimulationPackage(req: Request, params: unknown) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const { packageId } = validateParams(params, packageIdParamSchema);
            const dto = await validateBody(req, updateSimulationPackageSchema, { style: "status" });
            const data = await this.service.updateSimulationPackage(packageId, dto);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async updateSimulationPackageStatus(req: Request, params: unknown) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const { packageId } = validateParams(params, packageIdParamSchema);
            const dto = await validateBody(req, updateSimulationPackageStatusSchema, { style: "status" });
            const data = await this.service.updateSimulationPackageStatus(packageId, dto.status, dto.is_active);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async getSimulationPackageStats(params: unknown) {
        try {
            await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
            const { packageId } = validateParams(params, packageIdParamSchema);
            const data = await this.service.getSimulationPackageStats(packageId);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }
}

export const adminController = new AdminController();

