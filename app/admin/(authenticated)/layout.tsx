import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || !session.userId) {
        redirect("/admin/login");
    }

    // CRITICAL: Check if user actually exists in DB
    // This allows "immediate logout" if the user is deleted
    await dbConnect();
    const userExists = await User.findById(session.userId);

    if (!userExists) {
        redirect("/admin/login");
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-200">
            <div className="max-w-7xl mx-auto p-8">
                <header className="mb-12 border-b border-zinc-800 pb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-black tracking-tight text-white">NickArts <span className="text-primary italic">Admin</span></h1>
                    <div className="flex items-center gap-6">
                        <a href="/" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">Back to Site &rarr;</a>
                        <LogoutButton />
                    </div>
                </header>
                {children}
            </div>
        </div>
    );
}
