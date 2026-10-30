/**
 * Helper pengacakan opsi jawaban (A, B, C, D) unik per sesi attempt.
 * Menggunakan algoritma Fisher-Yates deterministik terikat seed (sessionId, questionId)
 * untuk memastikan opsi teracak unik per sesi namun tetap konsisten saat resume/refresh.
 */
export function shuffleOptionsDeterministically<T extends { id: number; option_label: string }>(
    options: T[],
    sessionId: number,
    questionId: number
): T[] {
    if (!options || options.length <= 1) return options;
    const labels = ["A", "B", "C", "D"];
    let seed = ((sessionId * 10007 + questionId * 37) ^ 0x5bf03635) >>> 0;
    const shuffled = [...options];

    for (let i = shuffled.length - 1; i > 0; i--) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const j = Math.floor((seed / 4294967296) * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }

    return shuffled.map((opt, idx) => ({
        ...opt,
        option_label: (labels[idx] || opt.option_label) as any,
    }));
}

