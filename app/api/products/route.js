
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

    // ✅ FIX: DON'T delete the slug - use what's provided or generate one
    if (!productData.slug || productData.slug.trim() === '') {
      // Generate slug from name if not provided
      if (productData.name) {
        productData.slug = generateSlug(productData.name);
      } else {
        return new Response(JSON.stringify({ 
          error: 'Product name is required to generate slug'
        }), { 
          status: 400 
        });
      }
    }

    // Clean the slug
    productData.slug = productData.slug
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    // ✅ Check for duplicate slug and make it unique
    let finalSlug = productData.slug;
    let counter = 1;
    
    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${productData.slug}-${counter}`;
      counter++;
    }
    
    productData.slug = finalSlug;

    // Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    console.log('🔗 Final slug being saved:', productData.slug);

    const product = await Product.create(productData);
    console.log('✅ Product created:', product._id);
    console.log('🔗 Slug saved:', product.slug);

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
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return new Response(JSON.stringify({ 
        error: 'Validation failed',
        details: errors
      }), { 
        status: 400 
      });
    }
    
    if (error.code === 11000) {
      return new Response(JSON.stringify({ 
        error: 'Slug or SKU already exists'
      }), { 
        status: 400 
      });
    }

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

// ✅ Add slug generation helper function
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
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

    // ✅ FIX: Only regenerate slug if name is being updated
    if (updateData.name && (!updateData.slug || updateData.slug.trim() === '')) {
      updateData.slug = generateSlug(updateData.name);
      
      // Make slug unique
      let finalSlug = updateData.slug;
      let counter = 1;
      
      while (await Product.findOne({ slug: finalSlug, _id: { $ne: _id } })) {
        finalSlug = `${updateData.slug}-${counter}`;
        counter++;
      }
      
      updateData.slug = finalSlug;
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