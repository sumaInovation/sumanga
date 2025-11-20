
// models/Course.js
import mongoose from 'mongoose';

const syllabusItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['theory', 'practical', 'project', 'demo', 'assessment'],
    default: 'theory'
  },
  description: String,
  videoLecture: {
    title: String,
    videoUrl: String,
    duration: Number,
    description: String,
    isPreview: {
      type: Boolean,
      default: false
    },
    thumbnail: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  resources: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'document', 'diagram', 'code', 'presentation']
    },
    size: String
  }]
});

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  dayTitle: {
    type: String,
    required: true
  },
  items: [syllabusItemSchema],
  totalDuration: Number
});

// Calculate total duration before saving
daySchema.pre('save', function(next) {
  this.totalDuration = this.items.reduce((total, item) => total + item.duration, 0);
  next();
});

// ✅ UPDATED: Batch Schema with startDate and endDate
const batchSchema = new mongoose.Schema({
  batchName: {
    type: String, 
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  offer: {
    type: Number, 
    default: 0
  },
  conductDays: [{
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  }],
  conductTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'ongoing', 'upcoming'],
    default: 'upcoming'
  },
  description: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }]
});

// Calculate endDate based on course duration and startDate
batchSchema.pre('save', function(next) {
  if (this.startDate && this.parent().duration) {
    const startDate = new Date(this.startDate);
    const durationInWeeks = this.parent().duration;
    // Calculate end date by adding weeks to start date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (durationInWeeks * 7));
    this.endDate = endDate;
  }
  next();
});

const courseSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },

  // Course Category & Level
  category: {
    type: String,
    required: true,
    enum: ['plc-programming', 'industrial-automation', 'electrical', 'pneumatics', 'robotics', 'other']
  },
  level: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced', 'professional'],
    default: 'beginner'
  },

  // ✅ SIMPLIFIED: Direct basePrice and duration
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number, // in weeks
    required: true
  },

  // Batches Management
  batches: [batchSchema],

  // Syllabus Structure
  syllabus: [daySchema],

  // Video Collections
  videoCollections: [{
    title: String,
    description: String,
    videos: [{
      title: String,
      videoUrl: String,
      duration: Number,
      description: String,
      thumbnail: String,
      uploadDate: {
        type: Date,
        default: Date.now
      },
      accessLevel: {
        type: String,
        enum: ['free', 'preview', 'enrolled'],
        default: 'enrolled'
      }
    }]
  }],

  // Image Gallery
  gallery: [String],

  // Media
  thumbnail: String,

  // Status & Settings
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);