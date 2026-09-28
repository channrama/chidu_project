import mongoose from 'mongoose';

const hostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    blocks: [
      {
        type: String,
        trim: true,
      },
    ],
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Mixed'],
      default: 'Mixed',
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Hostel = mongoose.models.Hostel || mongoose.model('Hostel', hostelSchema);

export default Hostel;
