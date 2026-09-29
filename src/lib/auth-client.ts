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
