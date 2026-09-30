import { headers } from "next/headers";
import { auth } from "@/app/auth";
import { UnauthorizedError, ForbiddenError } from "@/shared/errors/app-error";
import { AuthenticatedUser, SessionContext, UserRole } from "./auth.types";

export async function getSessionContext(): Promise<SessionContext | null> {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
        headers: requestHeaders,
    });

    if (!session || !session.user) {
        return null;
    }

    const user: AuthenticatedUser = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        username: (session.user as unknown as { username?: string }).username || "",
        role: ((session.user as unknown as { role?: string }).role as UserRole) || "SISWA",
        emailVerified: session.user.emailVerified,
        image: session.user.image,
    };

    return {
        user,
        session: {
            id: session.session.id,
            token: session.session.token,
            expiresAt: new Date(session.session.expiresAt),
        },
    };
}

export async function requireAuth(): Promise<SessionContext> {
    const context = await getSessionContext();
    if (!context) {
        throw new UnauthorizedError("Sesi Anda telah kedaluwarsa atau tidak valid");
    }
    return context;
}

export async function requireRole(allowedRoles: UserRole | UserRole[]): Promise<SessionContext> {
    const context = await requireAuth();
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(context.user.role)) {
        throw new ForbiddenError("Anda tidak memiliki izin untuk mengakses resource ini");
    }

    return context;
}
