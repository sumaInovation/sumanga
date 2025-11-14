
// app/api/products/[id]/route.js
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// GET - Fetch single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log(`🟢 GET /api/products/${id} - Fetching single product`);
    
    await connectDB();

    const product = await Product.findById(id);
    
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log(`✅ Found product: ${product.name}`);
    return Response.json({
      success: true,
      product
    });

  } catch (error) {
    console.error(`❌ GET /api/products/${params.id} error:`, error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    console.log(`🟢 PUT /api/products/${id} - Updating product`);
    
    await connectDB();
    const updateData = await request.json();

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log(`✅ Updated product: ${product.name}`);
    return Response.json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    console.error(`❌ PUT /api/products/${params.id} error:`, error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    console.log(`🟢 DELETE /api/products/${id} - Deleting product`);
    
    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log(`✅ Deleted product: ${product.name}`);
    return Response.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error(`❌ DELETE /api/products/${params.id} error:`, error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}