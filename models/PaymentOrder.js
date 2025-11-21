import mongoose from 'mongoose';

const paymentOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
    // Remove: index: true (if it exists) - keep only unique: true
  },
  registration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'LKR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  items: {
    type: String,
    required: true
  },
  studentDetails: {
    name: String,
    email: String,
    phone: String
  },
  payherePaymentId: {
    type: String
  },
  paymentMethod: {
    type: String
  },
  paymentDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Remove duplicate index if it exists here
// paymentOrderSchema.index({ orderId: 1 }); // ← Remove this line if it exists

// Keep only these indexes:
paymentOrderSchema.index({ student: 1 });
paymentOrderSchema.index({ registration: 1 });
paymentOrderSchema.index({ status: 1 });
paymentOrderSchema.index({ createdAt: 1 });

export default mongoose.models.PaymentOrder || mongoose.model('PaymentOrder', paymentOrderSchema);