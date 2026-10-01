import { z } from "zod";
import {
    positiveInteger,
    requiredString,
    paginationSchema,
    booleanField,
} from "@/shared/utils/validator";

export const adminProfileUpdateSchema = z.object({
    name: requiredString("Nama", 3, 30),
});

export type AdminProfileUpdateInput = z.infer<typeof adminProfileUpdateSchema>;

export const questionFilterQuerySchema = z.object({
    bank: z.enum(["RECALL", "LEVEL_EXERCISE", "SIMULATION"], {
        error: "Filter bank harus berupa: RECALL, LEVEL_EXERCISE, atau SIMULATION",
    }).optional(),
    subject: positiveInteger("Filter subject").optional(),
    material: positiveInteger("Filter material").optional(),
    submaterial: positiveInteger("Filter submaterial").optional(),
    level: positiveInteger("Filter level").optional(),
    type: z.enum(["SINGLE_CHOICE", "COMPLEX_CHOICE"], {
        error: "Filter type harus berupa: SINGLE_CHOICE atau COMPLEX_CHOICE",
    }).optional(),
    is_active: z
        .preprocess((val) => {
            if (val === "true" || val === true) return true;
            if (val === "false" || val === false) return false;
            return undefined;
        }, z.boolean().optional())
        .optional(),
    page: z.coerce.number().int().min(1, "Halaman (page) minimal 1").default(1),
    limit: z.coerce.number().int().min(1, "Limit minimal 1").max(100, "Limit maksimal 100").default(20),
});

export type QuestionFilterQueryInput = z.infer<typeof questionFilterQuerySchema>;

export const createQuestionSchema = z
    .object({
        subject_id: positiveInteger("subject_id").optional(),
        subjectId: positiveInteger("subjectId").optional(),
        sub_material_id: positiveInteger("sub_material_id").nullable().optional(),
        subMaterialId: positiveInteger("subMaterialId").nullable().optional(),
        cognitive_level_id: positiveInteger("cognitive_level_id").nullable().optional(),
        cognitiveLevelId: positiveInteger("cognitiveLevelId").nullable().optional(),
        stimulus_id: positiveInteger("stimulus_id").nullable().optional(),
        stimulusId: positiveInteger("stimulusId").nullable().optional(),
        bank_type: z.enum(["RECALL", "LEVEL_EXERCISE", "SIMULATION"], {
            error: "bank_type harus berupa: RECALL, LEVEL_EXERCISE, atau SIMULATION",
        }).optional(),
        bankType: z.enum(["RECALL", "LEVEL_EXERCISE", "SIMULATION"]).optional(),
        question_format: z.enum(["SINGLE_CHOICE", "COMPLEX_CHOICE"], {
            error: "question_format harus berupa: SINGLE_CHOICE atau COMPLEX_CHOICE",
        }).optional(),
        questionFormat: z.enum(["SINGLE_CHOICE", "COMPLEX_CHOICE"]).optional(),
        question_text: z.string().trim().min(5, "Teks soal minimal 5 karakter").optional(),
        questionText: z.string().trim().min(5, "Teks soal minimal 5 karakter").optional(),
        stimulus_image_url: z.string().nullable().optional(),
        stimulusImageUrl: z.string().nullable().optional(),
        options: z
            .array(
                z.object({
                    option_label: z.enum(["A", "B", "C", "D"], {
                        error: "Label opsi harus salah satu dari: A, B, C, D",
                    }).optional(),
                    optionLabel: z.enum(["A", "B", "C", "D"]).optional(),
                    option_text: z.string().trim().min(1, "Teks opsi jawaban tidak boleh kosong").optional(),
                    optionText: z.string().trim().min(1, "Teks opsi jawaban tidak boleh kosong").optional(),
                    is_correct: booleanField("is_correct").optional(),
                    isCorrect: booleanField("isCorrect").optional(),
                })
            )
            .min(4, "Opsi jawaban harus berjumlah 4 (A, B, C, D)")
            .max(4, "Opsi jawaban harus berjumlah 4 (A, B, C, D)"),
        explanation: z.object({
            explanation_text: z.string().trim().min(5, "Pembahasan soal minimal 5 karakter").optional(),
            explanationText: z.string().trim().min(5, "Pembahasan soal minimal 5 karakter").optional(),
            reasoning_guide: z.string().nullable().optional(),
            reasoningGuide: z.string().nullable().optional(),
            reference_url: z.string().nullable().optional(),
            referenceUrl: z.string().nullable().optional(),
        }),
        stimulus: z
            .object({
                title: requiredString("Judul stimulus wacana", 1, 100),
                stimulus_text: z.string().trim().min(1, "Teks wacana tidak boleh kosong").optional(),
                stimulusText: z.string().trim().min(1, "Teks wacana tidak boleh kosong").optional(),
                stimulus_image_url: z.string().nullable().optional(),
                stimulusImageUrl: z.string().nullable().optional(),
            })
            .nullable()
            .optional(),
    })
    .transform((data) => {
        const subject_id = data.subject_id ?? data.subjectId;
        if (!subject_id) throw new Error("subject_id wajib diisi dan berupa angka positif");

        const bank_type = data.bank_type ?? data.bankType;
        if (!bank_type) throw new Error("bank_type wajib diisi (RECALL, LEVEL_EXERCISE, atau SIMULATION)");

        const question_format = data.question_format ?? data.questionFormat;
        if (!question_format) throw new Error("question_format wajib diisi (SINGLE_CHOICE atau COMPLEX_CHOICE)");

        const question_text = data.question_text ?? data.questionText;
        if (!question_text) throw new Error("question_text wajib diisi");

        const explanation_text = data.explanation.explanation_text ?? data.explanation.explanationText;
        if (!explanation_text) throw new Error("explanation.explanation_text wajib diisi");

        return {
            subject_id,
            sub_material_id: data.sub_material_id ?? data.subMaterialId ?? null,
            cognitive_level_id: data.cognitive_level_id ?? data.cognitiveLevelId ?? null,
            stimulus_id: data.stimulus_id ?? data.stimulusId ?? null,
            bank_type,
            question_format,
            question_text,
            stimulus_image_url: data.stimulus_image_url ?? data.stimulusImageUrl ?? null,
            options: data.options.map((o) => {
                const option_label = o.option_label ?? o.optionLabel;
                const option_text = o.option_text ?? o.optionText;
                const is_correct = o.is_correct ?? o.isCorrect ?? false;
                if (!option_label || !option_text) {
                    throw new Error("Setiap opsi wajib memiliki label dan teks");
                }
                return { option_label, option_text, is_correct };
            }),
            explanation: {
                explanation_text,
                reasoning_guide: data.explanation.reasoning_guide ?? data.explanation.reasoningGuide ?? null,
                reference_url: data.explanation.reference_url ?? data.explanation.referenceUrl ?? null,
            },
            stimulus: data.stimulus
                ? {
                      title: data.stimulus.title,
                      stimulus_text: data.stimulus.stimulus_text ?? data.stimulus.stimulusText ?? "",
                      stimulus_image_url: data.stimulus.stimulus_image_url ?? data.stimulus.stimulusImageUrl ?? null,
                  }
                : null,
        };
    });

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;

export const questionIdParamSchema = z.object({
    questionId: positiveInteger("questionId"),
});

export type QuestionIdParamInput = z.infer<typeof questionIdParamSchema>;

export const updateQuestionSchema = z
    .object({
        subject_id: positiveInteger("subject_id").optional(),
        subjectId: positiveInteger("subjectId").optional(),
        sub_material_id: positiveInteger("sub_material_id").nullable().optional(),
        subMaterialId: positiveInteger("subMaterialId").nullable().optional(),
        cognitive_level_id: positiveInteger("cognitive_level_id").nullable().optional(),
        cognitiveLevelId: positiveInteger("cognitiveLevelId").nullable().optional(),
        stimulus_id: positiveInteger("stimulus_id").nullable().optional(),
        stimulusId: positiveInteger("stimulusId").nullable().optional(),
        bank_type: z.enum(["RECALL", "LEVEL_EXERCISE", "SIMULATION"]).optional(),
        bankType: z.enum(["RECALL", "LEVEL_EXERCISE", "SIMULATION"]).optional(),
        question_format: z.enum(["SINGLE_CHOICE", "COMPLEX_CHOICE"]).optional(),
        questionFormat: z.enum(["SINGLE_CHOICE", "COMPLEX_CHOICE"]).optional(),
        question_text: z.string().trim().min(1).optional(),
        questionText: z.string().trim().min(1).optional(),
        stimulus_image_url: z.string().nullable().optional(),
        stimulusImageUrl: z.string().nullable().optional(),
        imageUrl: z.string().nullable().optional(),
        options: z
            .array(
                z.object({
                    option_label: z.enum(["A", "B", "C", "D"]).optional(),
                    optionLabel: z.enum(["A", "B", "C", "D"]).optional(),
                    option_text: z.string().trim().min(1).optional(),
                    optionText: z.string().trim().min(1).optional(),
                    is_correct: booleanField("is_correct").optional(),
                    isCorrect: booleanField("isCorrect").optional(),
                })
            )
            .optional(),
        explanation: z
            .object({
                explanation_text: z.string().trim().optional(),
                explanationText: z.string().trim().optional(),
                reasoning_guide: z.string().nullable().optional(),
                reasoningGuide: z.string().nullable().optional(),
                reference_url: z.string().nullable().optional(),
                referenceUrl: z.string().nullable().optional(),
            })
            .optional(),
        explanationText: z.string().trim().optional(),
        stimulus: z
            .object({
                title: z.string().trim().min(1).max(100).optional(),
                stimulus_text: z.string().trim().optional(),
                stimulusText: z.string().trim().optional(),
                stimulus_image_url: z.string().nullable().optional(),
                stimulusImageUrl: z.string().nullable().optional(),
            })
            .nullable()
            .optional(),
    })
    .transform((data) => {
        const subject_id = data.subject_id ?? data.subjectId;
        const sub_material_id = data.sub_material_id !== undefined ? data.sub_material_id : data.subMaterialId;
        const cognitive_level_id = data.cognitive_level_id !== undefined ? data.cognitive_level_id : data.cognitiveLevelId;
        const stimulus_id = data.stimulus_id !== undefined ? data.stimulus_id : data.stimulusId;
        const bank_type = data.bank_type ?? data.bankType;
        const question_format = data.question_format ?? data.questionFormat;
        const question_text = data.question_text ?? data.questionText;
        const stimulus_image_url = data.stimulus_image_url ?? data.stimulusImageUrl ?? data.imageUrl;

        const options = data.options
            ? data.options.map((o) => ({
                  option_label: (o.option_label ?? o.optionLabel ?? "A") as "A" | "B" | "C" | "D",
                  option_text: o.option_text ?? o.optionText ?? "",
                  is_correct: o.is_correct ?? o.isCorrect ?? false,
              }))
            : undefined;

        let explanation = undefined;
        if (data.explanation) {
            const explanation_text = data.explanation.explanation_text ?? data.explanation.explanationText;
            if (explanation_text) {
                explanation = {
                    explanation_text,
                    reasoning_guide: data.explanation.reasoning_guide ?? data.explanation.reasoningGuide ?? null,
                    reference_url: data.explanation.reference_url ?? data.explanation.referenceUrl ?? null,
                };
            }
        } else if (data.explanationText) {
            explanation = {
                explanation_text: data.explanationText,
                reasoning_guide: null,
                reference_url: null,
            };
        }

        const stimulus = data.stimulus
            ? {
                  title: data.stimulus.title || "Wacana Soal",
                  stimulus_text: data.stimulus.stimulus_text ?? data.stimulus.stimulusText ?? "",
                  stimulus_image_url: data.stimulus.stimulus_image_url ?? data.stimulus.stimulusImageUrl ?? null,
              }
            : data.stimulus === null
            ? null
            : undefined;

        return {
            subject_id,
            sub_material_id,
            cognitive_level_id,
            stimulus_id,
            bank_type,
            question_format,
            question_text,
            stimulus_image_url,
            options,
            explanation,
            stimulus,
        };
    });

export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

export const toggleQuestionStatusSchema = z
    .object({
        is_active: booleanField("is_active").optional(),
        isActive: booleanField("isActive").optional(),
    })
    .transform((data) => ({
        is_active: data.is_active ?? data.isActive ?? true,
    }));

export type ToggleQuestionStatusInput = z.infer<typeof toggleQuestionStatusSchema>;

export const createSimulationPackageSchema = z
    .object({
        subject_id: positiveInteger("subject_id").optional(),
        subjectId: positiveInteger("subjectId").optional(),
        title: requiredString("Judul paket", 3, 150),
        package_code: z.string().trim().optional(),
        packageCode: z.string().trim().optional(),
        description: z.string().optional(),
        status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "PUBLISHED"]).optional(),
        total_questions: z.coerce.number().optional(),
        totalQuestions: z.coerce.number().optional(),
        questions: z
            .array(
                z.object({
                    question_id: positiveInteger("question_id").optional(),
                    questionId: positiveInteger("questionId").optional(),
                    question_order: z.coerce.number().int().min(1).max(30).optional(),
                    questionOrder: z.coerce.number().int().min(1).max(30).optional(),
                })
            )
            .optional(),
        questionIds: z.array(positiveInteger("Question ID")).optional(),
    })
    .transform((data) => {
        const subject_id = data.subject_id ?? data.subjectId;
        if (!subject_id) throw new Error("subject_id wajib diisi dan berupa angka positif");

        let package_code = data.package_code ?? data.packageCode;
        if (!package_code) {
            const prefix = subject_id === 1 ? "MAT-SIM" : subject_id === 2 ? "BIN-SIM" : "SIM";
            package_code = `${prefix}-${Date.now().toString().slice(-4)}`;
        }

        let questions: Array<{ question_id: number; question_order: number }> = [];
        if (data.questions && data.questions.length > 0) {
            questions = data.questions.map((q, idx) => ({
                question_id: q.question_id ?? q.questionId ?? 0,
                question_order: q.question_order ?? q.questionOrder ?? idx + 1,
            }));
        } else if (data.questionIds && data.questionIds.length > 0) {
            questions = data.questionIds.map((id, idx) => ({
                question_id: id,
                question_order: idx + 1,
            }));
        }

        let mappedStatus: "DRAFT" | "ACTIVE" | "ARCHIVED" = "DRAFT";
        if (data.status === "ACTIVE" || data.status === "PUBLISHED") {
            mappedStatus = "ACTIVE";
        } else if (data.status === "ARCHIVED") {
            mappedStatus = "ARCHIVED";
        }

        return {
            subject_id,
            title: data.title,
            package_code,
            questions,
            status: mappedStatus,
        };
    });

export type CreateSimulationPackageInput = z.infer<typeof createSimulationPackageSchema>;

export const updateSimulationPackageSchema = z
    .object({
        subject_id: positiveInteger("subject_id").optional(),
        subjectId: positiveInteger("subjectId").optional(),
        title: z.string().trim().min(3).max(150).optional(),
        name: z.string().trim().min(3).max(150).optional(),
        package_code: z.string().trim().optional(),
        packageCode: z.string().trim().optional(),
        status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "PUBLISHED"]).optional(),
        is_active: booleanField("is_active").optional(),
        isActive: booleanField("isActive").optional(),
        isPublished: booleanField("isPublished").optional(),
        questions: z
            .array(
                z.object({
                    question_id: positiveInteger("question_id").optional(),
                    questionId: positiveInteger("questionId").optional(),
                    question_order: z.coerce.number().int().min(1).max(30).optional(),
                    questionOrder: z.coerce.number().int().min(1).max(30).optional(),
                })
            )
            .optional(),
        questionIds: z.array(positiveInteger("Question ID")).optional(),
    })
    .transform((data) => {
        const title = data.title ?? data.name;
        const subject_id = data.subject_id ?? data.subjectId;
        const package_code = data.package_code ?? data.packageCode;

        let status: "DRAFT" | "ACTIVE" | "ARCHIVED" | undefined;
        if (data.status === "PUBLISHED" || data.isPublished === true) {
            status = "ACTIVE";
        } else if (data.status) {
            status = data.status as "DRAFT" | "ACTIVE" | "ARCHIVED";
        } else if (data.isPublished === false) {
            status = "ARCHIVED";
        }

        let is_active = data.is_active ?? data.isActive;
        if (data.isPublished !== undefined) {
            is_active = data.isPublished;
        }

        let questions: Array<{ question_id: number; question_order: number }> | undefined;
        if (data.questions && data.questions.length > 0) {
            questions = data.questions.map((q, idx) => ({
                question_id: q.question_id ?? q.questionId ?? 0,
                question_order: q.question_order ?? q.questionOrder ?? idx + 1,
            }));
        } else if (data.questionIds && data.questionIds.length > 0) {
            questions = data.questionIds.map((id, idx) => ({
                question_id: id,
                question_order: idx + 1,
            }));
        }

        return {
            subject_id,
            title,
            package_code,
            status,
            is_active,
            questions,
        };
    });

export type UpdateSimulationPackageInput = z.infer<typeof updateSimulationPackageSchema>;

export const updateSimulationPackageStatusSchema = z
    .object({
        status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED", "PUBLISHED"]).optional(),
        is_active: booleanField("is_active").optional(),
        isActive: booleanField("isActive").optional(),
        isPublished: booleanField("isPublished").optional(),
    })
    .transform((data) => {
        let status: "DRAFT" | "ACTIVE" | "ARCHIVED" | undefined;
        let is_active = data.is_active ?? data.isActive;

        if (data.isPublished !== undefined) {
            is_active = data.isPublished;
            status = data.isPublished ? "ACTIVE" : "ARCHIVED";
        }

        if (data.status === "PUBLISHED") {
            status = "ACTIVE";
            if (is_active === undefined) is_active = true;
        } else if (data.status) {
            status = data.status;
            if (is_active === undefined) {
                if (status === "ACTIVE") is_active = true;
                if (status === "ARCHIVED") is_active = false;
            }
        }

        return {
            status,
            is_active,
        };
    });

export type UpdateSimulationPackageStatusInput = z.infer<typeof updateSimulationPackageStatusSchema>;

export const packageIdParamSchema = z.object({
    packageId: positiveInteger("packageId"),
});

export type PackageIdParamInput = z.infer<typeof packageIdParamSchema>;

export const paginationQuerySchema = paginationSchema;

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;

