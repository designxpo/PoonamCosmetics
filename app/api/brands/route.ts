import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const showAll = searchParams.get('showAll');

    // For public view, only show active brands; for admin, show all
    const query = showAll === 'true' ? {} : { isActive: true };

    const brands = await Brand.find(query)
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
