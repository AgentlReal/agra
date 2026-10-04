import { describe, it, expect } from "vitest";
import { shuffleKeepingStimulusGroups, selectUnseenFirst } from "./question-selection";

describe("Question Selection Unit Tests", () => {
    describe("shuffleKeepingStimulusGroups", () => {
        it("harus menjaga butir-butir soal dari stimulus yang sama agar tetap berdampingan (kontigu)", () => {
            const questions = [
                { id: 1, stimulus_id: 10 },
                { id: 2, stimulus_id: 10 },
                { id: 3, stimulus_id: 10 },
                { id: 4, stimulus_id: null },
                { id: 5, stimulus_id: null },
                { id: 6, stimulus_id: 20 },
                { id: 7, stimulus_id: 20 },
            ];

            // Lakukan beberapa kali untuk memverifikasi keacakan sekaligus integritas grup
            for (let i = 0; i < 20; i++) {
                const shuffled = shuffleKeepingStimulusGroups(questions);
                expect(shuffled).toHaveLength(7);

                // Temukan indeks untuk soal stimulus 10
                const indices10 = shuffled
                    .map((q, idx) => (q.stimulus_id === 10 ? idx : -1))
                    .filter((idx) => idx !== -1);
                expect(indices10).toHaveLength(3);
                // Indeks harus berturutan (kontigu)
                expect(indices10[1]).toBe(indices10[0] + 1);
                expect(indices10[2]).toBe(indices10[1] + 1);

                // Temukan indeks untuk soal stimulus 20
                const indices20 = shuffled
                    .map((q, idx) => (q.stimulus_id === 20 ? idx : -1))
                    .filter((idx) => idx !== -1);
                expect(indices20).toHaveLength(2);
                expect(indices20[1]).toBe(indices20[0] + 1);
            }
        });
    });

    describe("selectUnseenFirst", () => {
        it("harus memprioritaskan butir soal yang belum pernah dilihat (unseen)", () => {
            const availableQuestions = [
                { id: 1, stimulus_id: null },
                { id: 2, stimulus_id: null },
                { id: 3, stimulus_id: null },
                { id: 4, stimulus_id: null },
                { id: 5, stimulus_id: null },
            ];

            // Siswa pernah melihat soal 1 dan 2
            const lastSeenMap = new Map<number, Date>([
                [1, new Date("2026-01-01")],
                [2, new Date("2026-01-02")],
            ]);

            // Ambil 3 butir soal
            const selected = selectUnseenFirst(availableQuestions, {
                limit: 3,
                lastSeenMap,
            });

            expect(selected).toHaveLength(3);
            const selectedIds = selected.map((q) => q.id);

            // Soal 3, 4, 5 (unseen) harus terpilih semua
            expect(selectedIds).toContain(3);
            expect(selectedIds).toContain(4);
            expect(selectedIds).toContain(5);
            expect(selectedIds).not.toContain(1);
            expect(selectedIds).not.toContain(2);
        });

        it("harus menjamin variasi kombinasi pada remedial jika bank mencukupi", () => {
            const availableQuestions = [
                { id: 1, stimulus_id: null },
                { id: 2, stimulus_id: null },
                { id: 3, stimulus_id: null },
                { id: 4, stimulus_id: null },
                { id: 5, stimulus_id: null },
            ];

            // Percobaan sebelumnya persis mengambil [1, 2, 3]
            const lastAttemptIds = [1, 2, 3];
            const lastSeenMap = new Map<number, Date>([
                [1, new Date("2026-01-03")],
                [2, new Date("2026-01-03")],
                [3, new Date("2026-01-03")],
            ]);

            const selected = selectUnseenFirst(availableQuestions, {
                limit: 3,
                lastSeenMap,
                lastAttemptQuestionIds: lastAttemptIds,
            });

            const selectedIds = selected.map((q) => q.id).sort();
            const lastIds = [...lastAttemptIds].sort();

            // Kombinasi tidak boleh 100% identik dengan percobaan terakhir
            expect(selectedIds).not.toEqual(lastIds);
        });
    });
});
