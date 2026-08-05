import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryWork from '@/models/GalleryWork';
import { requireAdmin } from '@/lib/require-admin';
import { parseGalleryPayload } from '@/lib/gallery-payload';

// Upper bound so a large collection can never return an unbounded document set.
const MAX_RESULTS = 200;

export async function GET() {
    try {
        await dbConnect();
        const works = await GalleryWork.find({})
            .sort({ createdAt: -1 })
            .limit(MAX_RESULTS)
            .lean();
        return NextResponse.json({ success: true, data: works });
    } catch (error) {
        console.error('Failed to fetch works:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch works' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // Confirms the session AND that the admin still exists in the database.
    const session = await requireAdmin();
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const parsed = parseGalleryPayload(await request.json(), { partial: false });
        if (!parsed.ok) {
            return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
        }

        await dbConnect();
        const work = await GalleryWork.create(parsed.value.set);
        return NextResponse.json({ success: true, data: work }, { status: 201 });
    } catch (error) {
        console.error('Failed to create work:', error);
        return NextResponse.json({ success: false, error: 'Failed to create work' }, { status: 400 });
    }
}
