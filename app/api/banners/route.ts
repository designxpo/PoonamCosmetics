import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';

// GET - Fetch all active banners
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const banners = await Banner.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      banners,
    });
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST - Create a new banner (Admin only)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      image,
      ctaText,
      ctaLink,
      textPosition = 'left',
      textColor = 'light',
      overlay = true,
      isActive = true,
      order = 0,
    } = body;

    // Validation
    if (!title || !image) {
      return NextResponse.json(
        { success: false, error: 'Title and image are required' },
        { status: 400 }
      );
    }

    const banner = await Banner.create({
      title,
      subtitle,
      description,
      image,
      ctaText,
      ctaLink,
      textPosition,
      textColor,
      overlay,
      isActive,
      order,
    });

    return NextResponse.json({
      success: true,
      banner,
      message: 'Banner created successfully',
    });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create banner' },
      { status: 500 }
    );
  }
}
