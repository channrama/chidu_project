import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { user, error } = await requireAuth(['student']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const currentUser = await User.findById(user.id).select('-password');

    return NextResponse.json({ user: currentUser });
  } catch (error) {
    console.error('Student profile error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
