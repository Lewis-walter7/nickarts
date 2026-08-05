import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Press & Media Kit",
    description: "Official brand assets, high-resolution studio imagery, and storytelling resources for media collaborations.",
};

export default function PressKit() {
    const assets = [
        { title: "Brand Identity", desc: "Official logos, wordmarks, and typography guidelines.", format: "SVG / PNG" },
        { title: "Studio Curation", desc: "High-resolution photography of the Nairobi creative sanctuary.", format: "RAW / JPG" },
        { title: "Masterpiece Series", desc: "Curated selection of high-contrast works for publication.", format: "TIFF / JPG" }
    ];

    return (
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-dark">
            <main className="relative pt-32 pb-20 px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-20 text-center items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold tracking-widest text-primary uppercase w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Media Resources
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] text-white">
                        Press & <br />
                        <span className="text-primary accent-display">Identity Kit.</span>
                    </h1>
                    <p className="text-zinc-400 max-w-xl text-lg mt-4">
                        Everything you need to tell the NickArts story. High-resolution assets, official biographies, and professional guidelines.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    {/* Biography & Vision */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight">The NickArts Story</h2>
                            <div className="space-y-4 text-zinc-400 text-lg leading-relaxed">
                                <p>
                                    Inspired by travel, lived experience and the boundless pull of imagination, my work gathers moments from different places and culture, transforming this into visual story
                                </p>
                                <p>
                                    Working across oil, acrylic and charcoal, each piece explores emotion, memory and connection
                                </p>
                            </div>
                        </div>

                        <div className="glass p-10 rounded-3xl border border-white/5 space-y-6">
                            <h3 className="text-xl font-bold text-white">Media Inquiries</h3>
                            <p className="text-zinc-400">For exclusive interviews, feature requests, or collaboration proposals, please reach out to me personally.</p>
                            <a
                                href="https://www.instagram.com/wayneotanga/"
                                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
                            >
                                @wayneotanga
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Asset Downloads */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-8">Asset Curation</h2>
                        <div className="space-y-4">
                            {assets.map((asset, i) => (
                                <div key={i} className="glass p-8 rounded-3xl group hover:border-primary/30 transition-all border border-white/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold text-white">{asset.title}</h3>
                                            <p className="text-zinc-400 text-sm">{asset.desc}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">{asset.format}</p>
                                        </div>
                                    </div>
                                    {/* Assets are sent on request — there are no files to serve yet,
                                        so this links to contact instead of pretending to download. */}
                                    <Link
                                        href="/contact"
                                        className="block text-center w-full mt-4 bg-white/5 hover:bg-primary hover:text-dark border border-white/10 hover:border-primary py-4 rounded-xl text-zinc-300 text-sm font-bold uppercase tracking-widest transition-all focus-ring"
                                    >
                                        Request Assets
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="relative rounded-3xl overflow-hidden aspect-video border border-white/5 mt-12">
                            <Image
                                src="/studio-preview.png"
                                alt="NickArts Studio"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-80" />
                            <div className="absolute bottom-6 left-6 ring-1 ring-white/10 rounded-lg px-3 py-1 bg-dark/40 backdrop-blur-md text-[11px] font-bold text-white uppercase tracking-widest">
                                Studio Preview Portfolio
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
