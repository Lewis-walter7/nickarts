"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface GalleryWork {
    _id: string;
    title: string;
    category: string;
    year: string;
    images?: string[];
    imageUrl?: string;
    description: string;
    price?: number;
}

export default function GalleryDetailClient({ work }: { work: GalleryWork }) {
    // Handle backward compatibility
    const images = (work.images && work.images.length > 0)
        ? work.images
        : (work.imageUrl ? [work.imageUrl] : ['/placeholder.png']);

    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-white">
            <main className="relative pt-32 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
                <Link href="/gallery" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group">
                    <svg className="group-hover:-translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Back to Collection
                </Link>

                <div className="grid lg:grid-cols-12 gap-12 xl:gap-20">
                    {/* Main Image Column - Spans 7 cols */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] xl:w-[600px] xl:h-[600px] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl mx-auto lg:mx-0">
                            <Image
                                src={images[selectedIndex]}
                                alt={`${work.title} - View ${selectedIndex + 1}`}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Details Column - Spans 5 cols */}
                    <div className="lg:col-span-5 h-fit lg:sticky lg:top-32">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase w-fit mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {work.category}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[0.9] text-white mb-6">
                            {work.title}
                        </h1>

                        <div className="flex items-center gap-6 mb-8 text-zinc-400 font-medium">
                            <span>{work.year} Edition</span>
                            {work.price && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                    <span className="text-white font-bold text-xl">KES {work.price.toLocaleString()}</span>
                                </>
                            )}
                        </div>

                        {/* Thumbnails - Only show if > 1 image */}
                        {images.length > 1 && (
                            <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedIndex(idx)}
                                        className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all ${selectedIndex === idx ? 'ring-2 ring-primary ring-offset-2 ring-offset-dark' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="prose prose-invert prose-lg max-w-none text-zinc-300 leading-relaxed mb-12">
                            <p>{work.description}</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <a
                                href={`https://wa.me/+254720013389?text=${encodeURIComponent(`Hi, I'm interested in acquiring "${work.title}" by NickArts.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(37,211,102,0.2)] hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                                Inquire via WhatsApp
                            </a>
                            <a
                                href={`mailto:info@nickarts.com?subject=${encodeURIComponent(`Inquiry: ${work.title}`)}&body=${encodeURIComponent(`Hi, I'm interested in acquiring "${work.title}" (${work.year}). Please let me know if it's still available.`)}`}
                                className="w-full bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 group backdrop-blur-md border border-white/5"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                Inquire via Email
                            </a>
                        </div>

                        <div className="mt-8 p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
                            <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                                Authenticity Guaranteed
                            </h3>
                            <p className="text-xs text-zinc-500 leading-relaxed">
                                Verified by NickArts Studio. Includes physical certificate signed by the artist.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
