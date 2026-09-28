import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { user, error } = await requireAuth(['student']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const applications = await Application.find({ studentId: user.id }).sort({ submittedAt: -1 });
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Student my applications error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
