import dbConnect from '@/lib/db';
import GalleryWork from '@/models/GalleryWork';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

async function getWorks() {
    try {
        await dbConnect();
        const works = await GalleryWork.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(works));
    } catch (error) {
        console.error('Failed to load works for the dashboard', error);
        return [];
    }
}

export default async function AdminPage() {
    return <AdminDashboard initialWorks={await getWorks()} />;
}
