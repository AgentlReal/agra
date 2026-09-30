import { ZodSchema, ZodError, z } from "zod";
import { BadRequestError, ValidationError } from "@/shared/errors/app-error";

export interface ValidationOptions {
    /**
     * "m01": format { success: false, error: { code, message, fields } } (HTTP 422 atau statusCode)
     * "status": format { status, error, message } (HTTP 400 atau statusCode)
     */
    style?: "m01" | "status";
    defaultCode?: string;
    statusCode?: number;
}

/**
 * Mengubah ZodError menjadi mapping fields: Record<string, string>
 */
export function formatZodIssues(error: ZodError): {
    fields: Record<string, string>;
    firstMessage: string;
    customCode?: string;
} {
    const fields: Record<string, string> = {};
    let firstMessage = "Data yang dikirim tidak valid.";
    let customCode: string | undefined;

    for (let i = 0; i < error.issues.length; i++) {
        const issue = error.issues[i];
        const fieldName = issue.path.join(".") || "general";
        if (!fields[fieldName]) {
            fields[fieldName] = issue.message;
        }
        if (i === 0) {
            firstMessage = issue.message;
            // Cek jika ada custom code yang disematkan pada error message atau issue
            if ((issue as unknown as { params?: { code?: string } }).params?.code) {
                customCode = (issue as unknown as { params: { code: string } }).params.code;
            }
        }
    }

    return { fields, firstMessage, customCode };
}

/**
 * Validasi Request Body (JSON)
 */
export async function validateBody<T>(
    req: Request,
    schema: ZodSchema<T>,
    options: ValidationOptions = {}
): Promise<T> {
    let body: unknown;
    try {
        const text = await req.text();
        if (!text || text.trim() === "") {
            throw new Error("EMPTY_BODY");
        }
        body = JSON.parse(text);
    } catch (err: unknown) {
        if ((err as Error)?.message === "EMPTY_BODY") {
            throw new BadRequestError("Request body tidak boleh kosong dan harus berupa JSON yang valid.");
        }
        throw new BadRequestError("Format JSON tidak valid atau rusak.");
    }

    const result = schema.safeParse(body);
    if (!result.success) {
        const { fields, firstMessage, customCode } = formatZodIssues(result.error);
        const code = customCode || options.defaultCode || "VALIDATION_ERROR";

        if (options.style === "status") {
            throw new BadRequestError(firstMessage, code, fields);
        }

        const statusCode = options.statusCode || 422;
        throw new ValidationError(firstMessage, fields, statusCode, code);
    }

    return result.data;
}

/**
 * Validasi Path Parameter (mis. [subject_id], [attempt_id])
 */
export function validateParams<T>(params: unknown, schema: ZodSchema<T>): T {
    const result = schema.safeParse(params);
    if (!result.success) {
        const { fields, firstMessage } = formatZodIssues(result.error);
        throw new BadRequestError(firstMessage, "INVALID_PARAMETER", fields);
    }
    return result.data;
}

/**
 * Validasi Query Parameter (URL search params)
 */
export function validateQuery<T>(
    querySource: Request | URL | URLSearchParams | Record<string, unknown> | unknown,
    schema: ZodSchema<T>
): T {
    let rawObj: Record<string, unknown> = {};

    if (querySource instanceof Request) {
        const url = new URL(querySource.url);
        rawObj = Object.fromEntries(url.searchParams.entries());
    } else if (querySource instanceof URL) {
        rawObj = Object.fromEntries(querySource.searchParams.entries());
    } else if (querySource instanceof URLSearchParams) {
        rawObj = Object.fromEntries(querySource.entries());
    } else if (typeof querySource === "object" && querySource !== null) {
        rawObj = querySource as Record<string, unknown>;
    }

    const result = schema.safeParse(rawObj);
    if (!result.success) {
        const { fields, firstMessage } = formatZodIssues(result.error);
        throw new BadRequestError(firstMessage, "INVALID_QUERY_PARAMETER", fields);
    }
    return result.data;
}

/* =========================================================================
   REUSABLE PRIMITIVE FIELD VALIDATORS (Building Blocks for Domain Schemas)
   ========================================================================= */

/**
 * Validasi ID integer positif (1, 2, 3, ...)
 */
export const positiveInteger = (fieldName = "ID") =>
    z.coerce
        .number({ error: `${fieldName} harus berupa angka` })
        .int(`${fieldName} harus berupa bilangan bulat`)
        .positive(`${fieldName} harus berupa angka positif (> 0)`);

/**
 * Validasi angka tidak negatif (>= 0)
 */
export const nonNegativeInteger = (fieldName = "Nilai") =>
    z.coerce
        .number({ error: `${fieldName} harus berupa angka` })
        .int(`${fieldName} harus berupa bilangan bulat`)
        .nonnegative(`${fieldName} tidak boleh bernilai negatif (>= 0)`);

/**
 * Validasi angka desimal tidak negatif (mis. skor, persentase >= 0)
 */
export const nonNegativeNumber = (fieldName = "Nilai") =>
    z.coerce
        .number({ error: `${fieldName} harus berupa angka` })
        .nonnegative(`${fieldName} tidak boleh bernilai negatif (>= 0)`);

/**
 * Validasi teks string wajib dengan batasan panjang minimum dan maksimum
 */
export const requiredString = (fieldName: string, min = 1, max = 255) =>
    z
        .string({ error: `${fieldName} harus berupa teks (string)` })
        .trim()
        .min(min, `${fieldName} minimal terdiri dari ${min} karakter`)
        .max(max, `${fieldName} maksimal terdiri dari ${max} karakter`);

/**
 * Validasi format email standar
 */
export const emailString = (fieldName = "Email") =>
    z
        .string({ error: `${fieldName} harus berupa teks` })
        .trim()
        .email(`Format ${fieldName} tidak valid`);

/**
 * Validasi URL format
 */
export const urlString = (fieldName = "URL") =>
    z
        .string({ error: `${fieldName} harus berupa teks` })
        .trim()
        .url(`Format ${fieldName} tidak valid (harus berupa URL valid, contoh: https://example.com)`);

/**
 * Validasi boolean
 */
export const booleanField = (fieldName = "Status") =>
    z.preprocess((val) => {
        if (typeof val === "boolean") return val;
        if (val === "true" || val === "1") return true;
        if (val === "false" || val === "0") return false;
        return val;
    }, z.boolean({ error: `${fieldName} harus berupa nilai boolean (true/false)` }));

/**
 * Schema paginasi standar (page min 1, limit 1-100)
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1, "Halaman (page) minimal 1").default(1),
    limit: z.coerce.number().int().min(1, "Limit minimal 1").max(100, "Limit maksimal 100").default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
