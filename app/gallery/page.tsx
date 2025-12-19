import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "The Collection",
    description: "Explore the latest curation of high-contrast contemporary works by NickArts. Museum-grade physical masterpieces and digital rarities.",
};

export default function Gallery() {
    const works = [
        { title: "Obsidian Core I", category: "Sculpture", year: "2025" },
        { title: "Kinetic Drift", category: "Digital Art", year: "2024" },
        { title: "Cerulean Void", category: "Oil on Canvas", year: "2025" },
        { title: "Tectonic Shift", category: "Mixed Media", year: "2023" },
        { title: "Luminous Ether", category: "Digital Art", year: "2025" },
        { title: "Stark Horizon", category: "Acrylic on Steel", year: "2024" }
    ];

    return (
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-white">
            <main className="relative pt-32 pb-20 px-8 items-center mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="flex flex-col gap-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Current Curation
                        </div>
                        <h1 className="text-6xl font-black tracking-tight leading-[0.9] text-white">
                            The <span className="text-primary italic">Collection.</span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        {["All", "Physical", "Digital"].map((filter) => (
                            <button key={filter} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === "All" ? 'bg-primary text-white' : 'glass text-zinc-400 hover:text-white'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {works.map((work, i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 mb-8 shadow-2xl transition-all group-hover:shadow-primary/10 group-hover:border-primary/20">
                                <Image
                                    src="/hero-art.png"
                                    alt={work.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute top-6 right-6 glass px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                    {work.category}
                                </div>
                            </div>

                            <div className="flex justify-between items-start px-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{work.title}</h3>
                                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mt-1">{work.year} Edition</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
