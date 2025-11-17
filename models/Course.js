// models/Course.js
import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: String,
  videoUrl: String,
  resources: [{
    title: String,
    type: { type: String, enum: ['pdf', 'video', 'code', 'document'] },
    url: String
  }]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true,
    enum: ['PLC Programming', 'Robotics Programming', 'Kids Robotics']
  },
  level: { 
    type: String, 
    required: true,
    enum: ['Basic', 'Advanced']
  },
  description: { type: String, required: true },
  shortDescription: String,
  thumbnail: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  duration: String,
  instructor: { type: String, default: 'Suma Automation Experts' },
  language: { type: String, default: 'English & Sinhala' },
  delivery: { type: String, default: 'Online Live Classes' },
  
  // Course content
  syllabus: [moduleSchema],
  demoVideos: [{
    title: String,
    description: String,
    videoUrl: String,
    duration: String,
    thumbnail: String
  }],
  projects: [{
    title: String,
    description: String,
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    sourceCode: String,
    documentation: String,
    videoTutorial: String
  }],
  
  // Features
  features: [String],
  requirements: [String],
  learningOutcomes: [String],
  
  // Metadata
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  enrollmentCount: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  
  // Timestamps
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);