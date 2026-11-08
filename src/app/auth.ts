import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { createAuthMiddleware, APIError } from "better-auth/api";
import { createPool, RowDataPacket } from "mysql2/promise";

import { validatePasswordRules } from "@/shared/utils/validator";
import {
    isSmtpConfigured,
    sendPasswordResetEmail,
    sendVerificationEmail,
} from "@/lib/email";

const isProd = process.env.NODE_ENV === "production";
const authDbPool = createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.AUTH_DB_POOL_LIMIT) || (isProd ? 2 : 10),
    enableKeepAlive: true,
    timezone: "+07:00",
    decimalNumbers: true,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

function normalizeDisplayName(rawName: string | undefined | null, email?: string | null): string {
    const trimmed = (rawName || "").trim();
    if (trimmed.length >= 3) {
        const sliced = trimmed.slice(0, 30).trim();
        return sliced.length >= 3 ? sliced : "Siswa Baru";
    }

    const emailLocal = (email?.split("@")[0] || "").replace(/[^a-zA-Z0-9 ]/g, " ").trim();
    if (emailLocal.length >= 3) {
        return emailLocal.slice(0, 30).trim();
    }

    return "Siswa Baru";
}

/**
 * Pengecekan murni (read-only): apakah username sudah dipakai akun mana pun.
 * Tidak memiliki efek samping. Pembersihan akun belum terverifikasi dilakukan
 * secara eksplisit di hook `/sign-up/email` dan `mapProfileToUser`.
 */
async function isUsernameTaken(candidate: string): Promise<boolean> {
    const [rows] = await authDbPool.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE username = ? LIMIT 1",
        [candidate]
    );
    return Array.isArray(rows) && rows.length > 0;
}

async function generateUniqueUsername(email?: string | null): Promise<string> {
    const rawLocal = (email?.split("@")[0] || "siswa").toLowerCase();
    let sanitized = rawLocal
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");

    if (sanitized.length < 3) {
        sanitized = sanitized ? `siswa_${sanitized}` : "siswa_baru";
    }

    let baseCandidate = sanitized.slice(0, 16).replace(/_+$/g, "");
    if (baseCandidate.length < 3) {
        baseCandidate = "siswa_baru";
    }

    try {
        if (!(await isUsernameTaken(baseCandidate))) {
            return baseCandidate;
        }

        const prefix = sanitized.slice(0, 11).replace(/_+$/g, "") || "siswa";
        for (let attempt = 0; attempt < 10; attempt++) {
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            const candidate = `${prefix}_${randomSuffix}`.slice(0, 16);
            if (!(await isUsernameTaken(candidate))) {
                return candidate;
            }
        }
    } catch (err) {
        console.error("[AUTH] Gagal memeriksa keunikan username otomatis:", err);
    }

    const fallbackSuffix = Date.now().toString(36).replace(/[^a-z0-9]/g, "").slice(-8);
    return `siswa_${fallbackSuffix}`.slice(0, 16);
}

const isGoogleOAuthConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);
const isEmailVerificationRequired = process.env.REQUIRE_EMAIL_VERIFICATION !== "false";

function isSuperAdminAllowlisted(email?: string | null): boolean {
    if (!email) return false;
    const rawList = process.env.SUPERADMIN_EMAILS || "";
    const normalizedTarget = email.trim().toLowerCase();
    const allowlist = rawList
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);
    return allowlist.includes(normalizedTarget);
}

const fallbackBaseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
let configuredHost: string | null = null;
try {
    configuredHost = new URL(fallbackBaseUrl).host;
} catch {
    configuredHost = null;
}

export const auth = betterAuth({
    baseURL: {
        allowedHosts: [
            ...(configuredHost ? [configuredHost] : []),
            ...(process.env.NODE_ENV !== "production"
                ? ["localhost", "localhost:*", "127.0.0.1", "127.0.0.1:*"]
                : []),
        ],
        fallback: fallbackBaseUrl,
    },
    trustedOrigins: [
        fallbackBaseUrl,
        ...(process.env.NEXT_PUBLIC_API_URL ? [process.env.NEXT_PUBLIC_API_URL] : []),
        ...(process.env.NODE_ENV !== "production"
            ? [
                "http://localhost",
                "http://localhost:*",
                "http://127.0.0.1",
                "http://127.0.0.1:*",
            ]
            : []),
    ],
    rateLimit: {
        enabled: process.env.NODE_ENV === "production",
        window: 60,
        max: 100,
        customRules: {
            "/sign-in/email": { window: 60, max: 10 },
            "/sign-in/username": { window: 60, max: 10 },
            "/sign-up/email": { window: 60, max: 5 },
            "/request-password-reset": { window: 300, max: 3 },
            "/send-verification-email": { window: 300, max: 3 },
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
    user: {
        modelName: "users",
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "SISWA",
                required: false,
                input: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: isEmailVerificationRequired,
        revokeSessionsOnPasswordReset: true,
        minPasswordLength: 6,
        maxPasswordLength: 12,
        onExistingUserSignUp: async ({ user }, request) => {
            if (!user.emailVerified) {
                try {
                    await auth.api.sendVerificationEmail({
                        body: {
                            email: user.email,
                            callbackURL: "/verify-email-success",
                        },
                        headers: request?.headers,
                    });
                } catch (err) {
                    console.error("[AUTH] Gagal mengirim ulang email verifikasi:", err);
                }
            }
        },
        onPasswordReset: async ({ user }) => {
            if (user?.id && !user.emailVerified) {
                try {
                    await authDbPool.query(
                        "UPDATE users SET emailVerified = 1, updatedAt = NOW() WHERE id = ? AND emailVerified = 0",
                        [user.id]
                    );
                } catch (err) {
                    console.error("[AUTH] Gagal menandai emailVerified saat reset kata sandi:", err);
                }
            }
        },
        sendResetPassword: async ({ user, url, token }) => {
            await sendPasswordResetEmail({
                to: user.email,
                userName: user.name || "Siswa AGRA",
                resetUrl: url,
                token,
            });
        },
    },
    emailVerification: {
        sendOnSignUp: isEmailVerificationRequired,
        sendOnSignIn: true,
        autoSignInAfterVerification: false,
        expiresIn: 3600,
        sendVerificationEmail: async ({ user, url, token }) => {
            await sendVerificationEmail({
                to: user.email,
                userName: user.name || "Siswa AGRA",
                verificationUrl: url,
                token,
            });
        },
    },
    socialProviders: isGoogleOAuthConfigured
        ? {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                prompt: "select_account",
                mapProfileToUser: async (profile) => {
                    // Bersihkan akun siswa gantung (emailVerified = 0) agar pemilik asli Gmail
                    // tidak terhalang pencatutan email saat masuk dengan Google OAuth.
                    if (profile?.email && profile.email_verified !== false) {
                        try {
                            const normalizedEmail = profile.email.trim().toLowerCase();
                            const [rows] = await authDbPool.query<RowDataPacket[]>(
                                "SELECT id, emailVerified, role FROM users WHERE email = ? LIMIT 1",
                                [normalizedEmail]
                            );
                            const existing = rows[0];
                            if (
                                existing &&
                                isSuperAdminAllowlisted(normalizedEmail) &&
                                existing.role !== "SUPERADMIN"
                            ) {
                                await authDbPool.query(
                                    "UPDATE users SET role = 'SUPERADMIN', emailVerified = 1, updatedAt = NOW() WHERE id = ?",
                                    [existing.id]
                                );
                            } else if (existing && !existing.emailVerified && existing.role === "SISWA") {
                                await authDbPool.query("DELETE FROM user_profiles WHERE user_id = ?", [existing.id]);
                                await authDbPool.query("DELETE FROM account WHERE userId = ?", [existing.id]);
                                await authDbPool.query("DELETE FROM users WHERE id = ? AND emailVerified = 0", [existing.id]);
                            }
                        } catch (err) {
                            console.error("[AUTH] Gagal membersihkan akun belum terverifikasi:", err);
                        }
                    }
                    return {
                        image: undefined,
                    };
                },
            },
        }
        : undefined,
    plugins: [
        username({
            displayUsername: false,
        }),
    ],
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-in/social") {
                const body = (ctx.body && typeof ctx.body === "object") ? (ctx.body as Record<string, unknown>) : undefined;
                if (body?.provider === "google" && !isGoogleOAuthConfigured) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Otorisasi Google belum dikonfigurasi pada server. Pastikan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET telah diatur di .env.",
                        code: "GOOGLE_OAUTH_NOT_CONFIGURED",
                    });
                }
            } else if (ctx.path === "/sign-up/email") {
                if (process.env.NODE_ENV === "production" && isEmailVerificationRequired && !isSmtpConfigured()) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Layanan pengirim email verifikasi belum dikonfigurasi pada server. Silakan gunakan tombol Daftar dengan Akun Google.",
                        code: "SMTP_NOT_CONFIGURED",
                    });
                }
                const body = (ctx.body && typeof ctx.body === "object") ? (ctx.body as Record<string, unknown>) : undefined;
                const name = typeof body?.name === "string" ? body.name.trim() : "";
                if (!name || name.length < 3) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Nama wajib diisi minimal 3 karakter saat pendaftaran.",
                    });
                }
                if (name.length > 30) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Nama maksimal 30 karakter.",
                    });
                }
                const rawUsername = typeof body?.username === "string" ? body.username.trim().toLowerCase() : "";
                if (rawUsername && !/^[a-z0-9_]{3,16}$/.test(rawUsername)) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Username harus terdiri dari 3 - 16 karakter huruf kecil, angka, atau garis bawah (_).",
                        code: "INVALID_USERNAME",
                    });
                }
                const passwordCheck = validatePasswordRules(body?.password);
                if (!passwordCheck.isValid) {
                    throw new APIError("BAD_REQUEST", {
                        message: passwordCheck.message,
                        code: "INVALID_PASSWORD",
                    });
                }
                const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
                if (email) {
                    const [existingRows] = await authDbPool.query<RowDataPacket[]>(
                        "SELECT id, emailVerified, role FROM users WHERE email = ? LIMIT 1",
                        [email]
                    );
                    const existingUser = existingRows[0];
                    if (existingUser?.emailVerified) {
                        throw new APIError("BAD_REQUEST", {
                            message: "Email ini sudah terdaftar dan terverifikasi. Silakan langsung masuk melalui halaman Login.",
                            code: "USER_ALREADY_EXISTS",
                        });
                    }
                    // Jika akun siswa belum terverifikasi (emailVerified = 0), bersihkan record gantung
                    // agar pendaftaran ulang tidak ditolak oleh plugin username dan dapat memperbarui sandi baru.
                    if (existingUser && !existingUser.emailVerified && existingUser.role === "SISWA") {
                        await authDbPool.query("DELETE FROM user_profiles WHERE user_id = ?", [existingUser.id]);
                        await authDbPool.query("DELETE FROM account WHERE userId = ?", [existingUser.id]);
                        await authDbPool.query("DELETE FROM users WHERE id = ? AND emailVerified = 0", [existingUser.id]);
                    }
                }
                if (rawUsername) {
                    const [takenRows] = await authDbPool.query<RowDataPacket[]>(
                        "SELECT id, emailVerified, role FROM users WHERE LOWER(username) = ? LIMIT 1",
                        [rawUsername]
                    );
                    const takenUser = takenRows[0];
                    if (takenUser) {
                        if (!takenUser.emailVerified && takenUser.role === "SISWA") {
                            await authDbPool.query("DELETE FROM user_profiles WHERE user_id = ?", [takenUser.id]);
                            await authDbPool.query("DELETE FROM account WHERE userId = ?", [takenUser.id]);
                            await authDbPool.query("DELETE FROM users WHERE id = ? AND emailVerified = 0", [takenUser.id]);
                        } else {
                            throw new APIError("BAD_REQUEST", {
                                message: "Username ini sudah digunakan oleh pengguna lain. Silakan pilih username lain.",
                                code: "USERNAME_IS_ALREADY_TAKEN",
                            });
                        }
                    }
                }
                if (body) {
                    body.name = name;
                    if (rawUsername) {
                        body.username = rawUsername;
                    }
                }
            } else if (ctx.path === "/sign-in/email" || ctx.path === "/sign-in/username") {
                const body = (ctx.body && typeof ctx.body === "object") ? (ctx.body as Record<string, unknown>) : undefined;
                const identifier =
                    ctx.path === "/sign-in/email"
                        ? (typeof body?.email === "string" ? body.email.trim().toLowerCase() : "")
                        : (typeof body?.username === "string" ? body.username.trim().toLowerCase() : "");
                if (identifier) {
                    const [userRows] = await authDbPool.query<RowDataPacket[]>(
                        ctx.path === "/sign-in/email"
                            ? `SELECT u.id, u.email, u.role,
                                      EXISTS(
                                          SELECT 1 FROM account a
                                          WHERE a.userId = u.id AND a.providerId = 'credential' AND a.password IS NOT NULL
                                      ) AS has_password
                               FROM users u WHERE u.email = ? LIMIT 1`
                            : `SELECT u.id, u.email, u.role,
                                      EXISTS(
                                          SELECT 1 FROM account a
                                          WHERE a.userId = u.id AND a.providerId = 'credential' AND a.password IS NOT NULL
                                      ) AS has_password
                               FROM users u WHERE LOWER(u.username) = ? LIMIT 1`,
                        [identifier]
                    );
                    const matchedUser = userRows[0];
                    if (matchedUser && isSuperAdminAllowlisted(matchedUser.email) && matchedUser.role !== "SUPERADMIN") {
                        await authDbPool.query(
                            "UPDATE users SET role = 'SUPERADMIN', emailVerified = 1, updatedAt = NOW() WHERE id = ?",
                            [matchedUser.id]
                        );
                        matchedUser.role = "SUPERADMIN";
                    }
                    if (matchedUser && !matchedUser.has_password) {
                        const isStaff = matchedUser.role === "SUPERADMIN" || matchedUser.role === "TIM_KURIKULUM";
                        throw new APIError("BAD_REQUEST", {
                            message: isStaff
                                ? "Akun tim ini diaktifkan melalui Undangan Google dan belum memiliki kata sandi lokal. Silakan gunakan tombol 'Masuk dengan Akun Google' atau klik 'Lupa kata sandi?' untuk membuat kata sandi."
                                : "Akun ini terdaftar melalui Google dan belum memiliki kata sandi lokal. Silakan gunakan tombol 'Masuk dengan Akun Google' atau klik 'Lupa kata sandi?' untuk membuat kata sandi.",
                            code: "PASSWORD_NOT_SET",
                        });
                    }
                }
            } else if (ctx.path === "/change-password" || ctx.path === "/reset-password") {
                const body = (ctx.body && typeof ctx.body === "object") ? (ctx.body as Record<string, unknown>) : undefined;
                const passwordCheck = validatePasswordRules(body?.newPassword);
                if (!passwordCheck.isValid) {
                    throw new APIError("BAD_REQUEST", {
                        message: passwordCheck.message,
                        code: "INVALID_PASSWORD",
                    });
                }
            }
        }),
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user, ctx) => {
                    const isAllowlistedSuperAdmin = isSuperAdminAllowlisted(user.email);
                    const isOAuthCallback = typeof ctx?.path === "string" && ctx.path.startsWith("/callback");
                    const cookieHeader =
                        ctx?.request?.headers?.get("cookie") ||
                        ctx?.headers?.get("cookie") ||
                        "";
                    const isStaffLoginAttempt =
                        isOAuthCallback && /(?:^|;\s*)agra_staff_login=1(?:;|$)/.test(cookieHeader);

                    const currentRole =
                        typeof (user as Record<string, unknown>).role === "string"
                            ? String((user as Record<string, unknown>).role)
                            : "SISWA";
                    const resolvedRole = isAllowlistedSuperAdmin ? "SUPERADMIN" : currentRole;

                    if (isStaffLoginAttempt && resolvedRole === "SISWA") {
                        throw new APIError("FORBIDDEN", {
                            message:
                                "Email Google ini belum diundang sebagai Tim Kurikulum atau SuperAdmin. Hubungi SuperAdmin untuk mendapatkan undangan akses.",
                            code: "staff_not_invited",
                        });
                    }

                    const rawUsername = (user as Record<string, unknown>).username;
                    const existingUsername = typeof rawUsername === "string" ? rawUsername.trim() : "";
                    const finalUsername = existingUsername || (await generateUniqueUsername(user.email));
                    const normalizedName = normalizeDisplayName(user.name, user.email);

                    return {
                        data: {
                            ...user,
                            name: normalizedName,
                            username: finalUsername,
                            role: resolvedRole,
                            ...(isAllowlistedSuperAdmin ? { emailVerified: true } : {}),
                        },
                    };
                },
                after: async (user) => {
                    if (user && user.role === "SISWA") {
                        try {
                            await authDbPool.query(
                                "INSERT IGNORE INTO user_profiles (user_id, preset_avatar_id, current_milestone_tier_id, total_xp, is_recall_passed) VALUES (?, NULL, 1, 0, 0)",
                                [user.id]
                            );
                        } catch (e) {
                            console.error("Gagal auto-create profile siswa:", e);
                        }
                    }
                },
            },
        },
        session: {
            create: {
                before: async (session, ctx) => {
                    const isOAuthCallback = typeof ctx?.path === "string" && ctx.path.startsWith("/callback");
                    const cookieHeader =
                        ctx?.request?.headers?.get("cookie") ||
                        ctx?.headers?.get("cookie") ||
                        "";
                    const isStaffLoginAttempt =
                        isOAuthCallback && /(?:^|;\s*)agra_staff_login=1(?:;|$)/.test(cookieHeader);

                    const hasSuperAdminAllowlist = Boolean(process.env.SUPERADMIN_EMAILS?.trim());
                    if (session?.userId && (isStaffLoginAttempt || hasSuperAdminAllowlist)) {
                        const [rows] = await authDbPool.query<RowDataPacket[]>(
                            "SELECT id, email, role FROM users WHERE id = ? LIMIT 1",
                            [session.userId]
                        );
                        const userRow = rows[0];
                        if (userRow) {
                            if (isSuperAdminAllowlisted(userRow.email) && userRow.role !== "SUPERADMIN") {
                                await authDbPool.query(
                                    "UPDATE users SET role = 'SUPERADMIN', emailVerified = 1, updatedAt = NOW() WHERE id = ?",
                                    [userRow.id]
                                );
                            } else if (isStaffLoginAttempt && userRow.role === "SISWA") {
                                throw new APIError("FORBIDDEN", {
                                    message:
                                        "Akun Google ini terdaftar sebagai akun Siswa, bukan Tim Kurikulum atau SuperAdmin.",
                                    code: "student_account_on_staff_portal",
                                });
                            }
                        }
                    }
                },
                after: async (session) => {
                    if (session?.userId && session?.id) {
                        try {
                            // Pembatasan sesi bersamaan (BK-05: Single-Session Concurrency Control)
                            await authDbPool.query(
                                "DELETE FROM session WHERE userId = ? AND id != ?",
                                [session.userId, session.id]
                            );
                        } catch (e) {
                            console.error("Gagal mencabut sesi lama:", e);
                        }
                    }
                },
            },
        },
    },
    database: authDbPool,

    secret: process.env.BETTER_AUTH_SECRET,
});
