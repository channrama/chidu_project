import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Application from '@/models/Application';
import Room from '@/models/Room';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { user, error } = await requireAuth(['admin']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [totalStudents, totalApplications, pending, approved, rejected, availableRooms] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'PENDING' }),
      Application.countDocuments({ status: 'APPROVED' }),
      Application.countDocuments({ status: 'REJECTED' }),
      Room.countDocuments({ status: 'AVAILABLE' }),
    ]);

    return NextResponse.json({
      stats: {
        totalStudents,
        totalApplications,
        pending,
        approved,
        rejected,
        availableRooms,
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
