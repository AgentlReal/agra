import { auth } from "@/app/auth";
import { query } from "@/shared/db";
import { toNextJsHandler } from "better-auth/next-js";
import type { RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);

interface VerificationRow extends RowDataPacket {
    emailVerified: number | boolean;
}

export async function GET(req: NextRequest) {
    const url = new URL(req.url);

    if (url.pathname.endsWith("/verification-status")) {
        const rawIdentifier = (
            url.searchParams.get("email") ||
            url.searchParams.get("identifier") ||
            ""
        )
            .trim()
            .toLowerCase();

        if (!rawIdentifier) {
            return NextResponse.json(
                { verified: false },
                { headers: { "Cache-Control": "no-store, max-age=0" } }
            );
        }

        try {
            const isEmail = rawIdentifier.includes("@");
            const rows = await query<VerificationRow[]>(
                isEmail
                    ? "SELECT emailVerified FROM users WHERE email = ? LIMIT 1"
                    : "SELECT emailVerified FROM users WHERE username = ? LIMIT 1",
                [rawIdentifier]
            );
            return NextResponse.json(
                { verified: Boolean(rows[0]?.emailVerified) },
                { headers: { "Cache-Control": "no-store, max-age=0" } }
            );
        } catch {
            return NextResponse.json(
                { verified: false },
                { headers: { "Cache-Control": "no-store, max-age=0" } }
            );
        }
    }

    const rawResponse = await handlers.GET(req);

    if (url.pathname.includes("/callback/") && req.cookies.get("agra_staff_login")?.value) {
        const headers = new Headers(rawResponse.headers);
        headers.append(
            "Set-Cookie",
            "agra_staff_login=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
        );
        return new NextResponse(rawResponse.body, {
            status: rawResponse.status,
            statusText: rawResponse.statusText,
            headers,
        });
    }

    return rawResponse;
}

export async function POST(req: NextRequest) {
    const rawResponse = await handlers.POST(req);
    const url = new URL(req.url);

    if (url.pathname.endsWith("/sign-out")) {
        const isSecure = url.protocol === "https:";
        const response = new NextResponse(rawResponse.body, rawResponse);
        response.cookies.set("better-auth.session_token", "", {
            path: "/",
            maxAge: 0,
            expires: new Date(0),
            httpOnly: true,
            sameSite: "lax",
        });
        response.cookies.set("better-auth.session_data", "", {
            path: "/",
            maxAge: 0,
            expires: new Date(0),
            httpOnly: true,
            sameSite: "lax",
        });
        if (isSecure) {
            response.cookies.set("__Secure-better-auth.session_token", "", {
                path: "/",
                maxAge: 0,
                expires: new Date(0),
                httpOnly: true,
                secure: true,
                sameSite: "lax",
            });
            response.cookies.set("__Secure-better-auth.session_data", "", {
                path: "/",
                maxAge: 0,
                expires: new Date(0),
                httpOnly: true,
                secure: true,
                sameSite: "lax",
            });
        }
        return response;
    }

    return rawResponse;
}
