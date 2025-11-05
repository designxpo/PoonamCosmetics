import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

// POST /api/reviews/[id]/helpful - Mark review as helpful
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    await dbConnect();

    const reviewId = params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }

    // Toggle helpful status
    const userId = new mongoose.Types.ObjectId(decoded.userId);
    const alreadyMarked = review.helpfulBy.some((id: mongoose.Types.ObjectId) =>
      id.equals(userId)
    );

    if (alreadyMarked) {
      // Unmark as helpful
      review.helpfulBy = review.helpfulBy.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userId)
      );
    } else {
      // Mark as helpful
      review.helpfulBy.push(userId);
    }

    review.helpful = review.helpfulBy.length;
    await review.save();

    return NextResponse.json({
      success: true,
      message: alreadyMarked
        ? 'Review unmarked as helpful'
        : 'Review marked as helpful',
      data: {
        helpful: review.helpful,
        isMarkedByUser: !alreadyMarked,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to mark review as helpful',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
