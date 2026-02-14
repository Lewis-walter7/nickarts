import dbConnect from "@/lib/db";
import GalleryWork from "@/models/GalleryWork";
import { notFound } from "next/navigation";
import GalleryDetailClient from "@/app/components/GalleryDetailClient";

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

async function getWork(id: string) {
    try {
        await dbConnect();
        const work = await GalleryWork.findById(id);
        if (!work) return null;
        return JSON.parse(JSON.stringify(work));
    } catch (error) {
        return null;
    }
}

export default async function GalleryDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const work = await getWork(id);

    if (!work) {
        notFound();
    }

    return <GalleryDetailClient work={work} />;
}
