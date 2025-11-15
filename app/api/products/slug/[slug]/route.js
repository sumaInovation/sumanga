
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request, { params }) {
  console.log('🟢 GET /api/products/slug/[slug] - Starting request...');
  
  try {
    // FIX: await the params in API route
    const { slug } = await params;
    console.log('🔍 Looking for product with slug:', slug);

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
        message: `No product found with slug: ${slug}`
      }, { status: 404 });
    }

    console.log('✅ Product found:', product.name);
    
    // Convert Mongoose document to plain object
    const productData = product.toObject();

    return Response.json({
      success: true,
      product: productData,
      message: 'Product fetched successfully'
    });

  } catch (error) {
    console.error('❌ GET /api/products/slug/[slug] ERROR:', error);
    console.error('❌ Error message:', error.message);
    
    return Response.json({ 
      success: false,
      error: error.message,
      product: null
    }, { status: 500 });
  }
}