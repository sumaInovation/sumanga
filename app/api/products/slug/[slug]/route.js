
// app/api/products/slug/[slug]/route.js
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request, context) {
  console.log("🟢 GET /api/products/slug/[slug] - Starting request...");

  try {
    // ✅ ALTERNATIVE FIX: Use context.params and await it
    const resolvedParams = await context.params;
    const slug = resolvedParams.slug;
    
    console.log("🔍 Looking for product with slug:", slug);

    if (!slug) {
      console.log("❌ Slug parameter is missing");
      return new Response(JSON.stringify({
        success: false,
        error: "Slug parameter is required",
        product: null,
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectDB();
    console.log("🔗 Database connected");

    // Find published product by slug
    const product = await Product.findOne({ 
      slug: slug,
      status: 'published'
    });

    if (!product) {
      console.log("❌ Product not found for slug:", slug);
      return new Response(JSON.stringify({
        success: false,
        error: "Product not found",
        product: null,
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("✅ Product found:", product.name);
    
    // Convert to plain object
    const data = JSON.parse(JSON.stringify(product));

    return new Response(JSON.stringify({
      success: true,
      product: data,
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error("❌ GET /api/products/slug/[slug] ERROR:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error",
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      product: null,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}