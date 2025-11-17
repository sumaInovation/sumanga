// models/Enrollment.js
import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  transactionId: String,
  
  // Progress tracking
  progress: {
    completedModules: [{ type: mongoose.Schema.Types.ObjectId }],
    currentModule: { type: mongoose.Schema.Types.ObjectId },
    overallProgress: { type: Number, default: 0 }
  },
  
  // Timestamps
  enrolledAt: { type: Date, default: Date.now },
  completedAt: Date
});

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);