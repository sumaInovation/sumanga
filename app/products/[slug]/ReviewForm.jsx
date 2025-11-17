
// app/products/[slug]/ReviewForm.jsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export function ReviewForm({ productId, productName }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!session) {
      setMessage({ type: "error", text: "Please sign in to write a review" });
      return;
    }

    if (rating === 0) {
      setMessage({ type: "error", text: "Please select a rating" });
      return;
    }

    if (!comment.trim()) {
      setMessage({ type: "error", text: "Please write a review comment" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ Use the authenticated user's ID from session
      const userId = session.user.id;

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setRating(0);
        setTitle("");
        setComment("");
        
        // Refresh the page to show the new review
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to submit review" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <p className="text-gray-600 mb-4">Please sign in to write a review</p>
          <button 
            onClick={() => window.location.href = '/auth/signin'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        {/* Show logged-in user's avatar and name */}
        <img
          src={session.user.image || "/images/default-avatar.png"}
          alt={session.user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <p className="font-semibold text-gray-900">Writing as {session.user.name}</p>
          <p className="text-sm text-gray-500">Your review will be public</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === "success" 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`text-3xl transition-colors duration-200 ${
                  (hoverRating || rating) >= star 
                    ? "text-yellow-400" 
                    : "text-gray-300"
                } hover:text-yellow-400 focus:outline-none`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {rating === 0 ? "Select a rating" : `You rated: ${rating} star${rating > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder={`Share your experience with ${productName}...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
            required
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/1000 characters</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>

        {/* Help Text */}
        <p className="text-xs text-gray-500 text-center">
          Your review will be submitted for approval before being published.
        </p>
      </form>
    </div>
  );
}