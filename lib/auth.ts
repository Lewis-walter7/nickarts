import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "default-secret-key-change-this";
const key = new TextEncoder().encode(secretKey);

export const ADMIN_COOKIE_NAME = "admin_session";
// 5 days in seconds
export const SESSION_DURATION = 60 * 60 * 24 * 5;

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("5d") // 5 days
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export async function setAdminSession(userId: string) {
    // Create the session
    const expires = new Date(Date.now() + SESSION_DURATION * 1000);
    const session = await encrypt({ userId, expires });

    // Save the session in a cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires,
        path: "/",
    });
}

export async function deleteAdminSession() {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!session) return;

    // Refresh logic if needed, but for 5-day fixed length, standard verify is enough.
    // We can re-sign if we want sliding expiration.
    const parsed = await decrypt(session);

    if (!parsed) return;

    const res = NextResponse.next();
    res.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: await encrypt(parsed),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + SESSION_DURATION * 1000),
    });
    return res;
}
