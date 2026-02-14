'use client';

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors border border-red-500/20 hover:border-red-500/50 px-4 py-2 rounded-full"
        >
            Logout
        </button>
    );
}
