
// app/api/products/route.js
import { getAllPublishedProducts } from "@/lib/products-data";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// ✅ Slug generation helper function (moved to top for better organization)
function generateSlug(text) {
  if (!text) return '';
  
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

// ✅ Helper function to clean and validate slug
function cleanSlug(slug) {
  return slug
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// ✅ Helper function to generate unique slug
async function generateUniqueSlug(baseSlug, excludeId = null) {
  let finalSlug = baseSlug;
  let counter = 1;
  
  const query = excludeId 
    ? { slug: finalSlug, _id: { $ne: excludeId } }
    : { slug: finalSlug };
  
  while (await Product.findOne(query)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
    
    // Update query for next iteration
    if (excludeId) {
      query.slug = finalSlug;
    }
  }
  
  return finalSlug;
}

// ✅ Helper function to generate SKU
function generateSKU() {
  return `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

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
    console.log('📦 Product data received:', { 
      name: productData.name,
      slug: productData.slug,
      category: productData.category,
      brand: productData.brand,
      price: productData.price
    });

    // ✅ Validate required fields
    const requiredFields = ['name', 'price', 'category', 'brand'];
    const missingFields = requiredFields.filter(field => !productData[field]);
    
    if (missingFields.length > 0) {
      return new Response(JSON.stringify({ 
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }), { 
        status: 400 
      });
    }

    // ✅ Handle slug generation and validation
    let finalSlug = productData.slug || '';
    
    if (!finalSlug || finalSlug.trim() === '') {
      // Generate slug from name if not provided
      finalSlug = generateSlug(productData.name);
    }

    // Clean the slug
    finalSlug = cleanSlug(finalSlug);

    // ✅ Check for duplicate slug and make it unique
    finalSlug = await generateUniqueSlug(finalSlug);

    // ✅ Set the final slug
    productData.slug = finalSlug;

    // ✅ Generate SKU if not provided
    if (!productData.sku) {
      productData.sku = generateSKU();
    }

    // ✅ Ensure createdBy is set
    if (!productData.createdBy) {
      productData.createdBy = "6916ba84f8d28cd7a989ef1a"; // Default user ID
    }

    console.log('🔗 Final slug being saved:', productData.slug);
    console.log('🏷️  SKU being saved:', productData.sku);

    // ✅ Create product
    const product = await Product.create(productData);
    
    console.log('✅ Product created successfully:', product._id);
    console.log('🔗 Slug saved:', product.slug);

    return new Response(JSON.stringify({
      success: true,
      message: 'Product created successfully',
      product
    }), { 
      status: 201,
      headers: {
        'Content-Type': 'application/json',
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
        success: false,
        error: 'Validation failed',
        details: errors
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    if (error.code === 11000) {
      const field = error.keyPattern?.slug ? 'slug' : 'sku';
      return new Response(JSON.stringify({ 
        success: false,
        error: `${field.toUpperCase()} already exists. Please use a different ${field}.`,
        field: field
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

export async function PUT(request) {
  try {
    console.log('🟢 PUT /api/products - Starting request...');
    await connectDB();
    
    const { _id, ...updateData } = await request.json();
    console.log('📦 Product update data received:', { 
      _id,
      name: updateData.name,
      slug: updateData.slug,
      updates: Object.keys(updateData)
    });

    if (!_id) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Product ID is required for update'
      }), { 
        status: 400 
      });
    }

    // ✅ Check if product exists
    const existingProduct = await Product.findById(_id);
    if (!existingProduct) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Product not found'
      }), { 
        status: 404 
      });
    }

    // ✅ Handle slug updates if name is being changed
    if (updateData.name && updateData.name !== existingProduct.name) {
      let newSlug = updateData.slug || '';
      
      if (!newSlug || newSlug.trim() === '') {
        // Generate new slug from updated name
        newSlug = generateSlug(updateData.name);
      }

      // Clean the slug
      newSlug = cleanSlug(newSlug);

      // ✅ Check for duplicate slug and make it unique (excluding current product)
      updateData.slug = await generateUniqueSlug(newSlug, _id);
      
      console.log('🔗 Updated slug:', updateData.slug);
    } else if (updateData.slug && updateData.slug !== existingProduct.slug) {
      // If slug is manually changed, validate it
      updateData.slug = cleanSlug(updateData.slug);
      updateData.slug = await generateUniqueSlug(updateData.slug, _id);
    }

    // ✅ Update product
    const product = await Product.findByIdAndUpdate(
      _id, 
      updateData, 
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    console.log('✅ Product updated successfully:', product._id);
    console.log('🔗 Current slug:', product.slug);

    return new Response(JSON.stringify({
      success: true,
      message: 'Product updated successfully',
      product
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ PUT /api/products ERROR:', error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Validation failed',
        details: errors
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    if (error.code === 11000) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Slug or SKU already exists. Please use different values.',
        field: error.keyPattern?.slug ? 'slug' : 'sku'
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

// ✅ ADD DELETE METHOD
export async function DELETE(request) {
  try {
    console.log('🟢 DELETE /api/products - Starting request...');
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Product ID is required for deletion'
      }), { 
        status: 400 
      });
    }

    // ✅ Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Product not found'
      }), { 
        status: 404 
      });
    }

    // ✅ Delete product
    await Product.findByIdAndDelete(id);
    
    console.log('✅ Product deleted successfully:', id);

    return new Response(JSON.stringify({
      success: true,
      message: 'Product deleted successfully'
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ DELETE /api/products ERROR:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}