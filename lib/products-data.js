
// lib/products-data.js
import { connectDB } from "./mongodb";
import Product from "@/models/Product";

/**
 * Shared function to get all published products
 * Used by both API routes and sitemap
 */
export async function getAllPublishedProducts() {
  try {
    await connectDB();
    
    const products = await Product.find({ 
      published: { $ne: false }
    })
    .sort({ createdAt: -1 })
    .lean();
    
    console.log(`📊 Database: Found ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ Database error in getAllPublishedProducts:', error);
    return [];
  }
}

/**
 * Get only product slugs for sitemap and static generation
 */
export async function getProductSlugsForSitemap() {
  try {
    await connectDB();
    
    const products = await Product.find(
      { 
        published: { $ne: false },
        slug: { $exists: true, $ne: '' } 
      },
      'slug updatedAt'
    ).lean();
    
    console.log(`🔗 Found ${products.length} products with valid slugs`);
    return products;
  } catch (error) {
    console.error('❌ Database error in getProductSlugsForSitemap:', error);
    return [];
  }
}