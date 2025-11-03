import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
  },
  location: {
    type: String,
    default: 'Remote',
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Freelance', 'Contract', 'Internship'],
    default: 'Full-time',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  responsibilities: [String],
  achievements: [String],
  technologies: [String],
  logo: {
    url: String,
    publicId: String,
  },
  website: String,
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
experienceSchema.index({ startDate: -1 });
experienceSchema.index({ order: 1 });

// Virtual for duration
experienceSchema.virtual('duration').get(function() {
  const start = this.startDate;
  const end = this.current ? new Date() : this.endDate;
  
  if (!end) return 'Present';
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
});

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
