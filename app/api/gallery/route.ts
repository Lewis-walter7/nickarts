import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryWork from '@/models/GalleryWork';

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
    await dbConnect();

    try {
        const body = await request.json();
        const work = await GalleryWork.create(body);
        return NextResponse.json({ success: true, data: work }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create work' }, { status: 400 });
    }
}
