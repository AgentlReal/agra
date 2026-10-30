import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/modules/auth/auth.guard";
import { errorResponse } from "@/shared/utils/response";

export async function GET(req: NextRequest) {
    try {
        await requireRole(["TIM_KURIKULUM", "SUPERADMIN"]);
        const url = new URL(req.url);
        const format = (url.searchParams.get("format") || "csv").toLowerCase();

        if (format === "json") {
            const sampleJson = {
                instructions: "Template impor butir soal AGRA Platform. Isi data sesuai spesifikasi berikut.",
                sample_data: [
                    {
                        subject_id: 1,
                        bank_type: "LEVEL_EXERCISE",
                        sub_material_id: 1,
                        cognitive_level_id: 1,
                        question_format: "SINGLE_CHOICE",
                        question_text: "Berapakah hasil dari 25 x 4?",
                        options: [
                            { option_label: "A", option_text: "100", is_correct: true },
                            { option_label: "B", option_text: "80", is_correct: false },
                            { option_label: "C", option_text: "90", is_correct: false },
                            { option_label: "D", option_text: "120", is_correct: false }
                        ],
                        explanation: {
                            explanation_text: "Perkalian 25 x 4 = 100.",
                            reasoning_guide: "Gunakan konsep perkalian dasar atau penjumlahan berulang (25 + 25 + 25 + 25)."
                        },
                        status: "DRAFT"
                    },
                    {
                        subject_id: 1,
                        bank_type: "LEVEL_EXERCISE",
                        sub_material_id: 1,
                        cognitive_level_id: 2,
                        question_format: "COMPLEX_CHOICE",
                        question_text: "Manakah dua bilangan berikut yang jika dijumlahkan menghasilkan bilangan bulat positif genap?",
                        options: [
                            { option_label: "A", option_text: "3 dan 5", is_correct: true },
                            { option_label: "B", option_text: "-2 dan 4", is_correct: true },
                            { option_label: "C", option_text: "1 dan 2", is_correct: false },
                            { option_label: "D", option_text: "-3 dan -1", is_correct: false }
                        ],
                        explanation: {
                            explanation_text: "3 + 5 = 8 (positif genap), dan -2 + 4 = 2 (positif genap).",
                            reasoning_guide: "Analisis setiap pasangan bilangan dan evaluasi tanda serta paritas hasilnya."
                        },
                        status: "DRAFT"
                    }
                ]
            };

            return new NextResponse(JSON.stringify(sampleJson, null, 2), {
                status: 200,
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Content-Disposition": 'attachment; filename="template_impor_soal_tka.json"',
                    "Cache-Control": "no-cache",
                },
            });
        }

        // CSV Format (Default)
        // Kolom standar:
        const headers = [
            "subject_id",
            "bank_type",
            "sub_material_id",
            "cognitive_level_id",
            "question_format",
            "question_text",
            "option_A",
            "option_B",
            "option_C",
            "option_D",
            "correct_keys",
            "explanation_text",
            "reasoning_guide",
            "stimulus_title",
            "stimulus_text",
            "status"
        ];

        const sampleRows = [
            [
                "1",
                "LEVEL_EXERCISE",
                "1",
                "1",
                "SINGLE_CHOICE",
                '"Berapakah hasil dari 25 x 4?"',
                '"100"',
                '"80"',
                '"90"',
                '"120"',
                "A",
                '"Perkalian 25 x 4 sama dengan 100."',
                '"Gunakan konsep penjumlahan berulang 25 + 25 + 25 + 25."',
                '""',
                '""',
                "DRAFT"
            ],
            [
                "1",
                "LEVEL_EXERCISE",
                "1",
                "2",
                "COMPLEX_CHOICE",
                '"Pilihlah dua pernyataan yang benar mengenai sifat bilangan real!"',
                '"Penjumlahan dua bilangan genap selalu genap"',
                '"Perkalian dua bilangan ganjil menghasilkan bilangan genap"',
                '"Bilangan prima terkecil adalah 2"',
                '"Bilangan nol termasuk bilangan negatif"',
                '"A,C"',
                '"Penjumlahan dua genap selalu genap dan 2 adalah prima terkecil."',
                '"Periksa satu per satu kebenaran definisi bilangan."',
                '""',
                '""',
                "DRAFT"
            ],
            [
                "2",
                "RECALL",
                '""',
                '""',
                "SINGLE_CHOICE",
                '"Berdasarkan wacana di atas, apa gagasan utama paragraf pertama?"',
                '"Pentingnya menjaga kelestarian ekosistem sungai"',
                '"Dampak limbah pabrik terhadap hasil panen"',
                '"Program reboisasi hutan di hulu sungai"',
                '"Pembangunan bendungan air serbaguna"',
                "A",
                '"Gagasan utama terletak pada kalimat topik yang merangkum urgensi ekosistem sungai."',
                '"Cari ide pokok pada kalimat utama dan kalimat penjelas."',
                '"Krisis Kualitas Air Sungai."',
                '"Sungai merupakan sumber kehidupan utama bagi masyarakat perkotaan. Namun dalam dekade terakhir, tingkat polusi meningkat signifikan akibat pembuangan limbah tanpa filtrasi memadai."',
                "DRAFT"
            ],
            [
                "1",
                "SIMULATION",
                "1",
                "3",
                "SINGLE_CHOICE",
                '"Jika a dan b adalah bilangan prima sedemikian sehingga a + b = 99, maka nilai a x b adalah ..."',
                '"194"',
                '"196"',
                '"198"',
                '"200"',
                "A",
                '"Karena jumlah dua bilangan prima adalah ganjil (99), salah satu prima harus genap yaitu 2. Maka bilangan lainnya 97. Hasil kali: 2 x 97 = 194."',
                '"Ingat sifat paritas: ganjil + genap = ganjil. Satu-satunya bilangan prima genap adalah 2."',
                '""',
                '""',
                "DRAFT"
            ]
        ];

        // Sertakan UTF-8 BOM (\uFEFF) agar Microsoft Excel membuka karakter secara presisi
        const csvContent = "\uFEFF" + headers.join(",") + "\n" + sampleRows.map((r) => r.join(",")).join("\n");

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": 'attachment; filename="template_impor_soal_tka.csv"',
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        return errorResponse(error, "status");
    }
}
