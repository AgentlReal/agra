import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { createAuthMiddleware, APIError } from "better-auth/api";
import { createPool } from "mysql2/promise";

import { validatePasswordRules } from "@/shared/utils/validator";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    user: {
        modelName: "users",
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "SISWA",
                required: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        maxPasswordLength: 12,
    },
    plugins: [
        username({
            displayUsername: false,
        }),
    ],
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
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
                const passwordCheck = validatePasswordRules(body?.password);
                if (!passwordCheck.isValid) {
                    throw new APIError("BAD_REQUEST", {
                        message: passwordCheck.message,
                        code: "INVALID_PASSWORD",
                    });
                }
                if (body) {
                    body.name = name;
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
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            name: user.name?.trim() || user.name,
                        },
                    };
                },
                after: async (user) => {
                    if (user && user.role === "SISWA") {
                        try {
                            const pool = auth.options.database as any;
                            await pool.query(
                                "INSERT IGNORE INTO user_profiles (user_id, preset_avatar_id, current_milestone_tier_id, total_xp, is_recall_passed) VALUES (?, 1, 1, 0, 0)",
                                [user.id]
                            );
                        } catch (e) {
                            console.error("Gagal auto-create profile siswa:", e);
                        }
                    }
                },
            },
        },
    },
    database: createPool({
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        timezone: "+07:00",
    }),

    secret: process.env.BETTER_AUTH_SECRET,
});
