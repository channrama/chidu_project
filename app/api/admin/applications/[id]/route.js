import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { user, error } = await requireAuth(['admin']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const application = await Application.findById(params.id).populate('studentId', 'name email phone course year');
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Admin view application error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
