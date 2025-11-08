import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FeatureBox from '@/models/FeatureBox';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET all active feature boxes
export async function GET() {
  try {
    await connectDB();
    const features = await FeatureBox.find({ isActive: true }).sort({ order: 1 });
    
    return NextResponse.json({
      success: true,
      features,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST create new feature box
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    const feature = await FeatureBox.create(body);
    
    return NextResponse.json({
      success: true,
      feature,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT update feature box
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    const feature = await FeatureBox.findByIdAndUpdate(_id, updateData, { new: true });
    
    if (!feature) {
      return NextResponse.json(
        { success: false, message: 'Feature not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      feature,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE feature box
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
    
    await FeatureBox.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Feature deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
