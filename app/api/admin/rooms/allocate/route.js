import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';
import Hostel from '@/models/Hostel';
import Room from '@/models/Room';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  try {
    const { user, error } = await requireAuth(['admin']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    if (!body.applicationId || !body.roomNumber || !body.hostelId) {
      return NextResponse.json({ message: 'Application ID, hostel and room number are required' }, { status: 400 });
    }

    const application = await Application.findById(body.applicationId);
    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'APPROVED') {
      return NextResponse.json({ message: 'Only approved applications can be allocated rooms' }, { status: 400 });
    }

    const hostel = await Hostel.findById(body.hostelId);
    if (!hostel) {
      return NextResponse.json({ message: 'Hostel not found' }, { status: 404 });
    }

    const room = await Room.findOne({
      hostelId: body.hostelId,
      block: body.block,
      floor: Number(body.floor),
      roomNumber: String(body.roomNumber),
    });

    if (!room) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }

    if (room.occupants.length >= room.capacity) {
      return NextResponse.json({ message: 'Room has reached its capacity' }, { status: 400 });
    }

    room.occupants.push(application.studentId);
    room.status = room.occupants.length >= room.capacity ? 'FULL' : 'AVAILABLE';
    await room.save();

    application.roomAllocation = {
      hostelId: room.hostelId,
      hostelName: hostel.name,
      block: room.block,
      floor: room.floor,
      roomNumber: room.roomNumber,
    };
    application.status = 'APPROVED';
    await application.save();

    return NextResponse.json({ message: 'Room allocated successfully', room });
  } catch (error) {
    console.error('Room allocation error:', error);
    return NextResponse.json({ message: 'Something went wrong while allocating room' }, { status: 500 });
  }
}
