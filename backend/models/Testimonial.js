import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Testimonial content is required'],
  },
  avatar: {
    url: String,
    publicId: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
testimonialSchema.index({ approved: 1 });
testimonialSchema.index({ featured: 1 });
testimonialSchema.index({ order: 1 });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
