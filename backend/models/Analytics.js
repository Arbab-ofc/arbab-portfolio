import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  ipAddress: String,
  country: String,
  city: String,
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
  },
  browser: String,
  os: String,
  pages: [{
    path: String,
    duration: Number,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  referrer: String,
  totalDuration: {
    type: Number,
    default: 0,
  },
  actions: [{
    type: {
      type: String,
      enum: ['project_view', 'blog_read', 'contact_submit', 'download_resume', 'click_link', 'like', 'share'],
    },
    target: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
analyticsSchema.index({ sessionId: 1 });
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ country: 1 });
analyticsSchema.index({ device: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
