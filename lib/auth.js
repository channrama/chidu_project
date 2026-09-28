import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'state-hostel-secret-key';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(allowedRoles = []) {
  const user = await getSessionUser();

  if (!user) {
    return { user: null, error: 'Unauthorized' };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return { user: null, error: 'Forbidden' };
  }

  return { user, error: null };
}
