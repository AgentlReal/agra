import { auth } from "@/app/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
    const rawResponse = await handlers.POST(req);
    const url = new URL(req.url);

    if (url.pathname.endsWith("/sign-out")) {
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
        return response;
    }

    return rawResponse;
}
