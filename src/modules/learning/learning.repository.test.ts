import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, BadRequestError } from "@/shared/errors/app-error";

const mockConn = { query: vi.fn(), execute: vi.fn() };

vi.mock("@/shared/db", () => ({
    query: vi.fn(),
    withTransaction: vi.fn(async (cb: (conn: typeof mockConn) => unknown) => cb(mockConn)),
}));

import { LearningRepository } from "./learning.repository";

describe("LearningRepository.upsertAnswer validasi", () => {
    let repo: LearningRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        repo = new LearningRepository();
    });

    it("harus melempar NotFoundError jika session_question_id asing (999999)", async () => {
        mockConn.query.mockResolvedValueOnce([[]]);

        await expect(repo.upsertAnswer(201, 999999, [1])).rejects.toBeInstanceOf(NotFoundError);
        expect(mockConn.execute).not.toHaveBeenCalled();
    });

    it("harus membatasi pencarian soal pada attemptId yang dikirim", async () => {
        mockConn.query.mockResolvedValueOnce([[]]);

        await expect(repo.upsertAnswer(201, 5, [1])).rejects.toBeInstanceOf(NotFoundError);
        const [sql, params] = mockConn.query.mock.calls[0];
        expect(sql).toContain("session_id = ?");
        expect(params).toEqual([5, 201]);
    });

    it("harus melempar BadRequestError jika opsi tidak milik soal tersebut", async () => {
        mockConn.query
            .mockResolvedValueOnce([[{ session_id: 201, question_id: 100, question_order: 1 }]])
            .mockResolvedValueOnce([[{ id: 1 }]]);

        await expect(repo.upsertAnswer(201, 5, [1, 777])).rejects.toBeInstanceOf(BadRequestError);
        expect(mockConn.execute).not.toHaveBeenCalled();
    });

    it("harus melempar BadRequestError jika current_question_order melebihi total_questions sesi", async () => {
        mockConn.query.mockResolvedValueOnce([[{ session_id: 201, question_id: 100, question_order: 1, total_questions: 2 }]]);

        await expect(repo.upsertAnswer(201, 5, [], true, 0, 9)).rejects.toBeInstanceOf(BadRequestError);
        expect(mockConn.execute).not.toHaveBeenCalled();
    });
});
