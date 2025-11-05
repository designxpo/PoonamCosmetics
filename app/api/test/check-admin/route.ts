import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const adminUser = await User.findOne({ email: 'admin@poonamcosmetics.com' }).lean() as any;
    
    if (!adminUser) {
      return NextResponse.json({
        success: false,
        message: 'Admin user not found',
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        hasRole: !!adminUser.role,
      },
      message: `Admin user found with role: ${adminUser.role || 'NO ROLE SET'}`,
    });
  } catch (error: any) {
    console.error('Error checking admin user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
