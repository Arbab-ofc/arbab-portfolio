import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  longDescription: {
    type: String,
    required: [true, 'Long description is required'],
  },
  category: {
    type: String,
    required: true,
    enum: ['E-commerce', 'Social Media', 'SaaS', 'Portfolio', 'API', 'Dashboard', 'Mobile App', 'Other'],
  },
  projectType: {
    type: String,
    required: true,
    enum: ['Full Stack', 'Frontend', 'Backend', 'Mobile App', 'API'],
  },
  technologies: {
    frontend: [String],
    backend: [String],
    database: [String],
    devops: [String],
    tools: [String],
  },
  images: [{
    url: String,
    publicId: String,
    caption: String,
    type: {
      type: String,
      enum: ['cover', 'screenshot', 'diagram', 'mockup'],
      default: 'screenshot',
    },
  }],
  links: {
    live: String,
    github: String,
    demo: String,
    caseStudy: String,
    apiDocs: String,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  metrics: {
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
  impact: {
    userCount: Number,
    performance: String,
    scalability: String,
    codeQuality: String,
  },
  features: [String],
  challenges: [{
    problem: String,
    solution: String,
    result: String,
  }],
  learnings: [String],
  architecture: {
    description: String,
    diagram: String,
    patterns: [String],
  },
  team: [{
    name: String,
    role: String,
    contribution: String,
  }],
  duration: String,
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'maintained'],
    default: 'completed',
  },
  testimonials: [{
    author: String,
    role: String,
    company: String,
    content: String,
    avatar: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  }],
  media: {
    video: String,
    demo: String,
    presentation: String,
  },
  performance: {
    lighthouse: {
      performance: Number,
      accessibility: Number,
      bestPractices: Number,
      seo: Number,
    },
    loadTime: String,
    bundleSize: String,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
  },
  priority: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
projectSchema.index({ slug: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ 'metrics.views': -1 });
projectSchema.index({ createdAt: -1 });

// Virtual for URL
projectSchema.virtual('url').get(function() {
  return `/projects/${this.slug}`;
});

// Pre-save middleware to generate slug
projectSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
