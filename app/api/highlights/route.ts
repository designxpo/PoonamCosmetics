import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HighlightBox from '@/models/HighlightBox';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET all active highlight boxes
export async function GET() {
  try {
    await connectDB();
    const highlights = await HighlightBox.find({ isActive: true }).sort({ order: 1 });
    
    return NextResponse.json({
      success: true,
      highlights,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST create new highlight box
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const highlight = await HighlightBox.create(body);
    
    return NextResponse.json({
      success: true,
      highlight,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update highlight box
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    const highlight = await HighlightBox.findByIdAndUpdate(_id, updateData, { new: true });
    
    if (!highlight) {
      return NextResponse.json(
        { success: false, message: 'Highlight not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      highlight,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE highlight box
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID is required' },
        { status: 400 }
      );
    }
    
    await HighlightBox.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Highlight deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
