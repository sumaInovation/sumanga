
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request, context) {
  console.log("🟢 GET /api/products/slug/[slug] - Starting request...");

  try {
    const { slug } = await context.params;   // ✅ FIXED
    console.log("🔍 Looking for product with slug:", slug);

    if (!slug) {
      return Response.json({
        success: false,
        error: "Slug parameter is required",
        product: null,
      }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findOne({ slug });

    if (!product) {
      return Response.json({
        success: false,
        error: "Product not found",
        product: null,
      }, { status: 404 });
    }

    const data = JSON.parse(JSON.stringify(product));

    return Response.json({
      success: true,
      product: data,
    }, { status: 200 });

  } catch (error) {
    return Response.json({
      success: false,
      error: "Internal server error",
      message: error.message,
      product: null,
    }, { status: 500 });
  }
}
