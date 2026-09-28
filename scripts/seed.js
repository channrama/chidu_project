import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Hostel from '../models/Hostel.js';
import Room from '../models/Room.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/state-hostel-portal';

async function seed() {
  await mongoose.connect(MONGODB_URI);

  await User.deleteMany({});
  await Hostel.deleteMany({});
  await Room.deleteMany({});

  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const admin = await User.create({
    name: 'System Admin',
    email: 'admin@statehostel.edu',
    password: adminPassword,
    role: 'admin',
    phone: '9000000001',
    college: 'State University',
    course: 'Administration',
    year: 'Admin',
  });

  const student = await User.create({
    name: 'Priya Sharma',
    email: 'student@statehostel.edu',
    password: studentPassword,
    role: 'student',
    phone: '9000000002',
    college: 'State University',
    course: 'Computer Science',
    year: '2nd Year',
  });

  const hostelA = await Hostel.create({
    name: 'Hostel A',
    blocks: ['A', 'B'],
    gender: 'Female',
    address: 'North Campus Block 1',
  });

  const hostelB = await Hostel.create({
    name: 'Hostel B',
    blocks: ['C', 'D'],
    gender: 'Male',
    address: 'South Campus Block 2',
  });

  const roomEntries = [];

  for (let i = 101; i <= 110; i += 1) {
    roomEntries.push({
      hostelId: hostelA._id,
      block: 'A',
      floor: 1,
      roomNumber: String(i),
      capacity: 4,
      occupants: [],
      status: 'AVAILABLE',
      gender: 'Female',
    });
  }

  for (let i = 201; i <= 210; i += 1) {
    roomEntries.push({
      hostelId: hostelB._id,
      block: 'C',
      floor: 2,
      roomNumber: String(i),
      capacity: 4,
      occupants: [],
      status: 'AVAILABLE',
      gender: 'Male',
    });
  }

  await Room.insertMany(roomEntries);

  console.log('Seed data created successfully');
  console.log('Admin login: admin@statehostel.edu / admin123');
  console.log('Student login: student@statehostel.edu / student123');

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});
