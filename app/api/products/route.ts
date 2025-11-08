import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Brand from '@/models/Brand';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    // Check MongoDB connection
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database is not configured. Please add MONGODB_URI to environment variables.' 
        },
        { status: 500 }
      );
    }

    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'createdAt';
    const showAll = searchParams.get('showAll'); // For admin panel

    const query: any = showAll === 'true' ? {} : { isActive: true };

    // Handle multiple categories (comma-separated)
    if (categoryParam) {
      const categories = categoryParam.split(',').filter(Boolean);
      if (categories.length > 0) {
        // Check if they're ObjectIds or slugs
        const isObjectId = categories.every(cat => /^[0-9a-fA-F]{24}$/.test(cat));
        
        if (!isObjectId) {
          // Convert slugs to IDs
          const categoryDocs = await Category.find({ slug: { $in: categories } });
          const categoryIds = categoryDocs.map(cat => cat._id);
          query.category = { $in: categoryIds };
        } else {
          query.category = { $in: categories };
        }
      }
    }

    // Handle brand filter
    if (brandParam) {
      // Resolve brand slug to ID
      const brand = await Brand.findOne({ slug: brandParam });
      if (brand) {
        query.brand = brand._id;
      }
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (page - 1) * limit;

    // Determine sort order
    let sortOption: any = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'name-asc':
        sortOption = { name: 1 };
        break;
      case 'name-desc':
        sortOption = { name: -1 };
        break;
      case 'createdAt':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('brand', 'name slug logo')
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    
    // Provide detailed error message
    let errorMessage = 'Failed to fetch products';
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check MongoDB connection
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { success: false, error: 'Database is not configured' },
        { status: 500 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { name, description, price, category, brand, images, stock, featured, isActive } = body;

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      category,
      brand: brand || undefined,
      images: images || [],
      stock: stock || 0,
      featured: featured || false,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({
      success: true,
      product,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
