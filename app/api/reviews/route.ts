import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET /api/reviews - Get all reviews with filters
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product');
    const userId = searchParams.get('user');
    const status = searchParams.get('status') || 'approved';
    const rating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || '-createdAt'; // -createdAt, helpful, rating

    // Build query
    const query: any = {};

    if (productId) {
      query.product = productId;
    }

    if (userId) {
      query.user = userId;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (rating) {
      query.rating = parseInt(rating);
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Execute query with population
    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('product', 'name slug images')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Review.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch reviews',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review (authenticated users only)
export async function POST(request: Request) {
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

    const body = await request.json();
    const { product, rating, title, comment, images } = body;

    // Validate required fields
    if (!product || !rating || !title || !comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product, rating, title, and comment are required',
        },
        { status: 400 }
      );
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product,
      user: decoded.userId,
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already reviewed this product',
        },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      product,
      user: decoded.userId,
      rating,
      title,
      comment,
      images: images || [],
      status: 'pending', // Reviews need approval by default
    });

    // Populate user and product details
    await review.populate('user', 'name email');
    await review.populate('product', 'name slug');

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully. It will be visible after approval.',
        data: review,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already reviewed this product',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create review',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
