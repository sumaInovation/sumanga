
// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "student", "staff", "admin"],
    default: "user",
  },
  provider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
  },
  phoneNumber: {
    type: String,
  },
  whatsappNumber: {
    type: String,
  },
  
  paidAmount: {
    type: Number,
    default: 0,
  },
  dueAmount: {
    type: Number,
    default: 0,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true
});

// Clear the model first to avoid compilation issues
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model("User", userSchema);