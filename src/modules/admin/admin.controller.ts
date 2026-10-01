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
} from "./admin.schema";
import { validateBody, validateParams, validateQuery } from "@/shared/utils/validator";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { requireRole } from "../auth/auth.guard";
import { BadRequestError } from "@/shared/errors/app-error";
import fs from "fs";
import path from "path";

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

    async updateQuestion(req: Request, params: unknown) {
        try {
            await requireRole("TIM_KURIKULUM");
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
            await requireRole("TIM_KURIKULUM");
            const { questionId } = validateParams(params, questionIdParamSchema);
            const dto = await validateBody(req, toggleQuestionStatusSchema, { style: "status" });
            const data = await this.service.toggleQuestionStatus(questionId, dto.is_active);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async uploadQuestionImage(req: Request) {
        try {
            await requireRole("TIM_KURIKULUM");
            const contentType = req.headers.get("content-type") || "";
            if (!contentType.includes("multipart/form-data")) {
                throw new BadRequestError("Content-Type harus berupa multipart/form-data", "INVALID_CONTENT_TYPE");
            }

            const formData = await req.formData();
            const file = (formData.get("image") || formData.get("file")) as File | null;

            if (!file || typeof file === "string") {
                throw new BadRequestError("Berkas gambar tidak ditemukan pada form-data (field: image)", "IMAGE_REQUIRED");
            }

            const allowedMimeTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
                "image/gif",
                "image/svg+xml",
            ];
            if (file.type && !allowedMimeTypes.includes(file.type.toLowerCase()) && !file.type.startsWith("image/")) {
                throw new BadRequestError("Format berkas harus berupa gambar (JPEG, PNG, WebP, GIF, SVG)", "INVALID_FILE_TYPE");
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new BadRequestError("Ukuran gambar melebihi batas maksimal 5MB", "FILE_TOO_LARGE");
            }

            let ext = "png";
            if (file.name && file.name.includes(".")) {
                ext = file.name.split(".").pop()?.toLowerCase() || "png";
            } else if (file.type) {
                const parts = file.type.split("/");
                ext = parts[1] === "jpeg" ? "jpg" : parts[1] || "png";
            }

            const safeExt = ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "png";
            const uniqueName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${safeExt}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads");

            await fs.promises.mkdir(uploadDir, { recursive: true });
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await fs.promises.writeFile(path.join(uploadDir, uniqueName), buffer);

            const fileUrl = `/uploads/${uniqueName}`;
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

    async getSimulationPackage(params: unknown) {
        try {
            await requireRole("TIM_KURIKULUM");
            const { packageId } = validateParams(params, packageIdParamSchema);
            const data = await this.service.getSimulationPackage(packageId);
            return jsonResponse(data, 200);
        } catch (error) {
            return errorResponse(error, "status");
        }
    }

    async updateSimulationPackage(req: Request, params: unknown) {
        try {
            await requireRole("TIM_KURIKULUM");
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
            await requireRole("TIM_KURIKULUM");
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

