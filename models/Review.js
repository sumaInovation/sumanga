// models/Review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  // Product reference
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, "Product ID is required"]
  },
  
  // User reference
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"]
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"]
  },
  
  // Review content
  title: {
    type: String,
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  
  comment: {
    type: String,
    required: [true, "Review comment is required"],
    trim: true,
    maxlength: [1000, "Comment cannot exceed 1000 characters"]
  },
  
  // Review status
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  
  // Helpful votes
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  
  // Admin response
  adminReply: {
    text: String,
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    repliedAt: Date
  }

}, {
  timestamps: true
});

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Index for better query performance
reviewSchema.index({ product: 1, status: 1, rating: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

// Static method to get product reviews
reviewSchema.statics.getProductReviews = function(productId, status = "approved") {
  return this.find({ 
    product: productId, 
    status: status 
  })
  .populate('user', 'name email')
  .sort({ createdAt: -1 });
};

// Static method to calculate average rating for a product
reviewSchema.statics.calculateProductRating = async function(productId) {
  const result = await this.aggregate([
    {
      $match: { 
        product: new mongoose.Types.ObjectId(productId),
        status: "approved"
      }
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating"
        }
      }
    }
  ]);

  if (result.length > 0) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    result[0].ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });
    
    return {
      average: Math.round(result[0].averageRating * 10) / 10,
      count: result[0].reviewCount,
      distribution: distribution
    };
  }

  return {
    average: 0,
    count: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
};

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);