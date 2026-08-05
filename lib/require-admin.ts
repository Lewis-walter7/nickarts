import { getSession, type AdminSession } from "./auth";
import dbConnect from "./db";
import User from "@/models/User";

/**
 * Verifies the session cookie AND that the user still exists in the database.
 *
 * Checking the DB matters because sessions are valid for 5 days: without it, a
 * deleted or revoked admin keeps full write access until their token expires.
 *
 * Kept in its own module (rather than lib/auth.ts) so that proxy.ts — which
 * only needs the JWT helpers — does not pull Mongoose into its bundle.
 *
 * @returns the session if the caller is a live admin, otherwise null.
 */
export async function requireAdmin(): Promise<AdminSession | null> {
    const session = await getSession();
    if (!session?.userId) return null;

    try {
        await dbConnect();
        const exists = await User.exists({ _id: session.userId });
        return exists ? session : null;
    } catch {
        // Fail closed: if we cannot confirm the user exists, deny access.
        return null;
    }
}
