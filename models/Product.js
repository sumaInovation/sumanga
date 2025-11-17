
// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxlength: [200, "Product name cannot exceed 200 characters"]
  },
  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    maxlength: [2000, "Description cannot exceed 2000 characters"]
  },
  shortDescription: {
    type: String,
    maxlength: [500, "Short description cannot exceed 500 characters"]
  },

  // Pricing
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  originalPrice: {
    type: Number,
    min: [0, "Original price cannot be negative"]
  },
  discount: {
    type: Number,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
    default: 0
  },
  currency: {
    type: String,
    default: "USD"
  },

  // Category & Brand
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: [true, "Brand is required"],
    trim: true
  },

  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ""
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  thumbnail: {
    type: String
  },

  // Inventory
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    trim: true,
    uppercase: true
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    default: 0
  },
  lowStockAlert: {
    type: Number,
    default: 10
  },

  // SEO Fields
  metaTitle: {
    type: String,
    maxlength: [60, "Meta title cannot exceed 60 characters"]
  },
  metaDescription: {
    type: String,
    maxlength: [160, "Meta description cannot exceed 160 characters"]
  },
  keywords: [{
    type: String,
    trim: true
  }],

  // Ratings & Reviews
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },

  // Product Status
  status: {
    type: String,
    enum: ["draft", "published", "archived", "out_of_stock"],
    default: "draft"
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  isInStock: {
    type: Boolean,
    default: true
  },

  // Specifications
  specifications: {
    type: Map,
    of: String
  },
  features: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],

  // Dimensions & Weight
  weight: {
    value: Number,
    unit: {
      type: String,
      default: "kg"
    }
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      default: "cm"
    }
  },

  // Shipping
  shipping: {
    isFree: {
      type: Boolean,
      default: false
    },
    cost: {
      type: Number,
      default: 0
    },
    weightBasedCost: {
      type: Boolean,
      default: false
    }
  },

  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  },
  wishlistCount: {
    type: Number,
    default: 0
  },

  // Relations
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: String,
    trim: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ status: 1, isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ "rating.average": -1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return this.discount || 0;
});

// Virtual for saving amount
productSchema.virtual('savingAmount').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return this.originalPrice - this.price;
  }
  return 0;
});

// Virtual for published status (compatibility with existing code)
productSchema.virtual('published').get(function() {
  return this.status === 'published';
});

// Virtual for reviews (populate reviews)
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// ✅ SIMPLIFIED Pre-save middleware
productSchema.pre('save', function(next) {
  // Auto-generate meta fields if not provided
  if (!this.metaTitle && this.name) {
    this.metaTitle = this.name.substring(0, 60);
  }

  if (!this.metaDescription) {
    this.metaDescription = this.shortDescription 
      ? this.shortDescription.substring(0, 160)
      : this.description.substring(0, 160);
  }

  // Update stock status
  this.isInStock = this.stock > 0;
  if (this.stock === 0 && this.status !== 'archived') {
    this.status = "out_of_stock";
  } else if (this.stock > 0 && this.status === 'out_of_stock') {
    this.status = "published";
  }

  // Set isOnSale based on pricing
  this.isOnSale = (this.originalPrice && this.originalPrice > this.price) || this.discount > 0;

  // Set thumbnail from first image
  if (this.images.length > 0 && !this.thumbnail) {
    const primaryImage = this.images.find(img => img.isPrimary) || this.images[0];
    this.thumbnail = primaryImage.url;
  }

  next();
});

// ✅ SIMPLIFIED Pre-update middleware
productSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  // Handle stock status updates
  if (update.$set && update.$set.stock !== undefined) {
    const isInStock = update.$set.stock > 0;
    this.set({ isInStock });
    
    if (update.$set.stock === 0) {
      this.set({ status: "out_of_stock" });
    } else if (update.$set.stock > 0 && update.$set.status === 'out_of_stock') {
      this.set({ status: "published" });
    }
  }

  // Handle sale status
  if ((update.$set && update.$set.originalPrice) || (update.$set && update.$set.price) || (update.$set && update.$set.discount)) {
    const isOnSale = (update.$set.originalPrice && update.$set.originalPrice > update.$set.price) || 
                    (update.$set.discount && update.$set.discount > 0);
    this.set({ isOnSale });
  }

  next();
});

// ✅ Static method to find published products
productSchema.statics.findPublished = function() {
  return this.find({ status: 'published' });
};

// ✅ Static method to find featured products
productSchema.statics.findFeatured = function() {
  return this.find({ status: 'published', isFeatured: true });
};

// ✅ Static method to find products in stock
productSchema.statics.findInStock = function() {
  return this.find({ isInStock: true, status: 'published' });
};

// ✅ Static method to get products with reviews
productSchema.statics.getProductsWithReviews = function(query = {}) {
  return this.find({ 
    ...query, 
    status: 'published' 
  })
  .populate({
    path: 'reviews',
    match: { status: 'approved' },
    options: { sort: { createdAt: -1 }, limit: 5 }
  })
  .sort({ createdAt: -1 });
};

// ✅ Static method to update ratings for multiple products
productSchema.statics.updateProductsRating = async function(productIds) {
  const Review = mongoose.model('Review');
  
  for (const productId of productIds) {
    const ratingData = await Review.calculateProductRating(productId);
    await this.findByIdAndUpdate(productId, { rating: ratingData });
  }
};

// ✅ Instance method to update rating from reviews
productSchema.methods.updateRatingFromReviews = async function() {
  try {
    const Review = mongoose.model('Review');
    const ratingData = await Review.calculateProductRating(this._id);
    
    this.rating = ratingData;
    await this.save();
    
    console.log(`✅ Updated rating for product ${this.name}:`, ratingData);
    return ratingData;
  } catch (error) {
    console.error('❌ Error updating rating from reviews:', error);
    throw error;
  }
};

// ✅ Instance method to add a single rating (backward compatibility)
productSchema.methods.updateRating = function(newRating) {
  if (newRating < 1 || newRating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Update distribution
  this.rating.distribution[newRating] = (this.rating.distribution[newRating] || 0) + 1;
  
  // Recalculate average
  const totalRatings = Object.values(this.rating.distribution).reduce((sum, count) => sum + count, 0);
  const weightedSum = Object.entries(this.rating.distribution).reduce((sum, [rating, count]) => {
    return sum + (parseInt(rating) * count);
  }, 0);
  
  this.rating.average = totalRatings > 0 ? weightedSum / totalRatings : 0;
  this.rating.count = totalRatings;
  
  return this.save();
};

// ✅ Instance method to get approved reviews
productSchema.methods.getApprovedReviews = function(limit = 10, page = 1) {
  const Review = mongoose.model('Review');
  const skip = (page - 1) * limit;
  
  return Review.find({ 
    product: this._id, 
    status: 'approved' 
  })
  .populate('user', 'name email')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

// ✅ Instance method to get review statistics
productSchema.methods.getReviewStats = async function() {
  const Review = mongoose.model('Review');
  
  const stats = await Review.aggregate([
    {
      $match: { 
        product: this._id,
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$product',
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
        ratingCounts: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length > 0) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingCounts.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    return {
      totalReviews: stats[0].totalReviews,
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      distribution: distribution
    };
  }

  return {
    totalReviews: 0,
    averageRating: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
};

// ✅ Instance method to increment view count
productSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// ✅ Instance method to increment purchase count
productSchema.methods.incrementPurchaseCount = function(quantity = 1) {
  this.purchaseCount += quantity;
  this.stock = Math.max(0, this.stock - quantity);
  
  // Update stock status
  this.isInStock = this.stock > 0;
  if (this.stock === 0 && this.status !== 'archived') {
    this.status = "out_of_stock";
  }
  
  return this.save();
};

// ✅ Instance method to increment wishlist count
productSchema.methods.incrementWishlistCount = function() {
  this.wishlistCount += 1;
  return this.save();
};

// ✅ Instance method to decrement wishlist count
productSchema.methods.decrementWishlistCount = function() {
  this.wishlistCount = Math.max(0, this.wishlistCount - 1);
  return this.save();
};

// ✅ Instance method to check if low stock
productSchema.methods.isLowStock = function() {
  return this.stock <= this.lowStockAlert;
};

// ✅ Instance method to get similar products
productSchema.methods.getSimilarProducts = function(limit = 4) {
  return this.constructor.find({
    _id: { $ne: this._id },
    category: this.category,
    status: 'published',
    isInStock: true
  })
  .select('name slug price thumbnail rating brand')
  .limit(limit)
  .sort({ 'rating.average': -1, createdAt: -1 });
};

// ✅ CHANGE TO THIS (no warning):
productSchema.methods.isRecentlyAdded = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.createdAt > thirtyDaysAgo;
};

// ✅ Instance method to get product availability status
productSchema.methods.getAvailabilityStatus = function() {
  if (this.status === 'archived') return 'archived';
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= this.lowStockAlert) return 'low_stock';
  return 'in_stock';
};

export default mongoose.models.Product || mongoose.model("Product", productSchema);