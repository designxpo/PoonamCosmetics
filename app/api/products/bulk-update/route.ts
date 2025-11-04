import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { productIds, action } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'activate':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { isActive: true } }
        );
        break;

      case 'deactivate':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { isActive: false } }
        );
        break;

      case 'feature':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { featured: true } }
        );
        break;

      case 'unfeature':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { $set: { featured: false } }
        );
        break;

      case 'delete':
        result = await Product.deleteMany(
          { _id: { $in: productIds } }
        );
        return NextResponse.json({
          success: true,
          modifiedCount: result.deletedCount,
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: any) {
    console.error('Error updating products:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
