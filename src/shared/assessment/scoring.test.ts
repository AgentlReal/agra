import { describe, it, expect, vi } from "vitest";
import { scoreQuestion, gradeSession } from "./scoring";
import { PoolConnection } from "mysql2/promise";

describe("Assessment Scoring Unit Tests", () => {
    describe("SINGLE_CHOICE", () => {
        it("harus memberi nilai 1.00 jika memilih 1 jawaban benar dan 0 salah", () => {
            const result = scoreQuestion({
                questionFormat: "SINGLE_CHOICE",
                totalCorrectOptions: 1,
                selectedCorrectCount: 1,
                selectedIncorrectCount: 0,
            });
            expect(result.score).toBe(1.0);
            expect(result.isCorrect).toBe(true);
        });

        it("harus memberi nilai 0.00 jika memilih jawaban yang salah", () => {
            const result = scoreQuestion({
                questionFormat: "SINGLE_CHOICE",
                totalCorrectOptions: 1,
                selectedCorrectCount: 0,
                selectedIncorrectCount: 1,
            });
            expect(result.score).toBe(0.0);
            expect(result.isCorrect).toBe(false);
        });

        it("harus memberi nilai 0.00 jika tidak menjawab", () => {
            const result = scoreQuestion({
                questionFormat: "SINGLE_CHOICE",
                totalCorrectOptions: 1,
                selectedCorrectCount: 0,
                selectedIncorrectCount: 0,
            });
            expect(result.score).toBe(0.0);
            expect(result.isCorrect).toBe(false);
        });
    });

    describe("COMPLEX_CHOICE (Partial Credit 0.50)", () => {
        it("harus memberi nilai 1.00 jika memilih tepat 2 jawaban benar dan 0 salah", () => {
            const result = scoreQuestion({
                questionFormat: "COMPLEX_CHOICE",
                totalCorrectOptions: 2,
                selectedCorrectCount: 2,
                selectedIncorrectCount: 0,
            });
            expect(result.score).toBe(1.0);
            expect(result.isCorrect).toBe(true);
        });

        it("harus memberi nilai 0.50 jika memilih 1 dari 2 jawaban benar dan 0 salah", () => {
            const result = scoreQuestion({
                questionFormat: "COMPLEX_CHOICE",
                totalCorrectOptions: 2,
                selectedCorrectCount: 1,
                selectedIncorrectCount: 0,
            });
            expect(result.score).toBe(0.5);
            expect(result.isCorrect).toBe(true);
        });

        it("harus memberi nilai 0.50 jika memilih 1 jawaban benar dan 1 jawaban salah", () => {
            const result = scoreQuestion({
                questionFormat: "COMPLEX_CHOICE",
                totalCorrectOptions: 2,
                selectedCorrectCount: 1,
                selectedIncorrectCount: 1,
            });
            expect(result.score).toBe(0.5);
            expect(result.isCorrect).toBe(true);
        });

        it("harus memberi nilai 0.00 jika hanya memilih jawaban salah", () => {
            const result = scoreQuestion({
                questionFormat: "COMPLEX_CHOICE",
                totalCorrectOptions: 2,
                selectedCorrectCount: 0,
                selectedIncorrectCount: 2,
            });
            expect(result.score).toBe(0.0);
            expect(result.isCorrect).toBe(false);
        });

        it("harus memberi nilai 0.00 jika tidak memilih jawaban sama sekali", () => {
            const result = scoreQuestion({
                questionFormat: "COMPLEX_CHOICE",
                totalCorrectOptions: 2,
                selectedCorrectCount: 0,
                selectedIncorrectCount: 0,
            });
            expect(result.score).toBe(0.0);
            expect(result.isCorrect).toBe(false);
        });
    });

    describe("gradeSession", () => {
        it("harus mengevaluasi seluruh butir sesi dan menghitung breakdown per mata pelajaran", async () => {
            const evalRows = [
                // Q1: SINGLE_CHOICE Benar -> 1.00 (Subject 1)
                {
                    session_question_id: 1,
                    student_answer_id: 101,
                    subject_id: 1,
                    question_format: "SINGLE_CHOICE" as const,
                    total_correct_options: 1,
                    selected_correct_count: 1,
                    selected_incorrect_count: 0,
                },
                // Q2: COMPLEX_CHOICE 1 benar -> 0.50 (Subject 1)
                {
                    session_question_id: 2,
                    student_answer_id: 102,
                    subject_id: 1,
                    question_format: "COMPLEX_CHOICE" as const,
                    total_correct_options: 2,
                    selected_correct_count: 1,
                    selected_incorrect_count: 0,
                },
                // Q3: COMPLEX_CHOICE 2 benar -> 1.00 (Subject 2)
                {
                    session_question_id: 3,
                    student_answer_id: 103,
                    subject_id: 2,
                    question_format: "COMPLEX_CHOICE" as const,
                    total_correct_options: 2,
                    selected_correct_count: 2,
                    selected_incorrect_count: 0,
                },
                // Q4: Belum dijawab -> 0.00 (Subject 2)
                {
                    session_question_id: 4,
                    student_answer_id: null,
                    subject_id: 2,
                    question_format: "SINGLE_CHOICE" as const,
                    total_correct_options: 1,
                    selected_correct_count: 0,
                    selected_incorrect_count: 0,
                },
            ];

            const mockConn = {
                query: vi.fn().mockResolvedValue([evalRows]),
                execute: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
            } as unknown as PoolConnection;

            const result = await gradeSession(mockConn, 999);

            // totalScore = 1.0 + 0.5 + 1.0 + 0.0 = 2.5
            expect(result.totalScore).toBe(2.5);
            expect(result.totalQuestions).toBe(4);
            // percentageScore = (2.5 / 4) * 100 = 62.5
            expect(result.percentageScore).toBe(62.5);
            expect(result.items).toHaveLength(4);
            expect(result.items[1].score).toBe(0.5);

            // Subject 1 (Q1 + Q2) = 1.0 + 0.5 = 1.5
            const subj1 = result.subjectBreakdown.get(1);
            expect(subj1?.total).toBe(2);
            expect(subj1?.correct).toBe(1.5);

            // Subject 2 (Q3 + Q4) = 1.0 + 0.0 = 1.0
            const subj2 = result.subjectBreakdown.get(2);
            expect(subj2?.total).toBe(2);
            expect(subj2?.correct).toBe(1.0);
        });
    });
});
