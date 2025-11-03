import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import jwt from 'jsonwebtoken';

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    await dbConnect();

    const { orderNumber } = params;

    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Find the order
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order belongs to user (or is a guest order)
    if (order.user && order.user.toString() !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to cancel this order' },
        { status: 403 }
      );
    }

    // Check if order can be cancelled (only pending orders)
    if (order.status !== 'pending') {
      return NextResponse.json(
        { success: false, message: `Cannot cancel order with status: ${order.status}` },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    order.status = 'cancelled';
    order.trackingUpdates.push({
      status: 'cancelled',
      message: 'Order cancelled by customer',
      timestamp: new Date(),
    });

    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
