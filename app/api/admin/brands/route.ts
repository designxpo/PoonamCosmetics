import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    let token = request.cookies.get('token')?.value;
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const userRole = decoded?.role;

    if (!decoded || userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const brands = await Brand.find({})
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      brands,
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    let token = request.cookies.get('token')?.value;
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const userRole = decoded?.role;

    if (!decoded || userRole !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { name, slug, logo, description, isActive, order } = body;

    // Check if slug already exists
    const existingBrand = await Brand.findOne({ slug });
    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: 'Brand with this slug already exists' },
        { status: 400 }
      );
    }

    const brand = await Brand.create({
      name,
      slug,
      logo,
      description,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Brand created successfully',
      brand,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create brand' },
      { status: 500 }
    );
  }
}
