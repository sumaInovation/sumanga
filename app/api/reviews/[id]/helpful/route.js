import { NextResponse } from "next/server";
import Review from "@/models/Review";
import { connectDB as connectToDB } from "@/lib/mongodb"; // ✅ Rename during import

// POST - Mark a review as helpful
export async function POST(request, { params }) {
  try {
    await connectToDB();
    
    const reviewId = params.id;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // Check if user already marked this review as helpful
    const alreadyHelpful = review.helpful.users.includes(userId);
    
    if (alreadyHelpful) {
      // Remove helpful vote
      review.helpful.users.pull(userId);
      review.helpful.count = Math.max(0, review.helpful.count - 1);
    } else {
      // Add helpful vote
      review.helpful.users.push(userId);
      review.helpful.count += 1;
    }

    await review.save();

    return NextResponse.json({
      success: true,
      helpful: review.helpful.count,
      userVoted: !alreadyHelpful
    });

  } catch (error) {
    console.error("Error updating helpful vote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update helpful vote" },
      { status: 500 }
    );
  }
}