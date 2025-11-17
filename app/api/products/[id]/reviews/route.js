
// app/api/products/[id]/reviews/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Review from "@/models/Review";
import { connectDB as connectToDB } from "@/lib/mongodb"; // ✅ Rename during import

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(
        JSON.stringify({ success: false, error: "Not authenticated" }),
        { status: 401 }
      );
    }

    // ✅ FIX: Await the params
    const { id } = await params;
    const productId = id;

    console.log("🔍 Debug - Product ID from params:", productId);

    if (!productId) {
      return new Response(
        JSON.stringify({ success: false, error: "Product ID is required" }),
        { status: 400 }
      );
    }

    const { rating, title, comment } = await request.json();

    await connectToDB();

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: session.user.id
    });

    if (existingReview) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "You have already reviewed this product" 
        }),
        { status: 400 }
      );
    }

    // ✅ Save user info directly in the review
    const review = new Review({
      product: productId,
      user: session.user.id,
      userInfo: {
        name: session.user.name,
        image: session.user.image || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2QjcyODAiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxMiIgcj0iNSIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTYgMThDMTAgMTggNiAyMSA2IDI2SDI2QzI2IDIxIDIyIDE4IDE2IDE4WiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K",
        email: session.user.email
      },
      rating,
      title,
      comment,
      status: "approved"
    });

    await review.save();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Review submitted successfully",
        review 
      }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Review submission error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to submit review" 
      }),
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    // ✅ FIX: Await the params here too
    const { id } = await params;
    const productId = id;

    if (!productId) {
      return new Response(
        JSON.stringify({ success: false, error: "Product ID is required" }),
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'approved';

    await connectToDB();

    const reviews = await Review.find({ 
      product: productId, 
      status: status 
    }).sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({ 
        success: true, 
        reviews 
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Get reviews error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to fetch reviews" 
      }),
      { status: 500 }
    );
  }
}