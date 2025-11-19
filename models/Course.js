// models/Course.js
import mongoose from 'mongoose';

const syllabusItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
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
  totalDuration: Number // Auto-calculated
});

// Calculate total duration before saving
daySchema.pre('save', function(next) {
  this.totalDuration = this.items.reduce((total, item) => total + item.duration, 0);
  next();
});

const batchSchema = new mongoose.Schema({
  batchNumber: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  schedule: {
    days: [String], // ['Monday', 'Wednesday', 'Friday']
    time: String, // '10:00 AM - 1:00 PM'
    duration: String // '3 hours'
  },
  maxStudents: {
    type: Number,
    default: 20
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  fees: {
    originalPrice: Number,
    discountedPrice: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    offerValidUntil: Date,
    offerDescription: String
  }
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

  // Syllabus Structure (Following your exact format)
  syllabus: [daySchema],

  // Batches Management
  batches: [batchSchema],
  
  // Pricing & Offers
  baseFees: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  specialOffers: [{
    title: String,
    description: String,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed', 'early-bird']
    },
    discountValue: Number,
    validFrom: Date,
    validUntil: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Duration Information
  duration: {
    totalDays: Number,
    totalHours: Number,
    theoryHours: Number,
    practicalHours: Number,
    perDayHours: Number
  },

  // Instructor
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },

  // Equipment & Requirements
  equipmentUsed: [{
    name: String,
    description: String,
    quantity: Number
  }],
  softwareUsed: [{
    name: String,
    version: String,
    description: String
  }],
  prerequisites: [String],

  // Media
  thumbnail: String,
  promoVideo: String,
  gallery: [String],

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

  // Status & Settings
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  certificateIncluded: {
    type: Boolean,
    default: true
  },
  tags: [String],
  language: {
    type: String,
    default: 'English'
  }
}, {
  timestamps: true
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);