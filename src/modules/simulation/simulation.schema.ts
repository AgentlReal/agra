import { z } from "zod";
import { positiveInteger, nonNegativeInteger, booleanField } from "@/shared/utils/validator";

export const simulationSubjectParamSchema = z
    .object({
        subject_id: positiveInteger("subject_id").optional(),
        subjectId: positiveInteger("subjectId").optional(),
    })
    .refine((d) => d.subject_id !== undefined || d.subjectId !== undefined, {
        message: "ID mata pelajaran harus berupa angka positif",
    })
    .transform((d) => ({
        subject_id: (d.subject_id ?? d.subjectId)!,
    }));

export type SimulationSubjectParamInput = z.infer<typeof simulationSubjectParamSchema>;

export const simulationAttemptParamSchema = z
    .object({
        attempt_id: positiveInteger("attempt_id").optional(),
        attemptId: positiveInteger("attemptId").optional(),
    })
    .refine((d) => d.attempt_id !== undefined || d.attemptId !== undefined, {
        message: "ID percobaan simulasi harus berupa angka positif",
    })
    .transform((d) => ({
        attempt_id: (d.attempt_id ?? d.attemptId)!,
    }));

export type SimulationAttemptParamInput = z.infer<typeof simulationAttemptParamSchema>;

export const simulationAnswerParamSchema = z
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
            message: "ID percobaan simulasi dan ID butir soal harus berupa angka positif",
        }
    )
    .transform((d) => ({
        attempt_id: (d.attempt_id ?? d.attemptId)!,
        session_question_id: (d.session_question_id ?? d.sessionQuestionId)!,
    }));

export type SimulationAnswerParamInput = z.infer<typeof simulationAnswerParamSchema>;

export const saveSimulationAnswerSchema = z
    .object({
        selected_option_ids: z.array(positiveInteger("Option ID")).optional(),
        selectedOptionIds: z.array(positiveInteger("Option ID")).optional(),
        is_doubtful: booleanField("is_doubtful").optional(),
        isFlagged: booleanField("isFlagged").optional(),
        time_spent_seconds: nonNegativeInteger("time_spent_seconds").optional(),
        timeSpentSeconds: nonNegativeInteger("timeSpentSeconds").optional(),
        current_question_order: z.coerce.number().int().min(1, "Nomor urut soal minimal 1").max(30, "Nomor urut soal simulasi maksimal 30").optional(),
        currentQuestionOrder: z.coerce.number().int().min(1, "Nomor urut soal minimal 1").max(30, "Nomor urut soal simulasi maksimal 30").optional(),
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
        is_doubtful: data.is_doubtful ?? data.isFlagged ?? false,
        time_spent_seconds: data.time_spent_seconds ?? data.timeSpentSeconds ?? 0,
        current_question_order: data.current_question_order ?? data.currentQuestionOrder,
    }));

export type SaveSimulationAnswerInput = z.infer<typeof saveSimulationAnswerSchema>;
