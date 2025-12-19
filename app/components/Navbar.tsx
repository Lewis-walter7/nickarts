"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Press", href: "/press" },
        { name: "FAQ", href: "/faq" },
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-8 py-6 backdrop-blur-md bg-dark/20 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2 group relative z-[70]">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter uppercase text-white">N!ckArts</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/gallery"
                        className="hidden sm:flex px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all items-center gap-2"
                    >
                        View Collection
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden w-10 h-10 flex items-center justify-center text-white relative z-[70]"
                        aria-label="Toggle Menu"
                    >
                        <div className="w-6 h-5 relative flex flex-col justify-between">
                            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
                            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[50] md:hidden transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-dark/95 backdrop-blur-2xl" />
                <div className="relative h-full flex flex-col items-center justify-center p-8">
                    <div className="flex flex-col items-center gap-8">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`text-3xl font-black text-white hover:text-primary transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className={`mt-16 transition-all duration-500 delay-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <Link
                            href="/gallery"
                            onClick={() => setIsOpen(false)}
                            className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all flex items-center gap-2"
                        >
                            View Collection
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
