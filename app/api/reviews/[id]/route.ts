import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

// GET /api/reviews/[id] - Get a specific review
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const reviewId = params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const review = await Review.findById(reviewId)
      .populate('user', 'name email')
      .populate('product', 'name slug images')
      .lean();

    if (!review) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch review',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] - Update a review (owner or admin)
export async function PUT(
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

    // Check if user is owner or admin
    const isOwner = review.user.toString() === decoded.userId;
    const isAdmin = decoded.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // If admin, allow status changes and admin response
    if (isAdmin) {
      if (body.status) {
        review.status = body.status;
      }
      if (body.adminResponse) {
        review.adminResponse = {
          message: body.adminResponse,
          respondedAt: new Date(),
        };
      }
    }

    // Allow owner to update their review content (if not approved yet or if admin)
    if (isOwner && (review.status === 'pending' || isAdmin)) {
      if (body.rating !== undefined) review.rating = body.rating;
      if (body.title) review.title = body.title;
      if (body.comment) review.comment = body.comment;
      if (body.images) review.images = body.images;
    }

    await review.save();

    // Populate before sending response
    await review.populate('user', 'name email');
    await review.populate('product', 'name slug');

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update review',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Delete a review (owner or admin)
export async function DELETE(
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

    // Check if user is owner or admin
    const isOwner = review.user.toString() === decoded.userId;
    const isAdmin = decoded.role === 'admin';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    await Review.findByIdAndDelete(reviewId);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete review',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
