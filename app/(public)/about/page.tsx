import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Beyond the Canvas",
    description: "Discover the NickArts philosophy. A laboratory of contemporary expression in Nairobi, bridging the gap between mechanical textures and digital fluidity.",
};

export default function About() {
    return (
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-white">
            <main className="relative pt-32 pb-20 px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        The Sanctuary of Vision
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] text-white">
                        Beyond the <br />
                        <span className="text-primary italic">Canvas.</span>
                    </h1>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative rounded-3xl overflow-hidden aspect-square border border-white/5">
                        <Image
                            src="/studio-preview.png"
                            alt="Art Studio"
                            fill
                            className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60" />
                        <div className="absolute bottom-8 left-8 right-8 glass p-6 rounded-2xl">
                            <p className="text-sm font-medium text-zinc-300 italic">
                                "Art is not what you see, but what you make others see. Our studio is the crucible where vision meets industrial precision."
                            </p>
                            <p className="text-primary font-bold text-xs mt-4 uppercase tracking-widest">— The Founder</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white">The NickArts Philosophy</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Founded in Nairobi, NickArts is a laboratory of contemporary expression. We bridge the gap between traditional mechanical textures and digital fluidity.
                            </p>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Our process involves high-contrast layering, industrial pigment application, and a deep focus on atmospheric storytelling. Every piece is a unique dialogue between light and void.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                            <div>
                                <p className="text-3xl font-black text-primary">12+</p>
                                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Global Exhibitions</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-primary">2.5k</p>
                                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Private Collectors</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <section className="mt-20 grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Industrial Resilience", desc: "Using high-grade materials that withstand the test of time and environment." },
                        { title: "Atmospheric Flow", desc: "Capturing the intangible spirit of space through complex pigment layering." },
                        { title: "Digital Evolution", desc: "Pioneering the integration of physical masterpieces with digital ownership." }
                    ].map((value, i) => (
                        <div key={i} className="glass p-10 rounded-3xl group hover:border-primary/30 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                            <p className="text-zinc-500 leading-relaxed">{value.desc}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}
