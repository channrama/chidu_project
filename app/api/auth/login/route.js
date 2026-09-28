import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const requestedRole = String(body.role || 'student').toLowerCase();
    const user = await User.findOne({ email: String(body.email).toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    if (requestedRole === 'admin' && user.role !== 'admin') {
      return NextResponse.json({ message: 'This account is not authorized for admin access' }, { status: 403 });
    }

    if (requestedRole === 'student' && user.role !== 'student') {
      return NextResponse.json({ message: 'This account is not authorized for student access' }, { status: 403 });
    }

    const validPassword = await bcrypt.compare(String(body.password), user.password);
    if (!validPassword) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Something went wrong during login' }, { status: 500 });
  }
}
