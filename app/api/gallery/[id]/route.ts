import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GalleryWork from '@/models/GalleryWork';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();

    try {
        const work = await GalleryWork.findById(id);
        if (!work) {
            return NextResponse.json({ success: false, error: 'Work not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: work });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch work' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    await dbConnect();

    try {
        const deletedWork = await GalleryWork.findByIdAndDelete(id);

        if (!deletedWork) {
            return NextResponse.json({ success: false, error: 'Work not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete work' }, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();

    try {
        const body = await request.json();
        const updatedWork = await GalleryWork.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedWork) {
            return NextResponse.json({ success: false, error: 'Work not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedWork });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update work' }, { status: 400 });
    }
}
