import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import PageBanner from '@/models/PageBanner';
import { verifyToken } from '../../../lib/auth';

// GET - Fetch page banner(s)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (page) {
      // Get specific page banner
      const banner = await PageBanner.findOne({ page, isActive: true });
      return NextResponse.json({
        success: true,
        banner: banner || null,
      });
    } else {
      // Get all page banners (for admin)
      const banners = await PageBanner.find({}).sort({ page: 1 });
      return NextResponse.json({
        success: true,
        banners,
      });
    }
  } catch (error: any) {
    console.error('Error fetching page banners:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create page banner (Admin only)
export async function POST(request: NextRequest) {
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
    const body = await request.json();

    // Check if banner for this page already exists
    const existingBanner = await PageBanner.findOne({ page: body.page });
    if (existingBanner) {
      return NextResponse.json(
        { success: false, error: `Banner for ${body.page} page already exists. Use PUT to update.` },
        { status: 400 }
      );
    }

    const banner = await PageBanner.create(body);

    return NextResponse.json({
      success: true,
      banner,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating page banner:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update page banner (Admin only)
export async function PUT(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const body = await request.json();

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page parameter is required' },
        { status: 400 }
      );
    }

    const banner = await PageBanner.findOneAndUpdate(
      { page },
      body,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Page banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      banner,
    });
  } catch (error: any) {
    console.error('Error updating page banner:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete page banner (Admin only)
export async function DELETE(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page parameter is required' },
        { status: 400 }
      );
    }

    const banner = await PageBanner.findOneAndDelete({ page });

    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Page banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Page banner deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting page banner:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
