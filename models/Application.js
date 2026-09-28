import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    personalDetails: {
      fullName: String,
      dateOfBirth: String,
      gender: String,
      phone: String,
      email: String,
      address: String,
    },
    academicDetails: {
      college: String,
      course: String,
      year: String,
      studentIdNumber: String,
      previousScore: String,
    },
    hostelDetails: {
      preferredHostel: String,
      roomPreference: String,
      messPreference: String,
    },
    guardianDetails: {
      guardianName: String,
      guardianPhone: String,
    },
    income: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    documents: {
      studentId: String,
      aadhaar: String,
      collegeId: String,
      incomeCertificate: String,
      marksCard: String,
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    roomAllocation: {
      hostelId: mongoose.Schema.Types.ObjectId,
      hostelName: String,
      block: String,
      floor: Number,
      roomNumber: String,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application;
