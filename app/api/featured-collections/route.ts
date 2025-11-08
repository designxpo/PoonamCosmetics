import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FeaturedCollection from '@/models/FeaturedCollection';
import { verifyToken } from '@/lib/auth';

// GET - Fetch all active featured collections
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const collections = await FeaturedCollection.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(3)
      .lean();

    return NextResponse.json({
      success: true,
      collections,
    });
  } catch (error: any) {
    console.error('Error fetching featured collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured collections' },
      { status: 500 }
    );
  }
}

// POST - Create a new featured collection (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication - check both cookie and Authorization header
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const {
      title,
      subtitle,
      image,
      link,
      backgroundColor = 'slate-200',
      isActive = true,
      order = 0,
    } = body;

    // Validation
    if (!title || !subtitle || !image || !link) {
      return NextResponse.json(
        { success: false, error: 'Title, subtitle, image, and link are required' },
        { status: 400 }
      );
    }

    const collection = await FeaturedCollection.create({
      title,
      subtitle,
      image,
      link,
      backgroundColor,
      isActive,
      order,
    });

    return NextResponse.json({
      success: true,
      collection,
      message: 'Featured collection created successfully',
    });
  } catch (error: any) {
    console.error('Error creating featured collection:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create featured collection' },
      { status: 500 }
    );
  }
}
