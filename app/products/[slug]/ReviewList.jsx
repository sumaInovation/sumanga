// app/products/[slug]/ReviewList.jsx
"use client";

import { useState, useEffect } from "react";

export function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Default avatar (same as your navbar)
  const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzIiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2QjcyODAiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxMiIgcj0iNSIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTYgMThDMTAgMTggNiAyMSA2IDI2SDI2QzI2IDIxIDIyIDE4IDE2IDE4WiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K";

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
      } else {
        setError("Failed to load reviews");
      }
    } catch (err) {
      setError("Error loading reviews");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
        <div className="text-red-400 text-4xl mb-3">⚠️</div>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={fetchReviews}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
        <div className="text-gray-400 text-6xl mb-4">💬</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600">Be the first to share your experience with this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h3>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div 
            key={review._id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={review.userInfo.image || defaultAvatar}
                alt={review.userInfo.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {review.userInfo.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="mb-3">
              {renderStars(review.rating)}
            </div>

            {/* Review Title */}
            {review.title && (
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {review.title}
              </h4>
            )}

            {/* Review Comment */}
            <p className="text-gray-700 leading-relaxed mb-4">
              {review.comment}
            </p>

            {/* Helpful Votes */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <span>👍</span>
                Helpful ({review.helpful.count})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}