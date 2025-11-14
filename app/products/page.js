import Link from 'next/link';
import Image from 'next/image';

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: 'no-store'
    });
    
    if (!res.ok) return { products: [] };
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [] };
  }
}

export default async function ProductsPage() {
  const { products } = await getProducts();
  const publishedProducts = products.filter(p => p.status === 'published');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="mt-2 text-gray-600">
            {publishedProducts.length} products available
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {publishedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publishedProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    <Image
                      src={product.thumbnail || product.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="h-48 w-full object-cover object-center hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                    
                    {/* Status badges */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {!product.isInStock && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      )}
                      {product.isOnSale && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          On Sale
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {product.currency} {product.price.toFixed(2)}
                        </p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <p className="text-sm text-gray-500 line-through">
                            {product.currency} {product.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                      
                      {/* Discount badge */}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Stock info */}
                    <div className="mt-2">
                      <p className={`text-xs font-medium ${
                        product.stock > 10 ? 'text-green-600' : 
                        product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {product.stock > 0 
                          ? `${product.stock} in stock` 
                          : 'Out of stock'
                        }
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600">Check back later for new products!</p>
          </div>
        )}
      </div>
    </div>
  );
}