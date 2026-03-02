import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryWork from '@/models/GalleryWork';
import { getSession } from '@/lib/auth';

export async function GET() {
    await dbConnect();

    try {
        const works = await GalleryWork.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: works });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch works' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    // Auth guard — only admins may create works
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const body = await request.json();
        const work = await GalleryWork.create(body);
        return NextResponse.json({ success: true, data: work }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create work' }, { status: 400 });
    }
}
