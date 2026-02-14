'use client';

import { useState, useEffect } from 'react';
import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';

interface GalleryWork {
    _id: string;
    title: string;
    category: string;
    year: string;
    images: string[];
    description: string;
    price?: number;
}

export default function AdminPage() {
    const [works, setWorks] = useState<GalleryWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        year: new Date().getFullYear().toString(),
        images: [] as string[],
        description: '',
        price: '',
    });

    const fetchWorks = async () => {
        try {
            const response = await fetch('/api/gallery');
            const data = await response.json();
            if (data.success) {
                setWorks(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch works", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.images.length === 0) {
            alert("Please upload at least one image.");
            return;
        }

        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: formData.price ? parseFloat(formData.price) : undefined,
                }),
            });

            if (res.ok) {
                setFormData({
                    title: '',
                    category: '',
                    year: new Date().getFullYear().toString(),
                    images: [],
                    description: '',
                    price: '',
                });
                fetchWorks();
                alert("Work added successfully!");
            } else {
                alert("Failed to add work.");
            }
        } catch (error) {
            console.error("Error adding work", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this work?")) return;

        try {
            const res = await fetch(`/api/gallery/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchWorks();
            } else {
                alert("Failed to delete work");
            }
        } catch (error) {
            console.error("Error deleting work", error);
        }
    }

    const removeImage = (indexToRemove: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, index) => index !== indexToRemove),
        });
    };

    return (
        <div className="grid lg:grid-cols-2 gap-12">
            {/* Add New Work Form */}
            <div className="bg-zinc-900/50 p-8 rounded-3xl border border-white/5 h-fit">
                <h2 className="text-2xl font-bold text-white mb-6">Add New Masterpiece</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">Upload Artwork (Max 10)</label>
                        <div className="border-2 border-dashed border-zinc-700 rounded-2xl p-8 bg-zinc-900/50 hover:bg-zinc-900 transition-all">
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                    {formData.images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                            <Image src={img} alt={`Preview ${idx}`} fill className="object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-center">
                                <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                        if (res) {
                                            const newImages = res.map(r => r.url);
                                            setFormData({ ...formData, images: [...formData.images, ...newImages] });
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        alert(`ERROR! ${error.message}`);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Year</label>
                            <input
                                type="text"
                                required
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Category</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Sculpture"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Price (Optional)</label>
                            <input
                                type="number"
                                placeholder="e.g. 5000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Describe the artwork..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 resize-none"
                        />
                    </div>

                    <button type="submit" className="w-full cursor-pointer bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-hover transition-all">
                        Add to Gallery
                    </button>
                </form>
            </div>

            {/* Existing Works List */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Existing Collection</h2>
                {loading ? (
                    <p className="text-zinc-500">Loading collection...</p>
                ) : (
                    <div className="space-y-4">
                        {works.map((work) => (
                            <div key={work._id} className="bg-zinc-900/30 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                                        {work.images && work.images[0] ? (
                                            <Image src={work.images[0]} alt={work.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">{work.title}</h3>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider">{work.category} • {work.year} {work.price ? `• $${work.price}` : ''}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(work._id)}
                                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                    </button>
                                </div>
                                {work.description && (
                                    <p className="text-sm text-zinc-400 pl-20 pr-4 line-clamp-2">{work.description}</p>
                                )}
                            </div>
                        ))}
                        {works.length === 0 && (
                            <div className="text-center p-12 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-600">
                                No works found. Add your first masterpiece.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
