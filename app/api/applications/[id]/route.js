import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';
import { requireAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { user, error } = await requireAuth(['student', 'admin']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const application = await Application.findById(params.id).populate('studentId', 'name email course year');
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    if (user.role === 'student' && String(application.studentId._id) !== String(user.id)) {
      return NextResponse.json({ message: 'You are not allowed to view this application' }, { status: 403 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json({ message: 'Something went wrong while fetching application' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { user, error } = await requireAuth(['student']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const application = await Application.findById(params.id);
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    if (String(application.studentId) !== String(user.id)) {
      return NextResponse.json({ message: 'You cannot edit another student application' }, { status: 403 });
    }

    if (application.status !== 'PENDING') {
      return NextResponse.json({ message: 'Only pending applications can be edited' }, { status: 400 });
    }

    const body = await request.json();
    application.personalDetails = body.personalDetails;
    application.academicDetails = body.academicDetails;
    application.hostelDetails = body.hostelDetails;
    application.guardianDetails = body.guardianDetails;
    application.income = Number(body.income || 0);
    await application.save();

    return NextResponse.json({ message: 'Application updated successfully', application });
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json({ message: 'Something went wrong while updating application' }, { status: 500 });
  }
}
