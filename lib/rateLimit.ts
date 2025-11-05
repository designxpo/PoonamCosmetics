import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for multiple instances)
const rateLimitStore = new Map<string, RateLimitStore>();

const RATE_LIMIT = 100; // requests
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function rateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export function getRateLimitIdentifier(request: NextRequest): string {
  // Use IP address or user ID
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

export function rateLimitMiddleware(request: NextRequest) {
  const identifier = getRateLimitIdentifier(request);
  
  if (!rateLimit(identifier)) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Too many requests. Please try again later.' 
      },
      { status: 429 }
    );
  }

  return null; // Continue
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, WINDOW_MS);
