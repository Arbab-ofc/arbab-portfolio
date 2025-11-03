import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
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
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  phone: String,
  company: String,
  budget: {
    type: String,
    enum: ['< $5k', '$5k - $10k', '$10k - $25k', '$25k - $50k', '> $50k', 'Not sure'],
  },
  projectType: {
    type: String,
    enum: ['Full Stack Development', 'Frontend Development', 'Backend Development', 'API Development', 'Consulting', 'Other'],
  },
  timeline: {
    type: String,
    enum: ['ASAP', '1-2 weeks', '2-4 weeks', '1-3 months', '3+ months', 'Flexible'],
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new',
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  notes: String,
  repliedAt: Date,
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

// Indexes
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
