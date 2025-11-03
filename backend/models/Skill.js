import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Data Analytics', 'Soft Skills'],
  },
  proficiency: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50,
  },
  experience: {
    type: String,
    default: '1 year',
  },
  icon: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
  certifications: [String],
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
skillSchema.index({ category: 1 });
skillSchema.index({ order: 1 });

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
