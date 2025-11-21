import mongoose from 'mongoose';

// Import all models to ensure they're registered
import User from '@/models/User';
import Course from '@/models/Course';
import Registration from '@/models/Registration';
import PaymentOrder from '@/models/PaymentOrder';

// This function ensures models are registered
export function registerModels() {
  console.log('📚 Models registered:', Object.keys(mongoose.models));
  return mongoose.models;
}

// Export models for easy access
export { User, Course, Registration, PaymentOrder };