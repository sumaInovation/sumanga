
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
    // Not required for OAuth users
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "staff", "admin"],
    default: "user", // Make sure default is set
  },
  provider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
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
  timestamps: true // This ensures updatedAt is managed
});

// Clear the model first to avoid compilation issues
delete mongoose.models.User;

export default mongoose.model("User", userSchema);