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
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-white">
            <main className="relative pt-32 pb-20 px-8 items-center max-w-7xl mx-auto">
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

                    <div className="flex flex-wrap gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === cat ? 'bg-primary text-white' : 'glass text-zinc-400 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="text-white text-center">Loading collection...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {filteredWorks.map((work) => (
                            <Link key={work._id} href={`/gallery/${work._id}`} className="group cursor-pointer">
                                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 mb-8 shadow-2xl transition-all group-hover:shadow-primary/10 group-hover:border-primary/20">
                                    <Image
                                        src={work.images && work.images.length > 0 ? work.images[0] : (work.imageUrl || '/placeholder.png')}
                                        alt={work.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute top-6 right-6 glass px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                        {work.category}
                                    </div>

                                    {/* Hover Description Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                        <p className="text-zinc-300 text-sm leading-relaxed line-clamp-4">
                                            {work.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-start px-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{work.title}</h3>
                                        <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mt-1">
                                            {work.year} Edition {work.price ? `• $${work.price.toLocaleString()}` : ''}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {works.length === 0 && (
                            <div className="col-span-full text-center text-zinc-500">
                                No works found in the collection.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
