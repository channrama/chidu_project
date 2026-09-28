import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const { user, error } = await requireAuth(['admin']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);

    const filter = {};
    const status = searchParams.get('status');
    const hostel = searchParams.get('hostel');
    const gender = searchParams.get('gender');
    const course = searchParams.get('course');
    const year = searchParams.get('year');
    const search = searchParams.get('search');

    if (status) filter.status = status;
    if (hostel) filter['hostelDetails.preferredHostel'] = hostel;
    if (gender) filter['personalDetails.gender'] = gender;
    if (course) filter['academicDetails.course'] = { $regex: course, $options: 'i' };
    if (year) filter['academicDetails.year'] = { $regex: year, $options: 'i' };

    const applications = await Application.find(filter).populate('studentId', 'name email course year').sort({ submittedAt: -1 });

    const filtered = applications.filter((app) => {
      if (!search) return true;
      const query = search.toLowerCase();
      const student = app.studentId || {};
      return (
        String(app.applicationId || '').toLowerCase().includes(query) ||
        String(student.name || '').toLowerCase().includes(query) ||
        String(app.academicDetails?.studentIdNumber || '').toLowerCase().includes(query)
      );
    });

    return NextResponse.json({ applications: filtered });
  } catch (error) {
    console.error('Admin applications error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
