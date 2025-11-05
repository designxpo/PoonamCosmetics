import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();
    
    const totalOrders = await Order.countDocuments({});
    const orders = await Order.find({}).select('orderNumber status createdAt user').limit(5).lean();
    
    return NextResponse.json({
      success: true,
      totalOrders,
      sampleOrders: orders,
      message: `Found ${totalOrders} orders in database`,
    });
  } catch (error: any) {
    console.error('Error counting orders:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
