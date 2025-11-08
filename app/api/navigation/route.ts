import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NavigationItem from '@/models/NavigationItem';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET all active navigation items
export async function GET() {
  try {
    await connectDB();
    const items = await NavigationItem.find({ isActive: true }).sort({ order: 1 });
    
    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST create new navigation item
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const item = await NavigationItem.create(body);
    
    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update navigation item
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    const item = await NavigationItem.findByIdAndUpdate(_id, updateData, { new: true });
    
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Navigation item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE navigation item
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
    
    await NavigationItem.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Navigation item deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
