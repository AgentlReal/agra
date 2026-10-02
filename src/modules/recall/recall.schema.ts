import { z } from "zod";
import { positiveInteger, nonNegativeInteger, booleanField } from "@/shared/utils/validator";

export const saveRecallAnswerSchema = z
    .object({
        selected_option_ids: z.array(positiveInteger("Option ID")).optional(),
        selectedOptionIds: z.array(positiveInteger("Option ID")).optional(),
        is_skipped: booleanField("is_skipped").optional(),
        isSkipped: booleanField("isSkipped").optional(),
        current_question_order: z.coerce.number().int().min(1, "Nomor urut soal minimal 1").max(30, "Nomor urut soal maksimal 30").optional(),
        currentQuestionOrder: z.coerce.number().int().min(1, "Nomor urut soal minimal 1").max(30, "Nomor urut soal maksimal 30").optional(),
        is_flagged: booleanField("is_flagged").optional(),
        isFlagged: booleanField("isFlagged").optional(),
        time_spent_seconds: nonNegativeInteger("time_spent_seconds").optional(),
        timeSpentSeconds: nonNegativeInteger("timeSpentSeconds").optional(),
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
        selectedOptionIds: data.selected_option_ids ?? data.selectedOptionIds ?? [],
        isSkipped: data.is_skipped ?? data.isSkipped ?? false,
        currentQuestionOrder: data.current_question_order ?? data.currentQuestionOrder,
        isFlagged: data.is_flagged ?? data.isFlagged ?? false,
        timeSpentSeconds: data.time_spent_seconds ?? data.timeSpentSeconds ?? 0,
    }));

export type SaveRecallAnswerInput = z.infer<typeof saveRecallAnswerSchema>;

export const recallAttemptParamSchema = z
    .object({
        attemptId: positiveInteger("attemptId").optional(),
        attempt_id: positiveInteger("attempt_id").optional(),
    })
    .refine((d) => d.attemptId !== undefined || d.attempt_id !== undefined, {
        message: "ID percobaan recall harus berupa angka positif",
    })
    .transform((d) => ({
        attemptId: (d.attemptId ?? d.attempt_id)!,
    }));

export type RecallAttemptParamInput = z.infer<typeof recallAttemptParamSchema>;

export const recallAnswerParamSchema = z
    .object({
        attemptId: positiveInteger("attemptId").optional(),
        attempt_id: positiveInteger("attempt_id").optional(),
        questionId: positiveInteger("questionId").optional(),
        session_question_id: positiveInteger("session_question_id").optional(),
    })
    .refine(
        (d) =>
            (d.attemptId !== undefined || d.attempt_id !== undefined) &&
            (d.questionId !== undefined || d.session_question_id !== undefined),
        {
            message: "ID percobaan recall dan ID butir soal harus berupa angka positif",
        }
    )
    .transform((d) => ({
        attemptId: (d.attemptId ?? d.attempt_id)!,
        questionId: (d.questionId ?? d.session_question_id)!,
    }));

export type RecallAnswerParamInput = z.infer<typeof recallAnswerParamSchema>;
