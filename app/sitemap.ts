import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import GalleryWork from '@/models/GalleryWork';

export const revalidate = 3600;

const BASE_URL = 'https://nickarts.com';

const STATIC_ROUTES = ['', '/gallery', '/about', '/contact', '/press', '/faq', '/privacy', '/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
    }));

    let workEntries: MetadataRoute.Sitemap = [];
    try {
        await dbConnect();
        const works = await GalleryWork.find({}, { _id: 1, createdAt: 1 })
            .sort({ createdAt: -1 })
            .lean<{ _id: unknown; createdAt?: Date }[]>();

        workEntries = works.map((work) => ({
            url: `${BASE_URL}/gallery/${String(work._id)}`,
            lastModified: work.createdAt ?? new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));
    } catch (error) {
        // A sitemap missing the works is better than a 500 on /sitemap.xml.
        console.error('Failed to add gallery works to sitemap:', error);
    }

    return [...staticEntries, ...workEntries];
}
