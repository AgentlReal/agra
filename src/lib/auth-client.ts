import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

/**
 * Client instance Better Auth untuk tim Frontend.
 * Digunakan di Client Component (React) untuk login, register, cek session, dan logout.
 */
export const authClient = createAuthClient({
    plugins: [
        usernameClient(),
    ],
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
} = authClient;

/**
 * Memastikan path pengalihan (redirect) hanya menuju rute internal yang aman.
 */
export function sanitizeRedirectPath(rawPath?: string | null, fallback = "/dashboard"): string {
    if (
        typeof rawPath === "string" &&
        rawPath.startsWith("/") &&
        !rawPath.startsWith("//") &&
        !rawPath.startsWith("/login") &&
        !rawPath.startsWith("/register")
    ) {
        return rawPath;
    }
    return fallback;
}

/**
 * Memulai alur otorisasi Google OAuth 2.0 untuk pendaftaran maupun masuk akun siswa.
 * Pengguna baru otomatis diarahkan ke /onboarding, sedangkan pengguna lama ke rute tujuan.
 */
export async function signInWithGoogle(options?: {
    redirectPath?: string | null;
    errorCallbackURL?: string;
    staffMode?: boolean;
}): Promise<void> {
    const isStaffMode = Boolean(options?.staffMode);
    if (typeof document !== "undefined") {
        if (isStaffMode) {
            document.cookie = "agra_staff_login=1; path=/; max-age=300; SameSite=Lax";
        } else {
            document.cookie = "agra_staff_login=; path=/; max-age=0; SameSite=Lax";
        }
    }

    const defaultFallback = isStaffMode ? "/admin/dashboard" : "/dashboard";
    const callbackURL = sanitizeRedirectPath(options?.redirectPath, defaultFallback);
    const newUserCallbackURL = isStaffMode ? "/admin/dashboard" : "/onboarding";
    const errorCallbackURL =
        options?.errorCallbackURL ||
        (isStaffMode ? "/login?as=staff" : "/login");

    const res = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL,
        errorCallbackURL,
    });

    if (res?.error) {
        throw new Error(
            res.error.message || "Gagal menghubungkan ke layanan otorisasi Google."
        );
    }

    if (res?.data?.url && typeof window !== "undefined") {
        window.location.href = res.data.url;
    }
}
