
import Link from 'next/link';
import { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import ProductsSkeleton from './ProductsSkeleton';

// Server component that fetches data
async function ProductsGrid() {
  async function getProducts() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        cache: 'no-store',
        next: { tags: ['products'] }
      });
      
      if (!res.ok) {
        console.error('Failed to fetch products:', res.status);
        return { products: [] };
      }
      
      const data = await res.json();
      console.log('Fetched products:', data.products?.length || 0);
      
      // Ensure products have safe default values
      const safeProducts = data.products?.map(product => ({
        ...product,
        rating: typeof product.rating === 'number' ? product.rating : 0,
        reviewCount: product.reviewCount || 0,
        price: typeof product.price === 'number' ? product.price : 0,
        originalPrice: typeof product.originalPrice === 'number' ? product.originalPrice : undefined,
        stock: typeof product.stock === 'number' ? product.stock : 0,
        isInStock: product.isInStock ?? true,
        isOnSale: product.isOnSale ?? false,
        isFeatured: product.isFeatured ?? false,
        status: product.status || 'draft',
        categories: product.categories || product.category 
          ? [product.category || 'general'].filter(Boolean)
          : ['general'],
        createdAt: product.createdAt || new Date().toISOString()
      })) || [];
      
      return { products: safeProducts };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [] };
    }
  }

  const { products } = await getProducts();
  const publishedProducts = products.filter(p => p.status === 'published');
  
  console.log('Published products:', publishedProducts.length);

  // Pass the data to the client component
  return <ProductsClient initialProducts={publishedProducts} />;
}

// Main page component
export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Our Products</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products
            </p>
          </div>
        </div>
      </div>

      {/* Products with Suspense */}
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsGrid />
      </Suspense>

      {/* Newsletter Section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold mb-3">Stay Updated</h2>
          <p className="text-gray-300 mb-6 text-sm">
            Be the first to know about new products and exclusive deals
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}