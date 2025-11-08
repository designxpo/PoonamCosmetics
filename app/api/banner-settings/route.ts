import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BannerSettings from '@/models/BannerSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Fetch banner settings
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    if (section) {
      const settings = await BannerSettings.findOne({ section });
      
      if (!settings) {
        // Return default settings if none exist
        return NextResponse.json({
          success: true,
          settings: {
            section,
            textColor: '#FFFFFF',
            ctaBackgroundColor: 'transparent',
            ctaTextColor: '#FFFFFF',
            ctaBorderColor: '#FFFFFF',
            ctaHoverBackgroundColor: '#FFFFFF',
            ctaHoverTextColor: '#000000',
          },
        });
      }
      
      return NextResponse.json({
        success: true,
        settings,
      });
    }
    
    // Get all banner settings
    const allSettings = await BannerSettings.find({}).sort({ section: 1 });
    
    return NextResponse.json({
      success: true,
      settings: allSettings,
    });
  } catch (error: any) {
    console.error('Error fetching banner settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create or update banner settings
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { section, textColor, ctaBackgroundColor, ctaTextColor, ctaBorderColor, ctaHoverBackgroundColor, ctaHoverTextColor } = body;
    
    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Section is required' },
        { status: 400 }
      );
    }
    
    // Update or create
    const settings = await BannerSettings.findOneAndUpdate(
      { section },
      {
        textColor,
        ctaBackgroundColor,
        ctaTextColor,
        ctaBorderColor,
        ctaHoverBackgroundColor,
        ctaHoverTextColor,
        active: true,
      },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Banner settings updated successfully',
      settings,
    });
  } catch (error: any) {
    console.error('Error updating banner settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete banner settings
export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Section is required' },
        { status: 400 }
      );
    }
    
    await BannerSettings.findOneAndDelete({ section });
    
    return NextResponse.json({
      success: true,
      message: 'Banner settings deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting banner settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
