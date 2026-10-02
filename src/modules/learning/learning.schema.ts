import { z } from "zod";
import { positiveInteger, nonNegativeInteger, booleanField } from "@/shared/utils/validator";

export const startLevelAttemptParamSchema = z
    .object({
        level_id: z.coerce.number().int().min(1, "Level kognitif minimal 1").max(3, "Level kognitif harus bernilai 1 (Pemahaman), 2 (Pengaplikasian), atau 3 (Penalaran)").optional(),
        levelId: z.coerce.number().int().min(1, "Level kognitif minimal 1").max(3, "Level kognitif harus bernilai 1 (Pemahaman), 2 (Pengaplikasian), atau 3 (Penalaran)").optional(),
    })
    .refine((d) => d.level_id !== undefined || d.levelId !== undefined, {
        message: "level_id wajib diisi (1, 2, atau 3)",
    })
    .transform((d) => ({
        level_id: (d.level_id ?? d.levelId)!,
    }));

export type StartLevelAttemptParamInput = z.infer<typeof startLevelAttemptParamSchema>;

export const startLevelAttemptBodySchema = z
    .object({
        sub_material_id: positiveInteger("sub_material_id").optional(),
        subMaterialId: positiveInteger("subMaterialId").optional(),
    })
    .refine((d) => d.sub_material_id !== undefined || d.subMaterialId !== undefined, {
        message: "sub_material_id wajib diisi dan berupa angka positif",
        path: ["sub_material_id"],
    })
    .transform((d) => ({
        sub_material_id: (d.sub_material_id ?? d.subMaterialId)!,
    }));

export type StartLevelAttemptBodyInput = z.infer<typeof startLevelAttemptBodySchema>;

export const learningAttemptParamSchema = z
    .object({
        attempt_id: positiveInteger("attempt_id").optional(),
        attemptId: positiveInteger("attemptId").optional(),
    })
    .refine((d) => d.attempt_id !== undefined || d.attemptId !== undefined, {
        message: "ID percobaan latihan harus berupa angka positif",
    })
    .transform((d) => ({
        attempt_id: (d.attempt_id ?? d.attemptId)!,
    }));

export type LearningAttemptParamInput = z.infer<typeof learningAttemptParamSchema>;

export const learningAnswerParamSchema = z
    .object({
        attempt_id: positiveInteger("attempt_id").optional(),
        attemptId: positiveInteger("attemptId").optional(),
        session_question_id: positiveInteger("session_question_id").optional(),
        sessionQuestionId: positiveInteger("sessionQuestionId").optional(),
    })
    .refine(
        (d) =>
            (d.attempt_id !== undefined || d.attemptId !== undefined) &&
            (d.session_question_id !== undefined || d.sessionQuestionId !== undefined),
        {
            message: "ID percobaan latihan dan ID butir soal harus berupa angka positif",
        }
    )
    .transform((d) => ({
        attempt_id: (d.attempt_id ?? d.attemptId)!,
        session_question_id: (d.session_question_id ?? d.sessionQuestionId)!,
    }));

export type LearningAnswerParamInput = z.infer<typeof learningAnswerParamSchema>;

export const saveLearningAnswerSchema = z
    .object({
        selected_option_ids: z.array(positiveInteger("Option ID")).optional(),
        selectedOptionIds: z.array(positiveInteger("Option ID")).optional(),
        is_skipped: booleanField("is_skipped").optional(),
        isSkipped: booleanField("isSkipped").optional(),
        time_spent_seconds: nonNegativeInteger("time_spent_seconds").optional(),
        timeSpentSeconds: nonNegativeInteger("timeSpentSeconds").optional(),
        current_question_order: z.coerce.number().int().min(1, "Nomor urut soal minimal 1").max(10, "Nomor urut soal latihan maksimal 10").optional(),
        currentQuestionOrder: z.coerce.number().int().min(1, "Nomor urut soal minimal 1").max(10, "Nomor urut soal latihan maksimal 10").optional(),
    })
    .refine(
        (data) => {
            const ids = data.selected_option_ids ?? data.selectedOptionIds ?? [];
            return ids.length <= 2;
        },
        {
            message: "Batas maksimal jawaban yang dipilih adalah 2 butir opsi",
            path: ["selected_option_ids"],
        }
    )
    .transform((data) => ({
        selected_option_ids: data.selected_option_ids ?? data.selectedOptionIds ?? [],
        is_skipped: data.is_skipped ?? data.isSkipped ?? false,
        time_spent_seconds: data.time_spent_seconds ?? data.timeSpentSeconds ?? 0,
        current_question_order: data.current_question_order ?? data.currentQuestionOrder,
    }));

export type SaveLearningAnswerInput = z.infer<typeof saveLearningAnswerSchema>;
