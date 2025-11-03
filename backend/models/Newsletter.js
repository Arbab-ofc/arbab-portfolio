import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  name: {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  preferences: {
    frequency: {
      type: String,
      enum: ['weekly', 'monthly'],
      default: 'monthly',
    },
    topics: [String],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  unsubscribedAt: Date,
}, {
  timestamps: true,
});

// Indexes
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ active: 1 });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter;
