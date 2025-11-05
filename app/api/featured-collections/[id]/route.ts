import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FeaturedCollection from '@/models/FeaturedCollection';
import { verifyToken } from '@/lib/auth';

// GET - Fetch featured collection by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    const collection = await FeaturedCollection.findById(id).populate('products');

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Featured collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      collection,
    });
  } catch (error: any) {
    console.error('Error fetching featured collection:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update featured collection (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = params;
    const body = await request.json();

    const collection = await FeaturedCollection.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('products');

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Featured collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      collection,
    });
  } catch (error: any) {
    console.error('Error updating featured collection:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete featured collection (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = params;

    const collection = await FeaturedCollection.findByIdAndDelete(id);

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Featured collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Featured collection deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting featured collection:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
