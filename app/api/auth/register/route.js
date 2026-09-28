import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const requiredFields = ['name', 'email', 'password', 'phone', 'college', 'course', 'year'];
    for (const field of requiredFields) {
      if (!body[field] || !String(body[field]).trim()) {
        return NextResponse.json({ message: `${field} is required` }, { status: 400 });
      }
    }

    if (String(body.password).length < 6) {
      return NextResponse.json({ message: 'Password should be at least 6 characters long' }, { status: 400 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(body.email))) {
      return NextResponse.json({ message: 'Please enter a valid email' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: String(body.email).toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(String(body.password), 10);
    const user = await User.create({
      name: String(body.name).trim(),
      email: String(body.email).trim().toLowerCase(),
      password: hashedPassword,
      phone: String(body.phone).trim(),
      college: String(body.college).trim(),
      course: String(body.course).trim(),
      year: String(body.year).trim(),
      role: 'student',
    });

    return NextResponse.json({
      message: 'Student registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ message: 'Something went wrong during registration' }, { status: 500 });
  }
}
