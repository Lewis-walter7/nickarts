import { NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    // Rate limit: 5 attempts per IP per minute
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        ?? request.headers.get('x-real-ip')
        ?? 'unknown';

    const limit = rateLimit(ip, { limit: 5, windowMs: 60_000 });
    if (!limit.success) {
        const retryAfterSec = Math.ceil((limit.resetAt - Date.now()) / 1000);
        return NextResponse.json(
            { success: false, error: 'Too many login attempts. Please wait and try again.' },
            { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
        );
    }

    try {
        const body = await request.json();
        const { email, password } = body;

        await dbConnect();

        // Check if ANY user exists (to determine if we should auto-seed)
        // We'll trust the first user to be the admin. 
        // If we want to support multiple admins later, we can checking just by email.
        // But the prompt says "an admin is created", implying single or initial setup.
        // Let's stick to the "First Run" logic: If NO users exist, create this one.
        const userCount = await User.countDocuments();

        let user;

        if (userCount === 0) {
            // First run: Create the admin
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await User.create({
                email: email,
                password: hashedPassword
            });
            console.log("Initial admin user created:", email);
        } else {
            // Normal login: Find by email
            user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 });
            }
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
            await setAdminSession(user._id.toString());
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}