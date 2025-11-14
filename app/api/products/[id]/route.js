
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function PUT(request, { params }) {
  console.log('🟢 PUT /api/products/[id] - Starting request...');
  
  try {
    // ✅ FIX: Await the params promise
    const { id } = await params;
    
    console.log('📦 Updating product ID:', id);
    
    await connectDB();
    
    const updateData = await request.json();
    console.log('📦 Update data received:', updateData);

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      console.log('❌ Product not found:', id);
      return Response.json({ 
        success: false,
        error: 'Product not found' 
      }, { status: 404 });
    }

    console.log('✅ Product updated successfully:', updatedProduct._id);
    
    return Response.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('❌ PUT /api/products/[id] ERROR:', error);
    return Response.json({ 
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    // ✅ FIX: Await the params promise
    const { id } = await params;
    
    await connectDB();
    
    const product = await Product.findById(id);

    if (!product) {
      return Response.json({ 
        success: false,
        error: 'Product not found' 
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('❌ GET /api/products/[id] ERROR:', error);
    return Response.json({ 
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // ✅ FIX: Await the params promise
    const { id } = await params;
    
    await connectDB();
    
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return Response.json({ 
        success: false,
        error: 'Product not found' 
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('❌ DELETE /api/products/[id] ERROR:', error);
    return Response.json({ 
      success: false,
      error: error.message
    }, { status: 500 });
  }
}