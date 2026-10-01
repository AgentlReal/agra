import { z } from "zod";
import { positiveInteger, requiredString, paginationSchema } from "@/shared/utils/validator";

export const completeProfileSchema = z
    .object({
        presetAvatarId: positiveInteger("presetAvatarId").optional(),
        avatarId: positiveInteger("avatarId").optional(),
    })
    .transform((data) => ({
        presetAvatarId: data.presetAvatarId ?? data.avatarId,
    }));

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

export const updateProfileNameSchema = z.object({
    name: requiredString("Nama tampilan", 3, 30),
});

export type UpdateProfileNameInput = z.infer<typeof updateProfileNameSchema>;

export const updateAvatarSchema = z
    .object({
        avatarId: positiveInteger("avatarId").optional(),
        presetAvatarId: positiveInteger("presetAvatarId").optional(),
    })
    .refine((data) => data.avatarId !== undefined || data.presetAvatarId !== undefined, {
        message: "avatarId wajib diisi dan berupa angka positif.",
        path: ["avatarId"],
    })
    .transform((data) => ({
        avatarId: (data.avatarId ?? data.presetAvatarId)!,
    }));

export type UpdateAvatarInput = z.infer<typeof updateAvatarSchema>;

export const xpPaginationSchema = paginationSchema;

export type XpPaginationInput = z.infer<typeof xpPaginationSchema>;
