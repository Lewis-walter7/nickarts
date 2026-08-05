import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { FeedbackProvider } from "@/app/components/Feedback";
import LogoutButton from "./LogoutButton";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Checks the user still exists, so deleting an admin row revokes access
    // immediately rather than when their 5-day token expires.
    const session = await requireAdmin();

    if (!session) {
        redirect("/admin/login");
    }

    return (
        <FeedbackProvider>
            <div className="min-h-screen bg-zinc-950 text-zinc-200">
                <div className="max-w-7xl mx-auto px-4 py-6 md:p-8">
                    <header className="mb-6 md:mb-10 border-b border-zinc-800 pb-5 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">NickArts <span className="text-primary accent-display">Admin</span></h1>
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors focus-ring rounded">← Back to Site</Link>
                            <LogoutButton />
                        </div>
                    </header>
                    {children}
                </div>
            </div>
        </FeedbackProvider>
    );
}
