
// models/Registration.js
import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer', 'online','payhere_sandbox'],
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  },
  receiptUrl: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const registrationSchema = new mongoose.Schema({
  // Student Reference
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Course Reference - All course details come from Course model via population
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },

  // Batch Reference - Points to specific batch in Course.batches array
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  // Pricing Information (calculated automatically during registration)
  basePrice: {
    type: Number,
    required: true
  },
  finalPrice: {
    type: Number,
    required: true
  },
  offerApplied: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },

  // Registration Status
  registrationStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'on_hold'],
    default: 'pending'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'failed', 'refunded'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    required: true
  },

  // Payment History (multiple payments for installment plans)
  paymentHistory: [paymentHistorySchema],

  // Course Access & Progress
  accessGranted: {
    type: Boolean,
    default: false
  },
  accessStartDate: {
    type: Date
  },
  accessEndDate: {
    type: Date
  },

  // Learning Progress
  progress: {
    completedLessons: [{
      lessonId: mongoose.Schema.Types.ObjectId,
      completedAt: {
        type: Date,
        default: Date.now
      }
    }],
    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastAccessed: {
      type: Date,
      default: Date.now
    },
    totalTimeSpent: { // in minutes
      type: Number,
      default: 0
    }
  },

  // Certificate Information
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issueDate: Date,
    certificateId: String,
    certificateUrl: String,
    downloadCount: {
      type: Number,
      default: 0
    }
  },

  // Support & Communication
  supportSessions: [{
    date: Date,
    type: {
      type: String,
      enum: ['doubt', 'consultation', 'technical']
    },
    notes: String,
    resolved: {
      type: Boolean,
      default: false
    }
  }],

  // Admin & Management
  adminNotes: {
    type: String
  },
  assignedMentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },

  // Metadata
  source: {
    type: String,
    enum: ['website', 'admin', 'referral', 'partner'],
    default: 'website'
  },
  referralCode: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for performance
registrationSchema.index({ student: 1, course: 1, batch: 1 }, { unique: true });
registrationSchema.index({ student: 1, registrationDate: -1 });
registrationSchema.index({ 'paymentStatus': 1 });
registrationSchema.index({ 'registrationStatus': 1 });
registrationSchema.index({ 'accessEndDate': 1 });

// Virtual for automatic payment status calculation
registrationSchema.virtual('calculatedPaymentStatus').get(function() {
  if (this.amountPaid >= this.totalAmount) return 'paid';
  if (this.amountPaid > 0) return 'partial';
  return 'pending';
});

// Virtual for course completion status
registrationSchema.virtual('isCompleted').get(function() {
  return this.registrationStatus === 'completed';
});

// Virtual for days remaining
registrationSchema.virtual('daysRemaining').get(function() {
  if (!this.accessEndDate) return null;
  const today = new Date();
  const endDate = new Date(this.accessEndDate);
  const diffTime = endDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to auto-update payment status
registrationSchema.pre('save', function(next) {
  // Auto-update payment status based on amounts
  if (this.amountPaid >= this.totalAmount) {
    this.paymentStatus = 'paid';
    this.dueAmount = 0;
  } else if (this.amountPaid > 0) {
    this.paymentStatus = 'partial';
    this.dueAmount = this.totalAmount - this.amountPaid;
  } else {
    this.paymentStatus = 'pending';
    this.dueAmount = this.totalAmount;
  }

  // Auto-grant access when payment is confirmed
  if (this.paymentStatus === 'paid' && !this.accessGranted) {
    this.accessGranted = true;
    this.accessStartDate = new Date();
    
    // Set access end date (course duration + 30 days grace period)
    if (this.course && this.course.duration) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (this.course.duration * 7) + 30); // weeks to days + grace
      this.accessEndDate = endDate;
    }
  }

  next();
});

// Instance Methods

// Add payment to history and update amounts
registrationSchema.methods.addPayment = async function(paymentData) {
  this.paymentHistory.push(paymentData);
  this.amountPaid += paymentData.amount;
  
  // Auto-update will happen in pre-save
  return this.save();
};

// Mark lesson as completed
registrationSchema.methods.completeLesson = async function(lessonId) {
  if (!this.progress.completedLessons.some(lesson => lesson.lessonId.toString() === lessonId.toString())) {
    this.progress.completedLessons.push({
      lessonId: lessonId,
      completedAt: new Date()
    });
    
    // Calculate overall progress (you can customize this logic)
    // For example: progress = (completedLessons / totalLessons) * 100
    this.progress.lastAccessed = new Date();
    
    return this.save();
  }
  return this;
};

// Update overall progress
registrationSchema.methods.updateProgress = async function(totalLessons) {
  if (totalLessons > 0) {
    this.progress.overallProgress = Math.round((this.progress.completedLessons.length / totalLessons) * 100);
    
    // Mark as completed if progress is 100%
    if (this.progress.overallProgress >= 100) {
      this.registrationStatus = 'completed';
    }
    
    return this.save();
  }
  return this;
};

// Issue certificate
registrationSchema.methods.issueCertificate = async function(certificateData) {
  this.certificate = {
    issued: true,
    issueDate: new Date(),
    ...certificateData
  };
  return this.save();
};

// Static Methods

// Get all registrations for a student with course details
registrationSchema.statics.getStudentRegistrations = function(studentId, status = null) {
  let query = { student: studentId };
  if (status) query.registrationStatus = status;
  
  return this.find(query)
    .populate({
      path: 'course',
      select: 'title code description category level basePrice duration thumbnail batches syllabus'
    })
    .populate('student', 'name email phoneNumber image')
    .sort({ registrationDate: -1 });
};

// Get overdue payments
registrationSchema.statics.getOverdueRegistrations = function() {
  return this.find({
    paymentStatus: { $in: ['pending', 'partial'] },
    registrationStatus: { $ne: 'cancelled' }
  }).populate('student', 'name email phoneNumber');
};

// Get registrations expiring soon (within 7 days)
registrationSchema.statics.getExpiringRegistrations = function(days = 7) {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  
  return this.find({
    accessEndDate: { $lte: targetDate, $gte: new Date() },
    registrationStatus: { $in: ['confirmed', 'completed'] }
  }).populate('student', 'name email')
    .populate('course', 'title code');
};

export default mongoose.models.Registration || mongoose.model('Registration', registrationSchema);