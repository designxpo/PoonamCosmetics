import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

// This endpoint should be called by a cron job every hour
// To auto-cancel pending orders older than 24 hours
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const cronSecret = request.headers.get('authorization');
    
    if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find all pending orders older than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pendingOrders = await Order.find({
      status: 'pending',
      createdAt: { $lt: twentyFourHoursAgo },
    });

    if (pendingOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending orders to cancel',
        cancelledCount: 0,
      });
    }

    // Update all pending orders to cancelled
    const cancelPromises = pendingOrders.map(async (order) => {
      order.status = 'cancelled';
      order.trackingUpdates.push({
        status: 'cancelled',
        message: 'Order auto-cancelled due to no confirmation within 24 hours',
        timestamp: new Date(),
      });
      return order.save();
    });

    await Promise.all(cancelPromises);

    return NextResponse.json({
      success: true,
      message: `Successfully cancelled ${pendingOrders.length} pending orders`,
      cancelledCount: pendingOrders.length,
      orderNumbers: pendingOrders.map(o => o.orderNumber),
    });
  } catch (error: any) {
    console.error('Error auto-cancelling orders:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to auto-cancel orders' },
      { status: 500 }
    );
  }
}
