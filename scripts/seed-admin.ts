/**
 * Creates or updates the admin account.
 *
 * This replaces the old behaviour where POST /api/auth/login would create an
 * admin whenever the users collection was empty — which meant the first person
 * to hit the endpoint on a fresh or mis-pointed database owned the CMS.
 *
 * Usage:
 *   bun run scripts/seed-admin.ts you@example.com
 *   bun run scripts/seed-admin.ts you@example.com --force   # reset an existing password
 *
 * The password is read from a hidden prompt so it never lands in shell history.
 * For CI/non-interactive use, set SEED_ADMIN_PASSWORD instead.
 */
import dotenv from 'dotenv';
import readline from 'node:readline';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });
if (!process.env.MONGODB_URI) {
    dotenv.config({ path: '.env' });
}

const MIN_PASSWORD_LENGTH = 12;

function promptHidden(question: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!process.stdin.isTTY) {
            reject(new Error('No TTY available. Set SEED_ADMIN_PASSWORD instead.'));
            return;
        }

        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const stdout = process.stdout;

        // Swallow echoed characters so the password is not shown as it is typed.
        const originalWrite = stdout.write.bind(stdout) as (...args: unknown[]) => boolean;
        const writable = stdout as unknown as { write: unknown };
        let muted = false;
        writable.write = (chunk: unknown, ...rest: unknown[]) => {
            if (muted && typeof chunk === 'string' && !chunk.includes('\n')) return true;
            return originalWrite(chunk, ...rest);
        };

        rl.question(question, (answer) => {
            muted = false;
            writable.write = originalWrite;
            originalWrite('\n');
            rl.close();
            resolve(answer);
        });
        muted = true;
    });
}

async function main() {
    const args = process.argv.slice(2);
    const force = args.includes('--force');
    const email = args.find((a) => !a.startsWith('--'))?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.error('Usage: bun run scripts/seed-admin.ts <email> [--force]');
        process.exit(1);
    }

    const password = process.env.SEED_ADMIN_PASSWORD ?? (await promptHidden(`Password for ${email}: `));

    if (password.length < MIN_PASSWORD_LENGTH) {
        console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
        process.exit(1);
    }

    // Imported lazily so the dotenv calls above run before lib/db reads process.env.
    const { default: dbConnect } = await import('../lib/db');
    const { default: User } = await import('../models/User');
    const mongoose = (await import('mongoose')).default;

    await dbConnect();

    const existing = await User.findOne({ email });

    if (existing && !force) {
        console.error(`An account already exists for ${email}. Re-run with --force to reset its password.`);
        await mongoose.disconnect();
        process.exit(1);
    }

    const hashed = await bcrypt.hash(password, 12);

    if (existing) {
        existing.password = hashed;
        await existing.save();
        console.log(`✅ Password reset for ${email}`);
    } else {
        await User.create({ email, password: hashed });
        console.log(`✅ Admin account created for ${email}`);
    }

    const total = await User.countDocuments();
    console.log(`   Users in database: ${total}`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
