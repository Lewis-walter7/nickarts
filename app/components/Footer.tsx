import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-0 border-t border-white/5 py-10 px-8 bg-dark/50">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                <div className="col-span-2 space-y-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative w-15 h-15 group-hover:scale-110 transition-transform">
                            <Image
                                src="/logo.png"
                                alt="NickArts Logo"

                                unoptimized
                                className="object-cover"
                                height={130}
                                width={130}
                            />
                        </div>
                        <span className="text-lg font-bold tracking-tighter uppercase text-white">NickArts</span>
                    </Link>
                    <p className="text-zinc-500 max-w-sm leading-relaxed">
                        A premium art studio dedicated to transcending the boundaries of physical and digital expression. Based in the heart of contemporary Europe.
                    </p>
                    <div className="flex gap-4">
                        {[
                            { name: "Instagram", href: "https://www.instagram.com/wayneotanga/", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg> },
                            { name: "WhatsApp", href: "https://wa.me/+254720013389", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg> },
                            { name: "Phone", href: "tel:+254720013389", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.28a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg> },
                            { name: "TikTok", href: "https://tiktok.com/@nickarts19", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg> }
                        ].map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.name}
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-300"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em]">Explore</h4>
                    <ul className="space-y-4 text-zinc-500 text-sm">
                        <li><Link href="/gallery" className="hover:text-primary">View Collection</Link></li>
                        <li><Link href="/about" className="hover:text-primary">The Studio</Link></li>
                        <li><a href="#" className="hover:text-primary">Artists</a></li>
                        <li><a href="#" className="hover:text-primary">Exhibitions</a></li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em]">Connect</h4>
                    <ul className="space-y-4 text-zinc-500 text-sm">
                        <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                        <li><Link href="/contact" className="hover:text-primary">Acquire Art</Link></li>
                        <li><Link href="/press" className="hover:text-primary">Press Kit</Link></li>
                        <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                <p>NickArts &copy; 2025 All Rights Reserved</p>
                <div className="flex gap-8">
                    <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
