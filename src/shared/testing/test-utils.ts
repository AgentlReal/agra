import { vi } from "vitest";
import { AuthenticatedUser, SessionContext, UserRole } from "@/modules/auth/auth.types";
import { UnauthorizedError, ForbiddenError } from "@/shared/errors/app-error";

let currentMockUser: AuthenticatedUser | null = null;

export const defaultMockStudent: AuthenticatedUser = {
    id: "student-uuid-1",
    email: "siswa@example.com",
    name: "Siswa Penguji",
    username: "siswa_uji",
    role: "SISWA",
    emailVerified: true,
    image: null,
};

export const defaultMockCurriculum: AuthenticatedUser = {
    id: "admin-uuid-1",
    email: "kurikulum@example.com",
    name: "Admin Kurikulum",
    username: "tim_kurikulum",
    role: "TIM_KURIKULUM",
    emailVerified: true,
    image: null,
};

/**
 * Mengatur user yang sedang aktif untuk pengujian (atau null untuk unauthenticated)
 */
export function setMockSessionUser(user: AuthenticatedUser | null = defaultMockStudent) {
    currentMockUser = user;
}

/**
 * Menghapus mock session (menjadi unauthenticated / pengunjung tanpa login)
 */
export function clearMockSession() {
    currentMockUser = null;
}

/**
 * Mock implementasi modul auth.guard
 */
export function getMockSessionContext(): SessionContext | null {
    if (!currentMockUser) return null;
    return {
        user: currentMockUser,
        session: {
            id: "mock-session-id",
            token: "mock-session-token",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    };
}

export function mockRequireAuth(): SessionContext {
    const ctx = getMockSessionContext();
    if (!ctx) {
        throw new UnauthorizedError("Sesi Anda telah kedaluwarsa atau tidak valid");
    }
    return ctx;
}

export function mockRequireRole(allowedRoles: UserRole | UserRole[]): SessionContext {
    const ctx = mockRequireAuth();
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(ctx.user.role)) {
        throw new ForbiddenError("Anda tidak memiliki izin untuk mengakses resource ini");
    }
    return ctx;
}

/**
 * Helper untuk membuat Web Request standar dalam pengujian route handler
 */
export function createTestRequest(
    url: string,
    options: {
        method?: string;
        body?: unknown;
        headers?: Record<string, string>;
    } = {}
): Request {
    const { method = "GET", body, headers = {} } = options;
    const requestHeaders = new Headers(headers);

    let reqBody: string | undefined = undefined;
    if (body !== undefined && method !== "GET" && method !== "HEAD") {
        reqBody = JSON.stringify(body);
        if (!requestHeaders.has("content-type")) {
            requestHeaders.set("content-type", "application/json");
        }
    }

    const fullUrl = url.startsWith("http") ? url : `http://localhost:3000${url.startsWith("/") ? url : `/${url}`}`;

    return new Request(fullUrl, {
        method,
        headers: requestHeaders,
        body: reqBody,
    });
}

/**
 * Helper untuk membaca dan mem-parse respons API secara type-safe
 */
export async function parseApiResponse<T = any>(res: Response): Promise<{
    status: number;
    body: T;
}> {
    const json = await res.json();
    return {
        status: res.status,
        body: json,
    };
}
