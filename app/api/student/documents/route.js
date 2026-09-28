import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Application from '@/models/Application';

const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
const maxSize = 2 * 1024 * 1024;

export async function POST(request) {
  try {
    const { user, error } = await requireAuth(['student']);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = [];

    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') continue;

      if (!allowedTypes.includes(value.type)) {
        return NextResponse.json({ message: `${key} must be a PDF, JPG or PNG file` }, { status: 400 });
      }

      if (value.size > maxSize) {
        return NextResponse.json({ message: `${key} exceeds 2MB limit` }, { status: 400 });
      }

      files.push({ key, value });
    }

    if (!files.length) {
      return NextResponse.json({ message: 'Please upload at least one document' }, { status: 400 });
    }

    await connectDB();
    const application = await Application.findOne({ studentId: user.id }).sort({ submittedAt: -1 });
    if (!application) {
      return NextResponse.json({ message: 'Create an application before uploading documents' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const documentMap = application.documents || {};

    for (const file of files) {
      const fileName = `${Date.now()}-${file.key}-${file.value.name.replace(/\s+/g, '-')}`;
      const uploadPath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await file.value.arrayBuffer());
      await writeFile(uploadPath, buffer);
      documentMap[file.key] = `/uploads/${fileName}`;
    }

    application.documents = documentMap;
    await application.save();

    return NextResponse.json({ message: 'Documents uploaded successfully' });
  } catch (error) {
    console.error('Upload document error:', error);
    return NextResponse.json({ message: 'Something went wrong while uploading documents' }, { status: 500 });
  }
}
