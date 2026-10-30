import { NextRequest } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { adminController } from "@/modules/admin/admin.controller";
import { jsonResponse, errorResponse } from "@/shared/utils/response";
import { BadRequestError } from "@/shared/errors/app-error";

function parseCsvToQuestions(csvText: string): any[] {
    const cleanText = csvText.replace(/^\uFEFF/, "").trim();
    if (!cleanText) return [];

    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = "";
    let inQuotes = false;

    const firstLine = cleanText.split(/\r?\n/)[0] || "";
    const delimiter = firstLine.includes(";") && !firstLine.includes(",") ? ";" : ",";

    for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        const nextChar = cleanText[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === delimiter && !inQuotes) {
            currentRow.push(currentField.trim());
            currentField = "";
        } else if ((char === "\r" || char === "\n") && !inQuotes) {
            if (char === "\r" && nextChar === "\n") i++;
            currentRow.push(currentField.trim());
            if (currentRow.some((c) => c.length > 0)) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentField = "";
        } else {
            currentField += char;
        }
    }
    if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some((c) => c.length > 0)) {
            rows.push(currentRow);
        }
    }

    if (rows.length < 2) return [];

    const headers = rows[0].map((h) => h.toLowerCase().replace(/[\s_]+/g, "_"));
    const dataRows = rows.slice(1);

    return dataRows.map((cols) => {
        const getVal = (name: string): string => {
            const idx = headers.indexOf(name.toLowerCase());
            return idx !== -1 && cols[idx] !== undefined ? cols[idx].trim() : "";
        };

        const subject_id = Number(getVal("subject_id") || "1");
        const bank_type = getVal("bank_type") || "LEVEL_EXERCISE";
        const sub_material_id = getVal("sub_material_id") ? Number(getVal("sub_material_id")) : null;
        const cognitive_level_id = getVal("cognitive_level_id") ? Number(getVal("cognitive_level_id")) : null;
        const question_format = getVal("question_format") || "SINGLE_CHOICE";
        const question_text = getVal("question_text");

        const optA = getVal("option_a");
        const optB = getVal("option_b");
        const optC = getVal("option_c");
        const optD = getVal("option_d");
        const correctKeys = (getVal("correct_keys") || "").toUpperCase().split(/[,;\s]+/).filter(Boolean);

        const explanation_text = getVal("explanation_text");
        const reasoning_guide = getVal("reasoning_guide") || null;

        const stimulus_title = getVal("stimulus_title");
        const stimulus_text = getVal("stimulus_text");

        return {
            subject_id,
            bank_type,
            sub_material_id,
            cognitive_level_id,
            question_format,
            question_text,
            options: [
                { option_label: "A", option_text: optA, is_correct: correctKeys.includes("A") },
                { option_label: "B", option_text: optB, is_correct: correctKeys.includes("B") },
                { option_label: "C", option_text: optC, is_correct: correctKeys.includes("C") },
                { option_label: "D", option_text: optD, is_correct: correctKeys.includes("D") }
            ],
            explanation: {
                explanation_text: explanation_text || "Pembahasan butir soal.",
                reasoning_guide
            },
            stimulus: stimulus_title ? {
                title: stimulus_title,
                stimulus_text: stimulus_text || ""
            } : null,
            status: getVal("status") || "DRAFT"
        };
    });
}

export async function POST(req: NextRequest) {
    try {
        await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
        const contentType = req.headers.get("content-type") || "";

        let questions: any[] = [];

        if (contentType.includes("application/json")) {
            const body = await req.json();
            questions = Array.isArray(body) ? body : body.questions;
        } else if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const file = formData.get("file") as File | null;
            if (!file) {
                throw new BadRequestError("Berkas file soal wajib dilampirkan.", "FILE_REQUIRED");
            }
            const text = await file.text();
            const fileName = (file.name || "").toLowerCase();

            if (fileName.endsWith(".csv") || text.includes(",") || text.includes(";")) {
                try {
                    questions = parseCsvToQuestions(text);
                } catch {
                    // Fallback to JSON jika gagal parse CSV
                }
            }

            if (!questions || questions.length === 0) {
                try {
                    const parsed = JSON.parse(text);
                    questions = Array.isArray(parsed) ? parsed : parsed.questions;
                } catch {
                    if (questions.length === 0) {
                        throw new BadRequestError("Format berkas harus berupa CSV atau JSON array butir soal valid.", "INVALID_FILE_FORMAT");
                    }
                }
            }
        } else {
            throw new BadRequestError("Content-Type harus application/json atau multipart/form-data.", "INVALID_CONTENT_TYPE");
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new BadRequestError("Daftar butir soal kosong atau tidak berformat array.", "EMPTY_QUESTIONS");
        }

        let importedCount = 0;
        const errors: { index: number; message: string }[] = [];

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            try {
                await (adminController as any)["service"].createQuestion(q);
                importedCount++;
            } catch (err: any) {
                errors.push({ index: i + 1, message: err.message || "Gagal menyimpan soal" });
            }
        }

        return jsonResponse(
            {
                success: true,
                message: `Impor selesai. ${importedCount} butir berhasil diimpor, ${errors.length} gagal.`,
                data: {
                    total: questions.length,
                    importedCount,
                    failedCount: errors.length,
                    errors: errors.slice(0, 10),
                },
            },
            importedCount > 0 ? 201 : 400
        );
    } catch (error) {
        return errorResponse(error, "status");
    }
}
