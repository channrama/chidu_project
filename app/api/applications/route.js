import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const { user, error } = await requireAuth(['student']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const existing = await Application.findOne({ studentId: user.id, status: { $in: ['PENDING', 'UNDER_REVIEW', 'APPROVED'] } });
    if (existing) {
      return NextResponse.json({ message: 'An application already exists for this student' }, { status: 400 });
    }

    const applicationId = `APP-${Date.now()}`;
    const application = await Application.create({
      applicationId,
      studentId: user.id,
      personalDetails: body.personalDetails,
      academicDetails: body.academicDetails,
      hostelDetails: body.hostelDetails,
      guardianDetails: body.guardianDetails,
      income: Number(body.income || 0),
      status: 'PENDING',
      documents: {},
      adminRemarks: '',
      submittedAt: new Date(),
    });

    return NextResponse.json({ message: 'Application submitted successfully', application }, { status: 201 });
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json({ message: 'Something went wrong while creating application' }, { status: 500 });
  }
}

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
    console.error('My applications error:', error);
    return NextResponse.json({ message: 'Something went wrong while fetching applications' }, { status: 500 });
  }
}
