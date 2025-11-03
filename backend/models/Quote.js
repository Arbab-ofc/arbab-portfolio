import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Quote text is required'],
    trim: true,
    maxlength: [500, 'Quote text cannot exceed 500 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters'],
  },
  field: {
    type: String,
    required: [true, 'Field/category is required'],
    trim: true,
    maxlength: [50, 'Field cannot exceed 50 characters'],
  },
  category: {
    type: String,
    required: true,
    enum: ['programming', 'development', 'technology', 'innovation', 'design', 'leadership', 'ai', 'web', 'software', 'other'],
    default: 'programming',
  },
  command: {
    type: String,
    trim: true,
    maxlength: [100, 'Command cannot exceed 100 characters'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  source: {
    type: String,
    trim: true,
    maxlength: [200, 'Source cannot exceed 200 characters'],
  },
  context: {
    type: String,
    trim: true,
    maxlength: [300, 'Context cannot exceed 300 characters'],
  },
  priority: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
quoteSchema.index({ category: 1 });
quoteSchema.index({ featured: 1 });
quoteSchema.index({ active: 1 });
quoteSchema.index({ priority: -1 });
quoteSchema.index({ createdAt: -1 });

// Text search index
quoteSchema.index({
  text: 'text',
  author: 'text',
  field: 'text',
  tags: 'text'
});

const Quote = mongoose.model('Quote', quoteSchema);

export default Quote;