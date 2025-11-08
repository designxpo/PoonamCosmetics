import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import mongoose from 'mongoose';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Find all products
    const products = await Product.find({}).lean();
    const fixed: string[] = [];
    const errors: string[] = [];

    for (const product of products) {
      try {
        // Check if category is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(product.category)) {
          // Assume it's a slug, try to find the category
          const categorySlug = product.category.toString();
          const category = await Category.findOne({ slug: categorySlug });

          if (category) {
            // Update the product with the correct category ID
            await Product.findByIdAndUpdate(product._id, {
              category: category._id,
            });
            fixed.push(`${product.name} - Fixed category from "${categorySlug}" to ObjectId`);
          } else {
            errors.push(`${product.name} - Category slug "${categorySlug}" not found`);
          }
        }
      } catch (err: any) {
        errors.push(`${product.name} - Error: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product category fix complete',
      fixed: fixed.length,
      errors: errors.length,
      details: {
        fixed,
        errors,
      },
    });
  } catch (error: any) {
    console.error('Error fixing product categories:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
