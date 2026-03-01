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
    isSold?: boolean;
}

const emptyForm = {
    title: '',
    category: '',
    year: new Date().getFullYear().toString(),
    images: [] as string[],
    description: '',
    price: '',
};

export default function AdminPage() {
    const [works, setWorks] = useState<GalleryWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [editingWork, setEditingWork] = useState<GalleryWork | null>(null);
    const [editForm, setEditForm] = useState({
        title: '',
        category: '',
        year: '',
        description: '',
        price: '',
    });
    const [saving, setSaving] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const fetchWorks = async () => {
        try {
            const response = await fetch('/api/gallery');
            const data = await response.json();
            if (data.success) setWorks(data.data);
        } catch (error) {
            console.error('Failed to fetch works', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWorks(); }, []);

    // --- ADD ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.images.length === 0) { alert('Please upload at least one image.'); return; }
        try {
            const res = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, price: formData.price ? parseFloat(formData.price) : undefined }),
            });
            if (res.ok) {
                setFormData({ ...emptyForm });
                fetchWorks();
                alert('Work added successfully!');
            } else { alert('Failed to add work.'); }
        } catch (error) { console.error('Error adding work', error); }
    };

    // --- DELETE ---
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this work?')) return;
        try {
            const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
            if (res.ok) fetchWorks();
            else alert('Failed to delete work');
        } catch (error) { console.error('Error deleting work', error); }
    };

    // --- TOGGLE SOLD ---
    const handleToggleSold = async (work: GalleryWork) => {
        setTogglingId(work._id);
        try {
            const res = await fetch(`/api/gallery/${work._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isSold: !work.isSold }),
            });
            if (res.ok) fetchWorks();
            else alert('Failed to update sold status');
        } catch (error) { console.error('Error updating sold status', error); }
        finally { setTogglingId(null); }
    };

    // --- EDIT ---
    const openEdit = (work: GalleryWork) => {
        setEditingWork(work);
        setEditForm({
            title: work.title,
            category: work.category,
            year: work.year,
            description: work.description,
            price: work.price?.toString() ?? '',
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWork) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/gallery/${editingWork._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editForm,
                    price: editForm.price ? parseFloat(editForm.price) : undefined,
                }),
            });
            if (res.ok) {
                setEditingWork(null);
                fetchWorks();
            } else { alert('Failed to update work'); }
        } catch (error) { console.error('Error updating work', error); }
        finally { setSaving(false); }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== indexToRemove) });
    };

    return (
        <div className="grid lg:grid-cols-2 gap-12">
            {/* Edit Modal */}
            {editingWork && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Edit Artwork</h2>
                            <button onClick={() => setEditingWork(null)} className="text-zinc-500 hover:text-white transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1">Title</label>
                                    <input required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1">Year</label>
                                    <input required value={editForm.year} onChange={e => setEditForm({ ...editForm, year: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1">Category</label>
                                    <input required value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-400 mb-1">Price (Optional)</label>
                                    <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} placeholder="e.g. 5000" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-1">Description</label>
                                <textarea required rows={4} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 resize-none" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setEditingWork(null)} className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all font-bold">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-all disabled:opacity-50">
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
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
                                    onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Title</label>
                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Year</label>
                            <input type="text" required value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Category</label>
                            <input type="text" required placeholder="e.g. Sculpture" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Price (Optional)</label>
                            <input type="number" placeholder="e.g. 5000" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">Description</label>
                        <textarea required rows={4} placeholder="Describe the artwork..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 resize-none" />
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
                            <div key={work._id} className={`bg-zinc-900/30 p-4 rounded-2xl border transition-all group ${work.isSold ? 'border-emerald-500/20 bg-emerald-950/10' : 'border-white/5 hover:border-white/10'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                                        {work.images?.[0] ? (
                                            <Image src={work.images[0]} alt={work.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Img</div>
                                        )}
                                        {work.isSold && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">SOLD</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-white truncate">{work.title}</h3>
                                            {work.isSold && (
                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">Sold</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider truncate">
                                            {work.category} • {work.year}{work.price ? ` • $${work.price.toLocaleString()}` : ''}
                                        </p>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {/* Mark Sold / Unsold */}
                                        <button
                                            onClick={() => handleToggleSold(work)}
                                            disabled={togglingId === work._id}
                                            title={work.isSold ? 'Mark as Available' : 'Mark as Sold'}
                                            className={`p-2 rounded-lg transition-colors ${work.isSold ? 'text-emerald-400 hover:text-zinc-400 hover:bg-zinc-800' : 'text-zinc-600 hover:text-emerald-400 hover:bg-emerald-400/10'}`}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 6 9 17l-5-5" />
                                            </svg>
                                        </button>
                                        {/* Edit */}
                                        <button
                                            onClick={() => openEdit(work)}
                                            title="Edit"
                                            className="p-2 text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(work._id)}
                                            title="Delete"
                                            className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {work.description && (
                                    <p className="text-sm text-zinc-400 pl-20 pr-4 mt-2 line-clamp-2">{work.description}</p>
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
