// app/api/products/route.js
import { getAllPublishedProducts } from "@/lib/products-data";

export async function GET(request) {
  console.log('🟢 GET /api/products - Starting request...');
  
  try {
    // Use shared database function
    console.log('🔗 Using shared database function...');
    const products = await getAllPublishedProducts();
    console.log(`✅ Found ${products.length} products via shared function`);

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
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('❌ GET /api/products ERROR:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      products: []
    }), { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

// Keep your existing POST method unchanged
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