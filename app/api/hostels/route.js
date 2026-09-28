import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Hostel from '@/models/Hostel';

export async function GET() {
  try {
    await connectDB();
    const hostels = await Hostel.find({}).sort({ name: 1 });
    return NextResponse.json({ hostels });
  } catch (error) {
    console.error('Hostels fetch error:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
