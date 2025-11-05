import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { verifyToken } from '../../../../../lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to get token from cookie or Authorization header
    let token = request.cookies.get('token')?.value;
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
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

    // Find order without lean first
    const order = await Order.findById(params.id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Convert to plain object
    const orderObj = order.toObject();

    // Manually fetch user if order has a user field
    if (orderObj.user) {
      try {
        const user = await User.findById(orderObj.user).select('name email phone').lean();
        if (user) {
          orderObj.user = user;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        // Keep the order but with just the user ID
      }
    }

    return NextResponse.json({
      success: true,
      order: orderObj,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to get token from cookie or Authorization header
    let token = request.cookies.get('token')?.value;
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
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

    const body = await request.json();
    const { status, trackingNumber, notes } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (notes) updateData.notes = notes;

    // Add tracking update
    if (status) {
      const trackingUpdate = {
        status,
        message: `Order status updated to ${status}`,
        timestamp: new Date(),
      };
      updateData.$push = { trackingUpdates: trackingUpdate };
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Convert to plain object
    const orderObj = order.toObject();

    // Manually fetch user if order has a user field
    if (orderObj.user) {
      try {
        const user = await User.findById(orderObj.user).select('name email phone').lean();
        if (user) {
          orderObj.user = user;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        // Keep the order but with just the user ID
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: orderObj,
    });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
