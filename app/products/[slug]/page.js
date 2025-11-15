
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

async function getProduct(slug) {
  try {
    console.log('🟢 Fetching product for slug:', slug);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${slug}`, {
      cache: 'no-store'
    });
    
    const data = await res.json();
    
    if (!res.ok || !data.success) {
      console.log('❌ Product fetch failed:', data.error);
      return null;
    }
    
    console.log('✅ Product fetched successfully:', data.product.name);
    return data.product;
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return null;
  }
}

// Generate metadata for SEO
// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for is not available.',
    };
  }

  const description = product.metaDescription || 
    product.shortDescription || 
    product.description?.substring(0, 160) || 
    `Buy ${product.name} from ${product.brand}. Best price ${product.currency} ${product.price}.`;

  return {
    title: product.metaTitle || `${product.name} - ${product.brand}`,
    description,
    openGraph: {
      title: product.metaTitle || `${product.name} - ${product.brand}`,
      description: description.substring(0, 160),
      images: [
        {
          url: product.thumbnail || product.images?.[0]?.url || '/og-image.jpg',
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website', // Changed from 'product' to 'website'
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle || `${product.name} - ${product.brand}`,
      description: description.substring(0, 160),
      images: [product.thumbnail || product.images?.[0]?.url || '/og-image.jpg'],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

  // Calculate discount percentage based on your schema
  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  // Use rating from your schema structure
  const rating = product.rating?.average || 0;
  const reviewCount = product.rating?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Image
                src={product.thumbnail || product.images?.[0]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:border-blue-500">
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} - Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">by {product.brand}</p>
            </div>

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <p className="text-3xl font-bold text-gray-900">
                  {product.currency} {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                </p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <p className="text-xl text-gray-500 line-through">
                      {product.currency} {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : '0.00'}
                    </p>
                    <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              {product.isOnSale && (
                <p className="text-green-600 font-semibold flex items-center gap-1">
                  <span>🔥</span> Limited Time Offer
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="space-y-2">
              <p className={`text-lg font-semibold ${
                product.isInStock ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.isInStock ? '✅ In Stock' : '❌ Out of Stock'}
              </p>
              {product.stock > 0 && (
                <p className="text-gray-600">
                  {product.stock} units available
                </p>
              )}
            </div>

            {/* SKU */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">SKU:</span>
              <span>{product.sku}</span>
            </div>

            {/* Add to Cart Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button className="px-4 py-3 text-gray-600 hover:bg-gray-100">-</button>
                  <span className="px-4 py-3 border-l border-r border-gray-300 font-semibold">1</span>
                  <button className="px-4 py-3 text-gray-600 hover:bg-gray-100">+</button>
                </div>
                
                <button
                  disabled={!product.isInStock}
                  className={`flex-1 px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                    product.isInStock
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
                <ul className="space-y-2 text-gray-600">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}