import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

// Cookie names follow the Better Auth convention documented in openapi/API.yaml
// securitySchemes: BetterAuthSessionCookie / BetterAuthSecureSessionCookie
const BETTER_AUTH_COOKIE_PREFIX = "better-auth";
const BETTER_AUTH_SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 604800 – matches Max-Age in API.yaml example
const _MOCK_SECRET_RAW = process.env.MOCK_AUTH_SECRET;
if (!_MOCK_SECRET_RAW) throw new Error("Missing env var: MOCK_AUTH_SECRET");
const MOCK_SECRET: string = _MOCK_SECRET_RAW;

/** Returns the session-cookie name that Better Auth would use for this request. */
function sessionCookieName(isSecure: boolean): string {
  const prefix = isSecure ? "__Secure-" : "";
  return `${prefix}${BETTER_AUTH_COOKIE_PREFIX}.session_token`;
}

/** Returns the dont_remember-cookie name (set when rememberMe=false). */
function dontRememberCookieName(isSecure: boolean): string {
  const prefix = isSecure ? "__Secure-" : "";
  return `${prefix}${BETTER_AUTH_COOKIE_PREFIX}.dont_remember`;
}

const accounts = [
  {
    id: "mock-student-1",
    username: "user",
    email: "user@example.com",
    name: "Siswa Demo",
    role: "SISWA",
    password: "Belajar1!",
  },
  {
    id: "mock-curriculum-1",
    username: "tim_kurikulum",
    email: "tim@example.com",
    name: "Tim Kurikulum Demo",
    role: "TIM_KURIKULUM",
    password: "Belajar1!",
  },
] as const;

function publicUser(account: (typeof accounts)[number]) {
  return {
    id: account.id,
    username: account.username,
    email: account.email,
    name: account.name,
    role: account.role,
  };
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function sign(payload: string) {
  return createHmac("sha256", MOCK_SECRET).update(payload).digest("base64url");
}

function readSession(request: NextRequest) {
  const isSecure = request.nextUrl.protocol === "https:";
  const cookieName = sessionCookieName(isSecure);
  const value = request.cookies.get(cookieName)?.value;
  if (!value) return null;

  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;

  const payload = value.slice(0, separator);
  const signature = Buffer.from(value.slice(separator + 1), "base64url");
  const expected = Buffer.from(sign(payload), "base64url");
  if (signature.length !== expected.length || !timingSafeEqual(signature, expected)) return null;

  try {
    const data: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data || typeof data !== "object" || !("sub" in data) || !("exp" in data)) return null;
    if (typeof (data as Record<string, unknown>).sub !== "string" || typeof (data as Record<string, unknown>).exp !== "number" || (data as { exp: number }).exp <= Date.now()) return null;
    const account = accounts.find((item) => item.id === (data as { sub: string }).sub);
    if (!account) return null;
    const user = publicUser(account);
    return { user, session: { userId: user.id, expiresAt: new Date((data as { exp: number }).exp).toISOString() } };
  } catch {
    return null;
  }
}

function unavailable() {
  return json({ code: "MOCK_AUTH_DISABLED", message: "Mock auth hanya tersedia saat development." }, 404);
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return unavailable();
  if (request.nextUrl.pathname !== "/api/mock/auth/get-session") return json({ code: "NOT_FOUND" }, 404);
  return json(readSession(request));
}

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return unavailable();

  if (request.nextUrl.pathname === "/api/mock/auth/sign-out") {
    const isSecure = request.nextUrl.protocol === "https:";
    const response = json({ success: true });
    // Clear both possible session cookies so logout works on HTTP and HTTPS
    const baseAttrs = { httpOnly: true, sameSite: "lax" as const, secure: isSecure, path: "/", maxAge: 0 };
    response.cookies.set(sessionCookieName(isSecure), "", baseAttrs);
    response.cookies.set(dontRememberCookieName(isSecure), "", baseAttrs);
    return response;
  }

  const byUsername = request.nextUrl.pathname === "/api/mock/auth/sign-in/username";
  const byEmail = request.nextUrl.pathname === "/api/mock/auth/sign-in/email";
  if (!byUsername && !byEmail) return json({ code: "NOT_FOUND" }, 404);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ code: "BAD_REQUEST", message: "Body JSON tidak valid." }, 400);
  }

  const identifier = body[byUsername ? "username" : "email"];
  if (typeof identifier !== "string" || typeof body.password !== "string") {
    return json({ code: "BAD_REQUEST", message: "Identitas dan password wajib diisi." }, 400);
  }

  const account = accounts.find((item) =>
    (byUsername ? item.username : item.email) === identifier.trim().toLowerCase(),
  );
  if (!account || account.password !== body.password) {
    return json({ code: "INVALID_CREDENTIALS", message: "Identitas atau password salah." }, 401);
  }

  const isSecure = request.nextUrl.protocol === "https:";
  const expiresAt = Date.now() + BETTER_AUTH_SESSION_MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ sub: account.id, exp: expiresAt })).toString("base64url");
  const user = publicUser(account);
  const response = json({ user, session: { userId: user.id, expiresAt: new Date(expiresAt).toISOString() } });

  // Follow the Better Auth cookie convention from openapi/API.yaml:
  // - rememberMe=true  → set Max-Age=604800 (session cookie name: better-auth.session_token)
  // - rememberMe=false → omit Max-Age + set better-auth.dont_remember (session cookie)
  const baseAttrs = { httpOnly: true, sameSite: "lax" as const, secure: isSecure, path: "/" };
  if (body.rememberMe === true) {
    response.cookies.set(sessionCookieName(isSecure), `${payload}.${sign(payload)}`, {
      ...baseAttrs,
      maxAge: BETTER_AUTH_SESSION_MAX_AGE,
    });
  } else {
    response.cookies.set(sessionCookieName(isSecure), `${payload}.${sign(payload)}`, baseAttrs);
    response.cookies.set(dontRememberCookieName(isSecure), "true", baseAttrs);
  }
  return response;
}
