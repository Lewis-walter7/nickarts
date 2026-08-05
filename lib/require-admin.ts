import { getSession, type AdminSession } from "./auth";
import dbConnect from "./db";
import User from "@/models/User";

/**
 * Verifies the session cookie AND that the user still exists. Sessions last five
 * days, so without the DB check a deleted admin keeps write access until their
 * token expires.
 *
 * Lives outside lib/auth.ts so proxy.ts, which only needs the JWT helpers, does
 * not pull Mongoose into its bundle.
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
