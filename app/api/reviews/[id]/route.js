import { NextResponse } from "next/server";
import Review from "@/models/Review";
import { connectDB as connectToDB } from "@/lib/mongodb"; // ✅ Rename during import

// GET - Get a specific review
export async function GET(request, { params }) {
  try {
    await connectToDB();
    
    const reviewId = params.id;
    
    const review = await Review.findById(reviewId)
      .populate('user', 'name email')
      .populate('product', 'name slug');
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    const formattedReview = {
      id: review._id.toString(),
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      author: {
        name: review.user?.name || "Anonymous",
        email: review.user?.email
      },
      product: {
        id: review.product?._id.toString(),
        name: review.product?.name,
        slug: review.product?.slug
      },
      date: review.createdAt,
      status: review.status,
      helpful: review.helpful?.count || 0,
      adminReply: review.adminReply ? {
        text: review.adminReply.text,
        repliedBy: review.adminReply.repliedBy?.toString(),
        repliedAt: review.adminReply.repliedAt
      } : null
    };

    return NextResponse.json({
      success: true,
      review: formattedReview
    });

  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// PUT - Update a review (admin only for status changes, user for their own reviews)
export async function PUT(request, { params }) {
  try {
    await connectToDB();
    
    const reviewId = params.id;
    const body = await request.json();
    const { status, adminReply, repliedBy } = body;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // Update status if provided (admin only)
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      review.status = status;
    }

    // Add admin reply if provided
    if (adminReply && repliedBy) {
      review.adminReply = {
        text: adminReply,
        repliedBy: repliedBy,
        repliedAt: new Date()
      };
    }

    await review.save();
    await review.populate('user', 'name email');

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      review: {
        id: review._id.toString(),
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        status: review.status,
        adminReply: review.adminReply
      }
    });

  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review
export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    
    const reviewId = params.id;
    
    const review = await Review.findByIdAndDelete(reviewId);
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}