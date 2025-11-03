import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductSection from '@/models/ProductSection';
import Product from '@/models/Product';

// GET - Fetch product section with products
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sectionName = searchParams.get('section');

    if (!sectionName) {
      // Return all sections
      const sections = await ProductSection.find({ isActive: true })
        .sort({ order: 1 })
        .lean();

      return NextResponse.json({
        success: true,
        sections,
      });
    }

    // Find specific section
    const section: any = await ProductSection.findOne({ 
      name: sectionName,
      isActive: true,
    }).lean();

    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      );
    }

    // Fetch products for this section
    let products = [];
    if (section.productIds && section.productIds.length > 0) {
      products = await Product.find({
        _id: { $in: section.productIds },
        isActive: true,
      }).lean();
    } else {
      // Fallback: fetch products based on section type
      switch (sectionName) {
        case 'best-sellers':
          products = await Product.find({ featured: true, isActive: true })
            .limit(8)
            .lean();
          break;
        case 'new-arrivals':
          products = await Product.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .lean();
          break;
        case 'sale':
          products = await Product.find({ featured: true, isActive: true })
            .limit(8)
            .lean();
          break;
        default:
          products = await Product.find({ isActive: true })
            .limit(8)
            .lean();
      }
    }

    return NextResponse.json({
      success: true,
      section,
      products,
    });
  } catch (error: any) {
    console.error('Error fetching product section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product section' },
      { status: 500 }
    );
  }
}

// POST - Create or update a product section (Admin only)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const {
      name,
      title,
      description,
      productIds = [],
      isActive = true,
      order = 0,
    } = body;

    // Validation
    if (!name || !title) {
      return NextResponse.json(
        { success: false, error: 'Name and title are required' },
        { status: 400 }
      );
    }

    // Check if section exists
    const existingSection = await ProductSection.findOne({ name });

    if (existingSection) {
      // Update existing section
      existingSection.title = title;
      existingSection.description = description;
      existingSection.productIds = productIds;
      existingSection.isActive = isActive;
      existingSection.order = order;
      await existingSection.save();

      return NextResponse.json({
        success: true,
        section: existingSection,
        message: 'Product section updated successfully',
      });
    } else {
      // Create new section
      const section = await ProductSection.create({
        name,
        title,
        description,
        productIds,
        isActive,
        order,
      });

      return NextResponse.json({
        success: true,
        section,
        message: 'Product section created successfully',
      });
    }
  } catch (error: any) {
    console.error('Error managing product section:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to manage product section' },
      { status: 500 }
    );
  }
}
