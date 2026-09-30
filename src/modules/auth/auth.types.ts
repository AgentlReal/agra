export type UserRole = "SISWA" | "TIM_KURIKULUM";

export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
    username: string;
    role: UserRole;
    emailVerified: boolean;
    image?: string | null;
}

export interface SessionContext {
    user: AuthenticatedUser;
    session: {
        id: string;
        token: string;
        expiresAt: Date;
    };
}
