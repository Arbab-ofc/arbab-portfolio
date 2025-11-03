import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
    default: 'My Resume',
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  publicId: {
    type: String,
    required: [true, 'Public ID is required'],
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true,
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
    default: 'application/pdf',
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Update the updatedAt field on save
resumeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
resumeSchema.index({ isActive: 1 });
resumeSchema.index({ uploadedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;