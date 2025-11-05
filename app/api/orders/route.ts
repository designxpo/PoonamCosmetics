import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';

// Helper function to get token from request
function getTokenFromRequest(request: NextRequest) {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }
  
  // Try cookie as fallback
  const cookie = request.cookies.get('token');
  return cookie?.value || null;
}

// GET - Fetch orders
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const token = getTokenFromRequest(request);
    const userInfo = token ? verifyToken(token) : null;
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    // If order number is provided, fetch that specific order
    if (orderNumber) {
      const order = await Order.findOne({ orderNumber }).populate('items.product', 'name slug');
      
      if (!order) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        order,
      });
    }

    // If user is authenticated, fetch their orders
    if (userInfo) {
      const orders = await Order.find({ user: userInfo.userId })
        .populate('items.product', 'name slug')
        .sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        orders,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const token = getTokenFromRequest(request);
    const userInfo = token ? verifyToken(token) : null;
    const orderData = await request.json();

    const {
      items,
      totalAmount,
      deliveryAddress,
      deliveryCharge,
      paymentMethod,
      notes,
      guestInfo,
    } = orderData;

    // Validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
      return NextResponse.json(
        { success: false, message: 'Delivery address is required' },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      user: userInfo ? userInfo.userId : undefined,
      guestInfo: !userInfo ? guestInfo : undefined,
      items,
      totalAmount,
      deliveryAddress,
      deliveryCharge: deliveryCharge || 0,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      status: 'pending',
      notes,
      trackingUpdates: [
        {
          status: 'pending',
          message: 'Order placed successfully',
          timestamp: new Date(),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
