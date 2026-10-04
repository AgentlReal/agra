export interface CandidateQuestion {
    id: number;
    stimulus_id?: number | null;
    [key: string]: unknown;
}

export interface QuestionSelectionOptions {
    limit?: number;
    lastSeenMap?: Map<number, Date | number | string>;
    lastAttemptQuestionIds?: number[];
}

/**
 * Fisher-Yates shuffle untuk array
 */
function shuffleArray<T>(items: T[]): T[] {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Mengacak urutan soal dalam paket dengan tetap menjaga butir soal yang
 * berbagi stimulus yang sama agar disajikan berurutan (DOC-10 §5.4).
 */
export function shuffleKeepingStimulusGroups<T extends { stimulus_id?: number | null; [key: string]: unknown }>(
    items: T[]
): T[] {
    if (items.length <= 1) return [...items];

    const groups: T[][] = [];
    const stimulusGroupMap = new Map<number, T[]>();

    for (const item of items) {
        if (item.stimulus_id === null || item.stimulus_id === undefined) {
            groups.push([item]);
        } else {
            let group = stimulusGroupMap.get(item.stimulus_id);
            if (!group) {
                group = [];
                stimulusGroupMap.set(item.stimulus_id, group);
                groups.push(group);
            }
            group.push(item);
        }
    }

    const shuffledGroups = shuffleArray(groups);
    return shuffledGroups.flat();
}

/**
 * Memilih butir soal dengan algoritma Unseen-First -> LRU Rotation,
 * menjaga keutuhan kelompok stimulus, dan menjamin non-identik pada sesi remedial (DOC-10 §2).
 */
export function selectUnseenFirst<T extends CandidateQuestion>(
    candidates: T[],
    options: QuestionSelectionOptions = {}
): T[] {
    const limit = options.limit ?? 10;
    if (candidates.length <= limit) {
        return shuffleKeepingStimulusGroups(candidates);
    }

    const lastSeenMap = options.lastSeenMap ?? new Map<number, Date | number | string>();
    const lastAttemptSet = new Set(options.lastAttemptQuestionIds ?? []);

    // 1. Kelompokkan soal per stimulus (soal stimulus null = kelompok mandiri 1 butir)
    const groups: T[][] = [];
    const stimulusGroupMap = new Map<number, T[]>();

    for (const q of candidates) {
        if (q.stimulus_id === null || q.stimulus_id === undefined) {
            groups.push([q]);
        } else {
            let group = stimulusGroupMap.get(q.stimulus_id);
            if (!group) {
                group = [];
                stimulusGroupMap.set(q.stimulus_id, group);
                groups.push(group);
            }
            group.push(q);
        }
    }

    // 2. Tentukan waktu last_seen untuk tiap kelompok
    interface GroupMeta {
        group: T[];
        isUnseen: boolean;
        lastSeenTime: number; // 0 jika unseen, epoch ms jika pernah dilihat
    }

    const metas: GroupMeta[] = groups.map((group) => {
        let isUnseen = true;
        let maxSeenTime = 0;

        for (const item of group) {
            const seen = lastSeenMap.get(item.id);
            if (seen !== undefined && seen !== null) {
                isUnseen = false;
                const time = typeof seen === "number" ? seen : new Date(seen).getTime();
                if (time > maxSeenTime) {
                    maxSeenTime = time;
                }
            }
        }

        return {
            group,
            isUnseen,
            lastSeenTime: isUnseen ? 0 : maxSeenTime,
        };
    });

    // 3. Pisahkan unseen vs seen
    const unseenGroups = metas.filter((m) => m.isUnseen);
    const seenGroups = metas.filter((m) => !m.isUnseen);

    // Unseen diacak
    const shuffledUnseen = shuffleArray(unseenGroups);

    // Seen diurutkan berdasarkan LRU (waktu paling lampau / terkecil lebih dahulu)
    seenGroups.sort((a, b) => a.lastSeenTime - b.lastSeenTime);

    const orderedPool = [...shuffledUnseen, ...seenGroups];

    // 4. Pilih kelompok hingga memenuhi batas limit
    const selectedGroups: T[][] = [];
    let currentCount = 0;

    for (const meta of orderedPool) {
        if (currentCount >= limit) break;

        const groupSize = meta.group.length;
        if (currentCount + groupSize <= limit) {
            selectedGroups.push(meta.group);
            currentCount += groupSize;
        } else if (currentCount < limit) {
            // Kelompok melebihi sisa slot; ambil parsial jika tidak ada alternatif
            const needed = limit - currentCount;
            selectedGroups.push(meta.group.slice(0, needed));
            currentCount += needed;
        }
    }

    // 5. Jaminan Non-Identik pada Sesi Remedial (DOC-10 §2)
    // Jika seluruh soal yang terpilih 100% sama dengan attempt sebelumnya, dan bank memiliki soal lain, lakukan swap
    if (lastAttemptSet.size > 0 && selectedGroups.length > 0) {
        const flatSelectedIds = selectedGroups.flat().map((q) => q.id);
        const isIdentical = flatSelectedIds.length === lastAttemptSet.size &&
            flatSelectedIds.every((id) => lastAttemptSet.has(id));

        if (isIdentical) {
            const selectedSet = new Set(flatSelectedIds);
            const unusedQuestions = candidates.filter((c) => !selectedSet.has(c.id));

            if (unusedQuestions.length > 0) {
                // Tukar 1 butir terakhir dengan 1 butir yang belum terpilih
                const lastGroup = selectedGroups[selectedGroups.length - 1];
                lastGroup.pop();
                lastGroup.push(unusedQuestions[0]);
            }
        }
    }

    // 6. Susun urutan kelompok secara acak, namun tetap menjaga soal berstimulus tetap berurutan
    const shuffledFinalGroups = shuffleArray(selectedGroups);
    return shuffledFinalGroups.flat();
}
