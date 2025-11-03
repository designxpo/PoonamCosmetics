import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export function generateToken(payload: any, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}
