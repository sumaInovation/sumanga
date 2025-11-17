// app/api/reviews/route.js
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status') || 'approved';
    const limit = parseInt(searchParams.get('limit')) || 10;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    let query = { status };
    
    if (productId) {
      query.product = productId;
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);

    return new Response(JSON.stringify({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ GET /api/reviews ERROR:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const reviewData = await request.json();
    
    // Validate required fields
    if (!reviewData.product || !reviewData.user || !reviewData.rating || !reviewData.comment) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Missing required fields: product, user, rating, comment'
      }), { status: 400 });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: reviewData.product,
      user: reviewData.user
    });

    if (existingReview) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'You have already reviewed this product'
      }), { status: 400 });
    }

    const review = await Review.create(reviewData);
    
    // Update product rating
    const product = await Product.findById(reviewData.product);
    if (product) {
      await product.updateRatingFromReviews();
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Review submitted successfully',
      review
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ POST /api/reviews ERROR:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), { status: 500 });
  }
}