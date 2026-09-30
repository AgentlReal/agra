import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { createAuthMiddleware } from "better-auth/api";
import { createPool } from "mysql2/promise";

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
    },
    plugins: [
        username({
            displayUsername: false,
        }),
    ],
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                if (ctx.body && typeof ctx.body === "object") {
                    if (!("name" in ctx.body) || !ctx.body.name) {
                        ctx.body.name = "";
                    }
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
                            name: user.name ?? "",
                        },
                    };
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
