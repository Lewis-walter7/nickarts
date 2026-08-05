'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface GalleryWork {
    _id: string;
    title: string;
    category: string;
    year: string;
    imageUrl?: string; // Backward compatibility
    images?: string[];
    description: string;
    price?: number;
    isSold?: boolean;
}

export default function Gallery() {
    const [works, setWorks] = useState<GalleryWork[]>([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                if (data.success) {
                    setWorks(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorks();
    }, []);

    const categories = ["All", ...new Set(works.map(w => w.category))];
    const filteredWorks = filter === "All" ? works : works.filter(w => w.category === filter);

    return (
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-dark">
            <main className="relative pt-32 pb-20 px-8 items-center max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="flex flex-col gap-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold tracking-widest text-primary uppercase w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Current Curation
                        </div>
                        <h1 className="text-6xl font-black tracking-tight leading-[0.9] text-white">
                            The <span className="text-primary accent-display">Collection.</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                aria-pressed={filter === cat}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all focus-ring ${filter === cat ? 'bg-primary text-dark' : 'glass text-zinc-400 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} aria-hidden className="animate-pulse">
                                <div className="aspect-[4/5] rounded-3xl bg-zinc-900/70 border border-white/5 mb-6" />
                                <div className="h-4 w-2/3 rounded bg-zinc-900/70 mb-2" />
                                <div className="h-3 w-1/3 rounded bg-zinc-900/70" />
                            </div>
                        ))}
                        <span className="sr-only">Loading collection…</span>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredWorks.map((work) => (
                            <Link key={work._id} href={`/gallery/${work._id}`} className="group cursor-pointer focus-ring rounded-3xl">
                                {/* Matted rather than cropped: the work is the product, so
                                    object-cover trimming its edges to fit the cell is not an option. */}
                                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden artwork-mat border border-white/5 mb-6 shadow-2xl transition-all group-hover:border-primary/30">
                                    <Image
                                        src={work.images?.[0] ?? work.imageUrl ?? '/hero-art.png'}
                                        alt={work.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                        className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-700"
                                    />
                                    <div className="absolute top-5 right-5 glass px-4 py-1.5 rounded-full text-[11px] font-black text-white uppercase tracking-widest">
                                        {work.category}
                                    </div>
                                    {work.isSold && (
                                        <div className="absolute top-5 left-5 bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-black text-white uppercase tracking-widest">
                                            Sold
                                        </div>
                                    )}
                                </div>

                                <div className="px-2">
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{work.title}</h3>
                                    <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest mt-1">
                                        {work.year} Edition {work.price ? `• KES ${work.price.toLocaleString()}` : ''}{work.isSold ? ' • Sold' : ''}
                                    </p>
                                    {/* Was a hover-only overlay, which put it permanently out of
                                        reach on touch devices. */}
                                    <p className="text-zinc-400 text-sm leading-relaxed mt-3 line-clamp-2">
                                        {work.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                        {works.length === 0 && (
                            <div className="col-span-full text-center text-zinc-400">
                                No works found in the collection.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
