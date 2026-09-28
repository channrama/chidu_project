import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';
import { requireAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const { user, error } = await requireAuth(['admin']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const application = await Application.findById(params.id);

    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    if (!['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(body.status)) {
      return NextResponse.json({ message: 'Invalid status value' }, { status: 400 });
    }

    application.status = body.status;
    application.adminRemarks = body.adminRemarks || application.adminRemarks || '';
    application.reviewedAt = new Date();
    await application.save();

    return NextResponse.json({ message: 'Application status updated', application });
  } catch (error) {
    console.error('Update application status error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
