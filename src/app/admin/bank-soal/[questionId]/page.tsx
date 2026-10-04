"use client";

import FormattedContent from "@/components/common/FormattedContent";
import OptionRenderer from "@/components/common/OptionRenderer";
import { AdminNav } from "@/components/layout/AdminNav";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import {
    AlertCircle,
    ArrowLeft,
    Check,
    Eye,
    Image as ImageIcon,
    ShieldCheck,
    Trash2,
    Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const SUBMATERIAL_MAP: Record<number, { title: string; material: string }> = {
    1: { title: "Bilangan Real", material: "Bilangan" },
    2: { title: "Persamaan & Pertidaksamaan Linier", material: "Aljabar" },
    3: { title: "Bentuk Aljabar", material: "Aljabar" },
    4: { title: "Relasi dan Fungsi", material: "Aljabar" },
    5: { title: "Barisan dan Deret", material: "Aljabar" },
    6: { title: "Objek Geometri", material: "Geometri & Pengukuran" },
    7: { title: "Transformasi Geometri", material: "Geometri & Pengukuran" },
    8: { title: "Pengukuran", material: "Geometri & Pengukuran" },
    9: { title: "Data (Statistika)", material: "Data & Peluang" },
    10: { title: "Peluang (Probabilitas)", material: "Data & Peluang" },
    11: {
        title: "Pemahaman Tekstual (Teks Informasi)",
        material: "Teks Informasi",
    },
    12: {
        title: "Pemahaman Inferensial (Teks Informasi)",
        material: "Teks Informasi",
    },
    13: {
        title: "Evaluasi dan Apresiasi (Teks Informasi)",
        material: "Teks Informasi",
    },
    14: { title: "Pemahaman Tekstual (Teks Fiksi)", material: "Teks Fiksi" },
    15: { title: "Pemahaman Inferensial (Teks Fiksi)", material: "Teks Fiksi" },
    16: {
        title: "Evaluasi dan Apresiasi (Teks Fiksi)",
        material: "Teks Fiksi",
    },
};

export default function EditQuestionPage({
    params,
}: {
    params: Promise<{ questionId: string }>;
}) {
    const router = useRouter();
    const { questionId } = use(params);
    const { user, role, isLoading: authLoading, isAuthenticated } = useAuth();

    useEffect(() => {
        if (
            !authLoading &&
            (!isAuthenticated ||
                (role !== "TIM_KURIKULUM" && user?.role !== "TIM_KURIKULUM"))
        ) {
            router.push("/dashboard");
        }
    }, [authLoading, isAuthenticated, role, user, router]);

    const [bankType, setBankType] = useState("LATIHAN");
    const [subjectId, setSubjectId] = useState("1");
    const [materialName, setMaterialName] = useState("");
    const [submaterialName, setSubmaterialName] = useState("");
    const [submaterialId, setSubmaterialId] = useState<number | null>(null);
    const [cognitiveLevel, setCognitiveLevel] = useState("L1");
    const [questionType, setQuestionType] = useState<
        "PG_TUNGGAL" | "PG_KOMPLEKS"
    >("PG_TUNGGAL");

    const [stimulus, setStimulus] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [questionText, setQuestionText] = useState("");

    const [options, setOptions] = useState([
        { key: "A", text: "" },
        { key: "B", text: "" },
        { key: "C", text: "" },
        { key: "D", text: "" },
    ]);

    const [singleKey, setSingleKey] = useState("A");
    const [complexKeys, setComplexKeys] = useState<string[]>(["A", "B"]);

    const [explanation, setExplanation] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        api.admin
            .getQuestion(questionId)
            .then((res: any) => {
                const data = res?.data || res;
                if (data) {
                    populateData(data);
                } else {
                    setErrorMsg("Data soal tidak ditemukan di server.");
                }
            })
            .catch((err: any) => {
                console.error("Failed to load question:", err);
                setErrorMsg(
                    err.message || "Gagal memuat data soal dari server.",
                );
            })
            .finally(() => setLoading(false));
    }, [questionId]);

    const populateData = (q: any) => {
        setBankType(q.bankType || q.bank_type || "LEVEL_EXERCISE");
        setSubjectId(String(q.subjectId || q.subject_id || 1));
        const subId = q.sub_material_id || q.subMaterialId || null;
        const subMeta = subId ? SUBMATERIAL_MAP[subId] : null;
        setSubmaterialId(subId);
        setMaterialName(
            q.materialName || q.material_name || subMeta?.material || "",
        );
        setSubmaterialName(
            q.submaterialName || q.sub_material_name || subMeta?.title || "",
        );
        const rawLevel = q.cognitiveLevelId || q.cognitive_level_id || "1";
        const parsedLevel = String(rawLevel).replace("L", "");
        setCognitiveLevel(
            ["1", "2", "3"].includes(parsedLevel) ? parsedLevel : "1",
        );
        const format = q.questionFormat || q.question_format || q.type || "";
        setQuestionType(
            format === "COMPLEX_CHOICE" || format === "PG_KOMPLEKS"
                ? "PG_KOMPLEKS"
                : "PG_TUNGGAL",
        );
        setStimulus(
            typeof q.stimulus === "string"
                ? q.stimulus
                : q.stimulus?.stimulus_text || q.stimulusText || "",
        );
        setImageUrl(
            q.question_image_url ||
                q.questionImageUrl ||
                q.stimulus_image_url ||
                q.stimulusImageUrl ||
                (typeof q.stimulus === "object" &&
                    (q.stimulus?.stimulus_image_url ||
                        q.stimulus?.image_url)) ||
                q.imageUrl ||
                "",
        );
        setQuestionText(q.questionText || q.question_text || "");
        if (q.options && Array.isArray(q.options)) {
            setOptions(
                q.options.map((opt: any) => ({
                    key: opt.optionLabel || opt.option_label || opt.key,
                    text: opt.optionText || opt.option_text || opt.text,
                })),
            );
            const correctList = q.options
                .filter((opt: any) => opt.isCorrect || opt.is_correct)
                .map(
                    (opt: any) =>
                        opt.optionLabel || opt.option_label || opt.key,
                );
            if (correctList.length > 1) {
                setComplexKeys(correctList);
            } else if (correctList.length === 1) {
                setSingleKey(correctList[0]);
                setComplexKeys([correctList[0]]);
            }
        }
        setExplanation(
            q.explanation?.explanationText ||
                q.explanationText ||
                q.explanation_text ||
                (typeof q.explanation === "string" ? q.explanation : ""),
        );
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setErrorMsg("");
        try {
            const formData = new FormData();
            formData.append("image", file);
            const res = await api.admin.uploadImage(formData);
            const permanentUrl = res?.imageUrl || res?.image_url || res?.url;
            if (permanentUrl) {
                setImageUrl(permanentUrl);
            }
        } catch (err: any) {
            console.error("Failed to upload image:", err);
            setErrorMsg(
                err.message || "Gagal mengunggah berkas gambar ke server.",
            );
        } finally {
            setUploadingImage(false);
        }
    };

    const handleOptionChange = (key: string, text: string) => {
        setOptions(
            options.map((opt) => (opt.key === key ? { ...opt, text } : opt)),
        );
    };

    const handleToggleComplexKey = (key: string) => {
        if (complexKeys.includes(key)) {
            setComplexKeys(complexKeys.filter((k) => k !== key));
        } else {
            if (complexKeys.length >= 2) return; // Exactly 2 keys max
            setComplexKeys([...complexKeys, key]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (questionType === "PG_KOMPLEKS" && complexKeys.length !== 2) {
            setErrorMsg(
                "Pilihan Ganda Kompleks harus memiliki tepat 2 kunci jawaban yang benar.",
            );
            return;
        }

        setSubmitting(true);
        setErrorMsg("");

        const question_format =
            questionType === "PG_KOMPLEKS" ? "COMPLEX_CHOICE" : "SINGLE_CHOICE";

        const formattedOptions = options.map((opt) => ({
            option_label: opt.key,
            option_text: opt.text,
            is_correct:
                questionType === "PG_KOMPLEKS"
                    ? complexKeys.includes(opt.key)
                    : singleKey === opt.key,
        }));

        const normalizedBankType =
            bankType === "LATIHAN"
                ? "LEVEL_EXERCISE"
                : bankType === "SIMULASI"
                  ? "SIMULATION"
                  : bankType;

        const isRecall = normalizedBankType === "RECALL";

        const payload: any = {
            bank_type: normalizedBankType,
            subject_id: Number(subjectId),
            question_format,
            question_text: questionText,
            options: formattedOptions,
            explanation: {
                explanation_text:
                    explanation?.trim() ||
                    "Pembahasan soal terlampir pada kunci jawaban.",
            },
            stimulus: stimulus?.trim()
                ? {
                      title: `Wacana - ${questionText.slice(0, 30)}`,
                      stimulus_text: stimulus,
                      stimulus_image_url: imageUrl || null,
                  }
                : null,
            stimulus_image_url: imageUrl || null,
            question_image_url: imageUrl || null,
            sub_material_id: isRecall ? null : submaterialId || 1,
            cognitive_level_id: isRecall ? null : Number(cognitiveLevel) || 1,
        };

        try {
            await api.admin.updateQuestion(questionId, payload);
            setSuccessMsg("Perubahan butir soal berhasil disimpan!");
            setTimeout(() => router.push("/admin/bank-soal"), 1500);
        } catch (err: any) {
            setErrorMsg(err.message || "Gagal memperbarui soal.");
        } finally {
            setSubmitting(false);
        }
    };

    if (
        !authLoading &&
        (!isAuthenticated ||
            (role !== "TIM_KURIKULUM" && user?.role !== "TIM_KURIKULUM"))
    ) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
            <AdminNav />

            <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
                <Link
                    href="/admin/bank-soal"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Bank Soal
                </Link>

                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Edit Butir Soal #{questionId}
                    </h1>
                    <p className="mt-1 text-xs text-slate-600">
                        Perbarui konten pertanyaan, opsi pilihan, dan penjelasan
                        nalar.
                    </p>
                </div>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errorMsg && (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                        {successMsg && (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                                1. Klasifikasi Soal
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">
                                        Bank Soal
                                    </label>
                                    <select
                                        value={bankType}
                                        onChange={(e) =>
                                            setBankType(e.target.value)
                                        }
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs"
                                    >
                                        <option value="RECALL">
                                            Bank Recall Kemampuanmu
                                        </option>
                                        <option value="LEVEL_EXERCISE">
                                            Bank Latihan Level Kognitif
                                        </option>
                                        <option value="SIMULATION">
                                            Bank Simulasi TKA
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">
                                        Level Kognitif
                                    </label>
                                    <select
                                        value={cognitiveLevel}
                                        onChange={(e) =>
                                            setCognitiveLevel(e.target.value)
                                        }
                                        disabled={bankType === "RECALL"}
                                        className={`mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs ${
                                            bankType === "RECALL"
                                                ? "opacity-50 cursor-not-allowed bg-slate-50"
                                                : ""
                                        }`}
                                    >
                                        <option value="1">
                                            Level 1 (Pemahaman)
                                        </option>
                                        <option value="2">
                                            Level 2 (Aplikasi)
                                        </option>
                                        <option value="3">
                                            Level 3 (Penalaran)
                                        </option>
                                    </select>
                                    {bankType === "RECALL" && (
                                        <span className="text-[10px] text-amber-700 mt-1 block">
                                            Tidak berlaku untuk Bank Recall
                                            (UCS-10)
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">
                                        Bentuk Soal
                                    </label>
                                    <select
                                        value={questionType}
                                        onChange={(e: any) =>
                                            setQuestionType(e.target.value)
                                        }
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs"
                                    >
                                        <option value="PG_TUNGGAL">
                                            Pilihan Ganda Tunggal
                                        </option>
                                        <option value="PG_KOMPLEKS">
                                            Pilihan Ganda Kompleks (MCMA)
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                                2. Teks Pertanyaan & Stimulus
                            </h3>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">
                                    Stimulus
                                </label>
                                <textarea
                                    rows={3}
                                    value={stimulus}
                                    onChange={(e) =>
                                        setStimulus(e.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">
                                    Teks Soal
                                </label>
                                <textarea
                                    rows={3}
                                    value={questionText}
                                    onChange={(e) =>
                                        setQuestionText(e.target.value)
                                    }
                                    required
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
                                />
                            </div>

                            {/* Image upload & URL */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-slate-700">
                                    Gambar Stimulus / Pendukung Soal (Opsional)
                                </label>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <label className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors shrink-0 shadow-xs">
                                        <Upload className="h-4 w-4 text-purple-600" />
                                        <span>
                                            {uploadingImage
                                                ? "Mengunggah..."
                                                : "Unggah Berkas"}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>

                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={imageUrl}
                                            onChange={(e) =>
                                                setImageUrl(e.target.value)
                                            }
                                            placeholder="Atau masukkan path / URL gambar (misal: /assets/gambar.jpeg atau https://...)"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 pl-9 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
                                        />
                                        <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>

                                {imageUrl && (
                                    <div className="mt-2.5 flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                                        <img
                                            src={imageUrl}
                                            alt="Pratinjau stimulus"
                                            className="h-24 w-auto max-w-[200px] object-contain rounded-xl border border-slate-200 bg-white"
                                        />
                                        <div className="flex-1 space-y-2">
                                            <span className="text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                                                <Check className="h-3.5 w-3.5 text-emerald-600" />{" "}
                                                Gambar aktif terpasang
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setImageUrl("")}
                                                className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 transition-colors cursor-pointer font-medium"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                <span>Hapus Gambar</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-sm font-bold text-slate-900">
                                    3. Pilihan Jawaban
                                </h3>
                                {questionType === "PG_KOMPLEKS" && (
                                    <span
                                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                            complexKeys.length === 2
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-amber-50 text-amber-700 border border-amber-200"
                                        }`}
                                    >
                                        {complexKeys.length}/2 Kunci Dipilih
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-500">
                                {questionType === "PG_TUNGGAL"
                                    ? "Pilih satu radio button pada opsi yang menjadi kunci jawaban benar."
                                    : "Centang kotak checkbox pada 2 opsi yang menjadi kunci jawaban benar (tepat 2 kunci)."}
                            </p>
                            <div className="space-y-3">
                                {options.map((opt) => (
                                    <div
                                        key={opt.key}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                                            {opt.key}
                                        </span>
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    opt.key,
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
                                        />
                                        {questionType === "PG_TUNGGAL" ? (
                                            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer px-2">
                                                <input
                                                    type="radio"
                                                    name="editSingleKey"
                                                    checked={
                                                        singleKey === opt.key
                                                    }
                                                    onChange={() =>
                                                        setSingleKey(opt.key)
                                                    }
                                                    className="text-purple-600"
                                                />
                                                <span>Kunci</span>
                                            </label>
                                        ) : (
                                            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer px-2">
                                                <input
                                                    type="checkbox"
                                                    checked={complexKeys.includes(
                                                        opt.key,
                                                    )}
                                                    disabled={
                                                        !complexKeys.includes(
                                                            opt.key,
                                                        ) &&
                                                        complexKeys.length >= 2
                                                    }
                                                    onChange={() =>
                                                        handleToggleComplexKey(
                                                            opt.key,
                                                        )
                                                    }
                                                    className="text-purple-600 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                                                />
                                                <span>Kunci</span>
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                                4. Pembahasan Nalar
                            </h3>
                            <textarea
                                rows={4}
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
                            />
                        </div>

                        {/* Section 5: Live Preview */}
                        <div className="rounded-3xl border border-purple-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-purple-600" />
                                    5. Pratinjau Tampilan Siswa (Live LaTeX,
                                    Markdown & Gambar)
                                </h3>
                                <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                                    Pratinjau Otomatis
                                </span>
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Format yang didukung: rumus LaTeX inline (
                                <code className="text-purple-700 font-mono font-bold">
                                    $...$
                                </code>
                                ), block math (
                                <code className="text-purple-700 font-mono font-bold">
                                    $$...$$
                                </code>
                                ), markdown (
                                <code className="text-purple-700 font-mono font-bold">
                                    **tebal**
                                </code>
                                ,{" "}
                                <code className="text-purple-700 font-mono font-bold">
                                    *miring*
                                </code>
                                ), dan gambar pada opsi (
                                <code className="text-purple-700 font-mono font-bold">
                                    /assets/gambar.png
                                </code>{" "}
                                atau{" "}
                                <code className="text-purple-700 font-mono font-bold">
                                    ![alt](url)
                                </code>
                                ).
                            </p>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                                {stimulus && (
                                    <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-3 text-xs text-slate-700 border-l-4 border-l-purple-600">
                                        <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                                            Stimulus / Narasi:
                                        </p>
                                        <FormattedContent content={stimulus} />
                                    </div>
                                )}

                                {imageUrl && (
                                    <div className="rounded-xl border border-slate-200 bg-white p-2 text-center">
                                        <img
                                            src={imageUrl}
                                            alt="Pratinjau Stimulus"
                                            className="max-h-48 w-auto mx-auto object-contain rounded-lg"
                                        />
                                    </div>
                                )}

                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Pertanyaan:
                                    </p>
                                    {questionText ? (
                                        <div className="text-sm font-medium text-slate-900 leading-relaxed">
                                            <FormattedContent
                                                content={questionText}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-xs italic text-slate-400">
                                            Belum ada teks pokok soal...
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        Pilihan Jawaban:
                                    </p>
                                    <div className="space-y-2">
                                        {options.map((opt) => {
                                            const isKey =
                                                questionType === "PG_TUNGGAL"
                                                    ? singleKey === opt.key
                                                    : complexKeys.includes(
                                                          opt.key,
                                                      );
                                            return (
                                                <div
                                                    key={opt.key}
                                                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
                                                        isKey
                                                            ? "border-emerald-300 bg-emerald-50/60 text-slate-900"
                                                            : "border-slate-200 bg-white text-slate-700"
                                                    }`}
                                                >
                                                    <span
                                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                                                            isKey
                                                                ? "bg-emerald-600 text-white"
                                                                : "bg-slate-100 text-slate-600 border border-slate-200"
                                                        }`}
                                                    >
                                                        {opt.key}
                                                    </span>
                                                    <div className="flex-1 pt-0.5">
                                                        {opt.text ? (
                                                            <OptionRenderer
                                                                text={opt.text}
                                                            />
                                                        ) : (
                                                            <span className="italic text-slate-400 text-[11px]">
                                                                (Belum diisi)
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isKey && (
                                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider shrink-0 mt-0.5">
                                                            (Kunci Jawaban)
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {explanation && (
                                    <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3.5 text-xs text-slate-800">
                                        <p className="font-bold text-purple-700 text-[10px] uppercase tracking-wider mb-1">
                                            Pratinjau Pembahasan:
                                        </p>
                                        <div className="leading-relaxed text-slate-700">
                                            <FormattedContent
                                                content={explanation}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Link
                                href="/admin/bank-soal"
                                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-tactile-primary rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer disabled:opacity-50"
                            >
                                {submitting ? "Menyimpan..." : "Perbarui Soal"}
                            </button>
                        </div>
                    </form>
                )}
            </main>

            <Footer />
        </div>
    );
}
