'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch {
            setError('Could not reach the server. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900/50 p-8 rounded-3xl border border-white/5">
                <h1 className="text-2xl font-black text-white mb-6 text-center">Admin Access</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
                                Email
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                autoComplete="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-primary focus-ring transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-widest text-zinc-400">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-primary focus-ring transition-colors"
                            />
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="text-red-400 text-sm font-bold text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-dark font-bold py-3 rounded-xl hover:bg-primary-hover transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Checking…' : 'Unlock Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
}
