import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/db";
import GalleryWork from "@/models/GalleryWork";
import GalleryDetailClient from "@/app/components/GalleryDetailClient";

export const dynamic = 'force-dynamic';

interface Work {
    _id: string;
    title: string;
    category: string;
    year: string;
    images?: string[];
    imageUrl?: string;
    description: string;
    price?: number;
    isSold?: boolean;
}

// cache() dedupes the lookup between generateMetadata and the page body, which
// both run per request.
const getWork = cache(async (id: string): Promise<Work | null> => {
    if (!isValidObjectId(id)) return null;
    try {
        await dbConnect();
        const work = await GalleryWork.findById(id).lean();
        if (!work) return null;
        return JSON.parse(JSON.stringify(work));
    } catch (error) {
        console.error("Failed to fetch work", error);
        return null;
    }
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const work = await getWork(id);

    if (!work) return { title: "Work Not Found" };

    const image = work.images?.[0] ?? work.imageUrl;

    return {
        title: work.title,
        description: work.description.slice(0, 160),
        openGraph: {
            title: `${work.title} — NickArts`,
            description: work.description.slice(0, 200),
            type: "article",
            images: image ? [{ url: image, alt: work.title }] : undefined,
        },
    };
}

export default async function GalleryDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const work = await getWork(id);

    if (!work) {
        notFound();
    }

    return <GalleryDetailClient work={work} />;
}
