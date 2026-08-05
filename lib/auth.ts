import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error(
        "JWT_SECRET is not defined. Set it in .env.local (see .env.example). " +
        "Generate one with: openssl rand -base64 32"
    );
}
if (secretKey.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters. Generate one with: openssl rand -base64 32");
}
const key = new TextEncoder().encode(secretKey);

export const ADMIN_COOKIE_NAME = "admin_session";
// 5 days in seconds
export const SESSION_DURATION = 60 * 60 * 24 * 5;

/** Shape of the JWT payload we issue. */
export interface AdminSession {
    userId: string;
}

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // Must be set explicitly. Without it the browser derives the path from the
    // request URI directory, which produces duplicate cookies scoped to e.g.
    // /gallery and nondeterministic reads.
    path: "/",
} as const;

export async function encrypt(payload: AdminSession) {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5d")
        .sign(key);
}

export async function decrypt(input: string): Promise<AdminSession | null> {
    try {
        const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
        if (typeof payload.userId !== "string" || payload.userId.length === 0) {
            return null;
        }
        return { userId: payload.userId };
    } catch {
        return null;
    }
}

export async function setAdminSession(userId: string) {
    const session = await encrypt({ userId });
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, session, {
        ...COOKIE_OPTIONS,
        expires: new Date(Date.now() + SESSION_DURATION * 1000),
    });
}

export async function deleteAdminSession() {
    const cookieStore = await cookies();
    // Overwrite with an expired cookie rather than delete(), so the same
    // name/path/attributes are targeted and no stale copy survives.
    cookieStore.set(ADMIN_COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

/**
 * Reads and verifies the session cookie. This only proves the token is validly
 * signed — it does NOT prove the user still exists. Route handlers and pages
 * that grant write access must use `requireAdmin()` from lib/require-admin.ts.
 */
export async function getSession(): Promise<AdminSession | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!session) return;

    const parsed = await decrypt(session);
    if (!parsed) return;

    const res = NextResponse.next();
    res.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: await encrypt(parsed),
        ...COOKIE_OPTIONS,
        expires: new Date(Date.now() + SESSION_DURATION * 1000),
    });
    return res;
}
