import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Room from '@/models/Room';
import Hostel from '@/models/Hostel';

export async function GET() {
  try {
    await connectDB();
    const rooms = await Room.find({}).populate('hostelId', 'name');

    const formatted = rooms.map((room) => ({
      _id: room._id,
      hostelId: room.hostelId?._id || room.hostelId,
      hostelName: room.hostelId?.name || 'Hostel',
      block: room.block,
      floor: room.floor,
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      occupants: room.occupants || [],
      status: room.status,
      gender: room.gender,
    }));

    return NextResponse.json({ rooms: formatted });
  } catch (error) {
    console.error('Room fetch error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
