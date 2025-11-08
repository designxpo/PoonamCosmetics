import { NextResponse } from 'next/server';

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      mongodb: {
        configured: !!process.env.MONGODB_URI,
        value: process.env.MONGODB_URI ? '✓ Set (hidden)' : '✗ Not set',
      },
      cloudinary: {
        cloudName: {
          configured: !!process.env.CLOUDINARY_CLOUD_NAME,
          value: process.env.CLOUDINARY_CLOUD_NAME || '✗ Not set',
        },
        apiKey: {
          configured: !!process.env.CLOUDINARY_API_KEY,
          value: process.env.CLOUDINARY_API_KEY ? '✓ Set (hidden)' : '✗ Not set',
        },
        apiSecret: {
          configured: !!process.env.CLOUDINARY_API_SECRET,
          value: process.env.CLOUDINARY_API_SECRET ? '✓ Set (hidden)' : '✗ Not set',
        },
      },
      jwt: {
        configured: !!process.env.JWT_SECRET,
        value: process.env.JWT_SECRET ? '✓ Set (hidden)' : '✗ Not set',
      },
      nextauth: {
        secret: {
          configured: !!process.env.NEXTAUTH_SECRET,
          value: process.env.NEXTAUTH_SECRET ? '✓ Set (hidden)' : '✗ Not set',
        },
        url: {
          configured: !!process.env.NEXTAUTH_URL,
          value: process.env.NEXTAUTH_URL || '✗ Not set',
        },
      },
    },
    summary: {
      allConfigured: !!(
        process.env.MONGODB_URI &&
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.JWT_SECRET
      ),
    },
  };

  return NextResponse.json(diagnostics);
}
