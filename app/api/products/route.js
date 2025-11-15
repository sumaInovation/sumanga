// app/api/products/route.js
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  console.log('🟢 GET /api/products - Starting request...');
  
  try {
    // Connect to database
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Simple query - get all products
    console.log('🔍 Fetching products from database...');
    const products = await Product.find({}).sort({ createdAt: -1 });
    console.log(`✅ Found ${products.length} products`);

    // Return success response WITH CACHE HEADERS
    return new Response(JSON.stringify({
      success: true,
      products: products,
      count: products.length,
      message: `Successfully fetched ${products.length} products`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'CDN-Cache-Control': 'no-cache',
        'Vary': '*'
      }
    });

  } catch (error) {
    console.error('❌ GET /api/products ERROR:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      products: []
    }), { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

export async function POST(request) {
  try {
    console.log('🟢 POST /api/products - Starting request...');
    await connectDB();
    
    const productData = await request.json();
    console.log('📦 Product data received:', productData);

    // Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const product = await Product.create(productData);
    console.log('✅ Product created:', product._id);

    return new Response(JSON.stringify({
      success: true,
      message: 'Product created successfully',
      product
    }), { 
      status: 201,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ POST /api/products ERROR:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      code: error.code
    }), { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}