import { NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp } from '@/lib/client-ip';

// A valid bcrypt hash of a throwaway string. Compared against when the email is
// unknown so that "no such user" costs the same ~100ms as a wrong password,
// removing the timing side channel that reveals which emails are registered.
const DUMMY_HASH = '$2b$10$51Sq1GhCyz7OhWyalf3dQu4GEGWOXTi5YcaR04spWLt5icXjqyowy';

// One message for every failure mode, so the response cannot be used to
// enumerate which email addresses have accounts.
const GENERIC_FAILURE = 'Invalid email or password';

export async function POST(request: Request) {
    const ip = clientIp(request);

    // Per-IP limit. x-forwarded-for is client-controllable, so this alone can be
    // sidestepped by rotating the header — hence the per-email limit below.
    const ipLimit = rateLimit(`login:ip:${ip}`, { limit: 5, windowMs: 60_000 });
    if (!ipLimit.success) {
        return tooManyAttempts(ipLimit.resetAt);
    }

    try {
        const body = await request.json();
        const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
        const password = typeof body?.password === 'string' ? body.password : '';

        if (!email || !password) {
            return NextResponse.json({ success: false, error: GENERIC_FAILURE }, { status: 401 });
        }

        // Per-account limit. Survives x-forwarded-for rotation, which is what
        // actually protects a known admin address from distributed guessing.
        const emailLimit = rateLimit(`login:email:${email}`, { limit: 10, windowMs: 15 * 60_000 });
        if (!emailLimit.success) {
            return tooManyAttempts(emailLimit.resetAt);
        }

        await dbConnect();

        // NOTE: there is deliberately no "create the admin if none exists" branch
        // here. Bootstrapping an admin is done out-of-band via `scripts/seed-admin.ts`.
        const user = await User.findOne({ email });

        // Always run a compare, even with no user, to keep timing flat.
        const isValid = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);

        if (!user || !isValid) {
            return NextResponse.json({ success: false, error: GENERIC_FAILURE }, { status: 401 });
        }

        await setAdminSession(user._id.toString());
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

function tooManyAttempts(resetAt: number) {
    const retryAfterSec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please wait and try again.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    );
}
