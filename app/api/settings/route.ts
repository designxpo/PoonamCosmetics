import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await dbConnect();

    let settings: any = await Settings.findOne().lean();

    // Create default settings if none exist
    if (!settings) {
      const newSettings = await Settings.create({
        whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999',
        deliveryCharge: parseInt(process.env.NEXT_PUBLIC_DELIVERY_CHARGE || '50'),
        freeDeliveryThreshold: parseInt(process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD || '999'),
        banners: [],
      });
      settings = newSettings.toObject();
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    let settings: any = await Settings.findOne();

    if (settings) {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        body,
        { new: true, runValidators: true }
      );
    } else {
      settings = await Settings.create(body);
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
