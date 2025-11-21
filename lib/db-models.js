// Import all models to ensure they're registered with Mongoose
import '@/models/User';
import '@/models/Course';
import '@/models/Registration';
import '@/models/PaymentOrder';

// This file doesn't export anything, it just ensures models are registered
console.log('✅ All database models registered');