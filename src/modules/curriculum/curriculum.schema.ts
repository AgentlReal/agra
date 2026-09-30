import { z } from "zod";
import { positiveInteger } from "@/shared/utils/validator";

export const subjectParamSchema = z.object({
    subjectId: positiveInteger("ID Mata Pelajaran"),
});

export type SubjectParamInput = z.infer<typeof subjectParamSchema>;

export const subMaterialParamSchema = z
    .object({
        submaterialId: positiveInteger("ID Submateri").optional(),
        id: positiveInteger("ID Submateri").optional(),
    })
    .refine((data) => data.submaterialId !== undefined || data.id !== undefined, {
        message: "ID Submateri wajib diisi dan berupa angka positif",
    })
    .transform((data) => ({
        submaterialId: (data.submaterialId ?? data.id)!,
    }));

export type SubMaterialParamInput = z.infer<typeof subMaterialParamSchema>;
