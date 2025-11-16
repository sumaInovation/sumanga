
// app/api/products/route.js
import { getAllPublishedProducts } from "@/lib/products-data";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

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

export async function POST(request) {
  try {
    console.log('🟢 POST /api/products - Starting request...');
    await connectDB();
    
    const productData = await request.json();
    console.log('📦 Product data received:', productData);

    // ✅ NO NEED TO GENERATE SLUG MANUALLY - Model handles it automatically
    // Just remove slug from data if provided, let model generate it
    if (productData.slug) {
      delete productData.slug; // Let model generate a clean one
    }

    // Generate SKU if not provided (keep your existing logic)
    if (!productData.sku) {
      productData.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const product = await Product.create(productData);
    console.log('✅ Product created:', product._id);
    console.log('🔗 Auto-generated slug:', product.slug);

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

// ✅ ADD PUT METHOD FOR UPDATING PRODUCTS
export async function PUT(request) {
  try {
    console.log('🟢 PUT /api/products - Starting request...');
    await connectDB();
    
    const { _id, ...updateData } = await request.json();
    console.log('📦 Product update data received:', updateData);

    if (!_id) {
      return new Response(JSON.stringify({ 
        error: 'Product ID is required for update'
      }), { 
        status: 400 
      });
    }

    // ✅ Remove slug if name is being updated - model will regenerate it
    if (updateData.name && updateData.slug) {
      delete updateData.slug; // Let model regenerate based on new name
    }

    const product = await Product.findByIdAndUpdate(
      _id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!product) {
      return new Response(JSON.stringify({ 
        error: 'Product not found'
      }), { 
        status: 404 
      });
    }

    console.log('✅ Product updated:', product._id);
    console.log('🔗 Current slug:', product.slug);

    return new Response(JSON.stringify({
      success: true,
      message: 'Product updated successfully',
      product
    }), { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ PUT /api/products ERROR:', error);
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