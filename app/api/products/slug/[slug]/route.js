
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request, { params }) {  // ← Keep it as { params }
  console.log('🟢 GET /api/products/slug/[slug] - Starting request...');
  
  try {
    // FIX: await the params directly
    const { slug } = await params;  // ← ADD AWAIT HERE
    console.log('🔍 Looking for product with slug:', slug);

    if (!slug) {
      console.log('❌ No slug provided');
      return Response.json({ 
        success: false,
        error: 'Slug parameter is required',
        product: null
      }, { status: 400 });
    }

    // Connect to database
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Find product by slug
    console.log('🔍 Querying database for product...');
    const product = await Product.findOne({ slug: slug });
    
    if (!product) {
      console.log('❌ Product not found for slug:', slug);
      return Response.json({ 
        success: false,
        error: 'Product not found',
        message: `No product found with slug: ${slug}`,
        product: null
      }, { status: 404 });
    }

    console.log('✅ Product found:', product.name);
    
    // Convert Mongoose document to plain object
    const productData = product.toObject ? product.toObject() : product;
    
    // Ensure _id is string for JSON serialization
    if (productData._id) {
      productData._id = productData._id.toString();
    }

    console.log('📦 Sending product response for:', productData.name);
    
    return Response.json({
      success: true,
      product: productData,
      message: 'Product fetched successfully'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });

  } catch (error) {
    console.error('❌ GET /api/products/slug/[slug] ERROR:', error);
    console.error('❌ Error message:', error.message);
    
    return Response.json({ 
      success: false,
      error: 'Internal server error',
      message: error.message,
      product: null
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}