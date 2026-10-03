import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, BadRequestError } from "@/shared/errors/app-error";

const mockConn = { query: vi.fn(), execute: vi.fn() };

vi.mock("@/shared/db", () => ({
    query: vi.fn(),
    withTransaction: vi.fn(async (cb: (conn: typeof mockConn) => unknown) => cb(mockConn)),
}));

import { RecallRepository } from "./recall.repository";

describe("RecallRepository.upsertAnswer validasi", () => {
    let repo: RecallRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        repo = new RecallRepository();
    });

    it("harus melempar NotFoundError jika session_question_id asing (999999)", async () => {
        mockConn.query.mockResolvedValueOnce([[]]);

        await expect(repo.upsertAnswer(101, 999999, [1])).rejects.toBeInstanceOf(NotFoundError);
        expect(mockConn.execute).not.toHaveBeenCalled();
    });

    it("harus membatasi pencarian soal pada attemptId yang dikirim", async () => {
        mockConn.query.mockResolvedValueOnce([[]]);

        await expect(repo.upsertAnswer(101, 5, [1])).rejects.toBeInstanceOf(NotFoundError);
        const [sql, params] = mockConn.query.mock.calls[0];
        expect(sql).toContain("session_id = ?");
        expect(params).toEqual([5, 101]);
    });

    it("harus melempar BadRequestError jika opsi tidak milik soal tersebut", async () => {
        mockConn.query
            .mockResolvedValueOnce([[{ session_id: 101, question_id: 100 }]])
            .mockResolvedValueOnce([[{ id: 1 }]]);

        await expect(repo.upsertAnswer(101, 5, [1, 777])).rejects.toBeInstanceOf(BadRequestError);
        expect(mockConn.execute).not.toHaveBeenCalled();
    });

    it("harus melempar BadRequestError jika current_question_order melebihi total_questions sesi", async () => {
        mockConn.query.mockResolvedValueOnce([[{ session_id: 101, question_id: 100, total_questions: 2 }]]);

        await expect(repo.upsertAnswer(101, 5, [], true, 0, 9)).rejects.toBeInstanceOf(BadRequestError);
        expect(mockConn.execute).not.toHaveBeenCalled();
    });
});
