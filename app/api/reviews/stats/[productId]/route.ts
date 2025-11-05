import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import mongoose from 'mongoose';

// GET /api/reviews/stats/[productId] - Get review statistics for a product
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    await dbConnect();

    const productId = params.productId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Calculate rating statistics
    const stats = await (Review as any).calculateProductRating(
      new mongoose.Types.ObjectId(productId)
    );

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch review statistics',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
