import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductSection from '@/models/ProductSection';
import { verifyToken } from '@/lib/auth';

// GET - Fetch product section by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    const section = await ProductSection.findById(id).populate('products');

    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Product section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      section,
    });
  } catch (error: any) {
    console.error('Error fetching product section:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update product section (Admin only)
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

    const section = await ProductSection.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('products');

    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Product section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      section,
    });
  } catch (error: any) {
    console.error('Error updating product section:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete product section (Admin only)
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

    const section = await ProductSection.findByIdAndDelete(id);

    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Product section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product section deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting product section:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
