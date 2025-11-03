import mongoose from 'mongoose';

const guestBookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  avatar: String,
  website: String,
  company: String,
  role: String,
  approved: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes
guestBookSchema.index({ approved: 1 });
guestBookSchema.index({ featured: 1 });
guestBookSchema.index({ createdAt: -1 });

const GuestBook = mongoose.model('GuestBook', guestBookSchema);

export default GuestBook;
