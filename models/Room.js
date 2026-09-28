import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hostelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
    block: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      default: 4,
    },
    occupants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['AVAILABLE', 'FULL'],
      default: 'AVAILABLE',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Mixed'],
      default: 'Mixed',
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
