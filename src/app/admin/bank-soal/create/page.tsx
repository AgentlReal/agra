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
import React, { useState } from "react";

interface SubMaterialOption {
    id: number;
    title: string;
    material_title?: string;
}

const DEFAULT_SUBMATERIALS: Record<string, SubMaterialOption[]> = {
    "1": [
        { id: 1, title: "Bilangan Real", material_title: "Bilangan" },
        {
            id: 2,
            title: "Persamaan & Pertidaksamaan Linier",
            material_title: "Aljabar",
        },
        { id: 3, title: "Bentuk Aljabar", material_title: "Aljabar" },
        { id: 4, title: "Relasi dan Fungsi", material_title: "Aljabar" },
        { id: 5, title: "Barisan dan Deret", material_title: "Aljabar" },
        {
            id: 6,
            title: "Objek Geometri",
            material_title: "Geometri & Pengukuran",
        },
        {
            id: 7,
            title: "Transformasi Geometri",
            material_title: "Geometri & Pengukuran",
        },
        { id: 8, title: "Pengukuran", material_title: "Geometri & Pengukuran" },
        { id: 9, title: "Data (Statistika)", material_title: "Data & Peluang" },
        {
            id: 10,
            title: "Peluang (Probabilitas)",
            material_title: "Data & Peluang",
        },
    ],
    "2": [
        {
            id: 11,
            title: "Pemahaman Tekstual (Teks Informasi)",
            material_title: "Teks Informasi",
        },
        {
            id: 12,
            title: "Pemahaman Inferensial (Teks Informasi)",
            material_title: "Teks Informasi",
        },
        {
            id: 13,
            title: "Evaluasi dan Apresiasi (Teks Informasi)",
            material_title: "Teks Informasi",
        },
        {
            id: 14,
            title: "Pemahaman Tekstual (Teks Fiksi)",
            material_title: "Teks Fiksi",
        },
        {
            id: 15,
            title: "Pemahaman Inferensial (Teks Fiksi)",
            material_title: "Teks Fiksi",
        },
        {
            id: 16,
            title: "Evaluasi dan Apresiasi (Teks Fiksi)",
            material_title: "Teks Fiksi",
        },
    ],
};

export default function CreateQuestionPage() {
    const router = useRouter();
    const { user, role, isLoading, isAuthenticated } = useAuth();

    const [bankType, setBankType] = useState("LEVEL_EXERCISE");
    const [subjectId, setSubjectId] = useState("1");
    const [submaterials, setSubmaterials] = useState<SubMaterialOption[]>(
        DEFAULT_SUBMATERIALS["1"],
    );
    const [submaterialId, setSubmaterialId] = useState("1");
    const [materialName, setMaterialName] = useState("Bilangan");
    const [submaterialName, setSubmaterialName] = useState("Bilangan Real");
    const [cognitiveLevel, setCognitiveLevel] = useState("1");
    const [questionType, setQuestionType] = useState<
        "PG_TUNGGAL" | "PG_KOMPLEKS"
    >("PG_TUNGGAL");

    const [stimulus, setStimulus] = useState("");
    const [questionText, setQuestionText] = useState("");

    // 4 Options
    const [options, setOptions] = useState([
        { key: "A", text: "" },
        { key: "B", text: "" },
        { key: "C", text: "" },
        { key: "D", text: "" },
    ]);

    // Keys
    const [singleKey, setSingleKey] = useState("A");
    const [complexKeys, setComplexKeys] = useState<string[]>(["A", "B"]);

    const [explanation, setExplanation] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Sync submaterials when subject changes
    React.useEffect(() => {
        const list = DEFAULT_SUBMATERIALS[subjectId] || [];
        setSubmaterials(list);
        if (list.length > 0) {
            setSubmaterialId(String(list[0].id));
            setSubmaterialName(list[0].title);
            setMaterialName(list[0].material_title || "");
        }
    }, [subjectId]);

    const handleSubmaterialChange = (idStr: string) => {
        setSubmaterialId(idStr);
        const found = submaterials.find((s) => String(s.id) === idStr);
        if (found) {
            setSubmaterialName(found.title);
            setMaterialName(found.material_title || "");
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
            if (complexKeys.length >= 2) return; // exactly 2 keys max
            setComplexKeys([...complexKeys, key]);
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!questionText.trim()) {
            setErrorMsg("Teks pertanyaan wajib diisi.");
            return;
        }
        if (options.some((opt) => !opt.text.trim())) {
            setErrorMsg(
                "Harap lengkapi seluruh alternatif pilihan jawaban A sampai D.",
            );
            return;
        }
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

        const isRecall = bankType === "RECALL";

        const payload = {
            bank_type: bankType,
            subject_id: Number(subjectId),
            sub_material_id: isRecall ? null : Number(submaterialId),
            cognitive_level_id: isRecall ? null : Number(cognitiveLevel),
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
            // Backward-compatible properties
            bankType,
            subjectId: Number(subjectId),
            materialName: isRecall ? "" : materialName,
            submaterialName: isRecall ? "" : submaterialName,
            cognitiveLevel: isRecall ? null : Number(cognitiveLevel),
            questionType,
            questionFormat: question_format,
            questionText,
            correctAnswer:
                questionType === "PG_TUNGGAL" ? singleKey : complexKeys,
            imageUrl,
            isActive: true,
        };

        try {
            await api.admin.createQuestion(payload);
            setSuccessMsg("Butir soal berhasil ditambahkan ke Bank Soal!");
            setTimeout(() => router.push("/admin/bank-soal"), 1500);
        } catch (err: any) {
            setErrorMsg(err.message || "Gagal menyimpan soal baru.");
        } finally {
            setSubmitting(false);
        }
    };

    if (
        !isLoading &&
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
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Manajemen Bank
                    Soal
                </Link>

                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        Formulir Pembuatan Butir Soal Baru
                    </h1>
                    <p className="mt-1 text-xs text-slate-600">
                        Dukung bentuk soal Pilihan Ganda Tunggal dan Pilihan
                        Ganda Kompleks (MCMA) dengan 2 kunci jawaban benar.
                    </p>
                </div>

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

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Metadata Section */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                            1. Metadata & Klasifikasi Butir Soal
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">
                                    Bank Sasaran
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
                                    Mata Pelajaran
                                </label>
                                <select
                                    value={subjectId}
                                    onChange={(e) =>
                                        setSubjectId(e.target.value)
                                    }
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs"
                                >
                                    <option value="1">Matematika SMP</option>
                                    <option value="2">
                                        Bahasa Indonesia SMP
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700">
                                    Tingkat Kognitif
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
                                        Level 1 - Pemahaman (Knowing / Recall)
                                    </option>
                                    <option value="2">
                                        Level 2 - Aplikasi (Applying)
                                    </option>
                                    <option value="3">
                                        Level 3 - Penalaran (Reasoning / HOTS)
                                    </option>
                                </select>
                                {bankType === "RECALL" && (
                                    <span className="text-[10px] text-amber-700 mt-1 block">
                                        Tidak berlaku untuk Bank Recall (UCS-10)
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">
                                    Submateri Pokok
                                </label>
                                <select
                                    value={submaterialId}
                                    onChange={(e) =>
                                        handleSubmaterialChange(e.target.value)
                                    }
                                    disabled={bankType === "RECALL"}
                                    className={`mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none shadow-xs ${
                                        bankType === "RECALL"
                                            ? "opacity-50 cursor-not-allowed bg-slate-50"
                                            : ""
                                    }`}
                                >
                                    {submaterials.map((sm, smIdx) => (
                                        <option
                                            key={sm.id || `sm-${smIdx}`}
                                            value={sm.id}
                                        >
                                            {sm.material_title
                                                ? `[${sm.material_title}] `
                                                : ""}
                                            {sm.title}
                                        </option>
                                    ))}
                                </select>
                                {bankType === "RECALL" && (
                                    <span className="text-[10px] text-amber-700 mt-1 block">
                                        Tidak berlaku untuk Bank Recall (UCS-10)
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700">
                                    Materi Pokok (Terpilih)
                                </label>
                                <input
                                    type="text"
                                    value={
                                        bankType === "RECALL"
                                            ? "-"
                                            : materialName
                                    }
                                    disabled
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Type selector */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                Bentuk Butir Soal
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                                    <input
                                        type="radio"
                                        name="qType"
                                        checked={questionType === "PG_TUNGGAL"}
                                        onChange={() =>
                                            setQuestionType("PG_TUNGGAL")
                                        }
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <span>
                                        Pilihan Ganda Tunggal (1 Kunci Benar)
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                                    <input
                                        type="radio"
                                        name="qType"
                                        checked={questionType === "PG_KOMPLEKS"}
                                        onChange={() =>
                                            setQuestionType("PG_KOMPLEKS")
                                        }
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    <span>
                                        Pilihan Ganda Kompleks / MCMA (Kunci
                                        Jamak)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Stimulus & Question Content */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                            2. Stimulus & Teks Pertanyaan
                        </h3>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700">
                                Stimulus / Narasi Bacaan (Opsional)
                            </label>
                            <textarea
                                rows={3}
                                value={stimulus}
                                onChange={(e) => setStimulus(e.target.value)}
                                placeholder="Tuliskan teks bacaan kontekstual, kutipan wacana, atau petunjuk skenario..."
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700">
                                Teks Pokok Soal (Prompt)
                            </label>
                            <textarea
                                rows={3}
                                value={questionText}
                                onChange={(e) =>
                                    setQuestionText(e.target.value)
                                }
                                placeholder="Tuliskan kalimat pertanyaan yang jelas, lugas, dan terbebas dari ambiguitas..."
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

                    {/* Options & Answer Keys */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <h3 className="text-sm font-bold text-slate-900">
                                3. Opsi Alternatif & Kunci Jawaban
                            </h3>
                            {questionType === "PG_KOMPLEKS" && (
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                                        complexKeys.length === 2
                                            ? "bg-purple-50 text-purple-700 border-purple-200"
                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                    }`}
                                >
                                    {complexKeys.length}/2 Kunci Dipilih{" "}
                                    {complexKeys.length === 2
                                        ? "✓"
                                        : "(Pilih 2)"}
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-500">
                            {questionType === "PG_TUNGGAL"
                                ? "Pilih satu radio button pada opsi yang menjadi kunci jawaban benar."
                                : "Centang kotak checkbox pada 2 opsi yang menjadi kunci jawaban benar (tepat 2 kunci)."}
                        </p>

                        <div className="space-y-3">
                            {options.map((opt, optIdx) => (
                                <div
                                    key={opt.key || `opt-${optIdx}`}
                                    className="flex items-center gap-3"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
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
                                        placeholder={`Teks pilihan jawaban ${opt.key}`}
                                        required
                                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-xs"
                                    />

                                    {questionType === "PG_TUNGGAL" ? (
                                        <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer px-2">
                                            <input
                                                type="radio"
                                                name="answerKeySingle"
                                                checked={singleKey === opt.key}
                                                onChange={() =>
                                                    setSingleKey(opt.key)
                                                }
                                                className="text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-[11px] font-semibold">
                                                Kunci
                                            </span>
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
                                                    ) && complexKeys.length >= 2
                                                }
                                                onChange={() =>
                                                    handleToggleComplexKey(
                                                        opt.key,
                                                    )
                                                }
                                                className="text-purple-600 rounded focus:ring-purple-500 disabled:opacity-40 disabled:cursor-not-allowed"
                                            />
                                            <span className="text-[11px] font-semibold">
                                                Kunci
                                            </span>
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Explanation Section */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 space-y-4 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                            4. Pembahasan Konseptual & Nalar
                        </h3>
                        <textarea
                            rows={4}
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            placeholder="Tuliskan pembahasan langkah-langkah solutif, konsep teoretis, dan alasan ilmiah yang mendasari kunci jawaban..."
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
                                    {options.map((opt, optIdx) => {
                                        const isKey =
                                            questionType === "PG_TUNGGAL"
                                                ? singleKey === opt.key
                                                : complexKeys.includes(opt.key);
                                        return (
                                            <div
                                                key={
                                                    opt.key ||
                                                    `opt-prev-${optIdx}`
                                                }
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
                            {submitting ? "Menyimpan..." : "Simpan Butir Soal"}
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
