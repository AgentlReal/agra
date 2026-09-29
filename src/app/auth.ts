import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
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
