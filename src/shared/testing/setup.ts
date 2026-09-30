import { vi, beforeEach } from "vitest";
import {
    getMockSessionContext,
    mockRequireAuth,
    mockRequireRole,
    setMockSessionUser,
    defaultMockStudent,
} from "./test-utils";

// Auto-mock auth guard secara global agar seluruh route handler dapat diuji tanpa koneksi database sesi
vi.mock("@/modules/auth/auth.guard", () => ({
    getSessionContext: vi.fn(async () => getMockSessionContext()),
    requireAuth: vi.fn(async () => mockRequireAuth()),
    requireRole: vi.fn(async (roles) => mockRequireRole(roles)),
}));

beforeEach(() => {
    // Reset mock session user ke default Siswa sebelum setiap test
    setMockSessionUser(defaultMockStudent);
    vi.clearAllMocks();
});
