import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  author: {
    name: {
      type: String,
      default: 'Arbab Arshad',
    },
    avatar: {
      type: String,
      default: '/images/arbab-avatar.jpg',
    },
    bio: {
      type: String,
      default: 'Full-Stack MERN Developer & Data Analyst',
    },
  },
  category: {
    type: String,
    required: true,
    enum: ['Tutorial', 'Best Practices', 'Case Study', 'Tech Review', 'Career', 'Other'],
  },
  tags: [String],
  coverImage: {
    url: String,
    publicId: String,
  },
  readTime: {
    type: Number,
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  featured: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
}, {
  timestamps: true,
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ published: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ views: -1 });
blogSchema.index({ publishedAt: -1 });

// Calculate read time based on content
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  
  // Generate slug from title
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Set published date
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Virtual for URL
blogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
