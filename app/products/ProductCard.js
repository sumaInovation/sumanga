
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const rating = typeof product.rating === 'number' ? product.rating : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.isInStock) {
      console.log('Add to cart:', product._id);
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Compact Image */}
        <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
          <Image
            src={product.thumbnail || product.images?.[0]?.url || '/placeholder-product.jpg'}
            alt={product.name}
            width={200}
            height={150}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Sale Badge Only */}
          {product.isOnSale && discountPercentage > 0 && (
            <span className="absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-500 text-white">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Compact Product Info */}
        <div className="p-3">
          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors min-h-10">
            {product.name}
          </h3>

          {/* Brand */}
          <p className="text-xs text-gray-600 mb-2">{product.brand}</p>

          {/* Rating - Compact */}
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-3 h-3 ${
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
              <span className="text-xs text-gray-600">{rating.toFixed(1)}</span>
            </div>
          )}

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Price and Add to Cart in one line */}
          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <div className="flex flex-col">
              <p className="text-lg font-bold text-gray-900">
                {product.currency} {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-xs text-gray-500 line-through">
                  {product.currency} {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : '0.00'}
                </p>
              )}
            </div>
            
            {/* Add to Cart Button */}
            <button 
              className={`shrink-0 px-3 py-2 rounded text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                product.isInStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!product.isInStock}
              onClick={handleAddToCart}
            >
              {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Stock Status - Very subtle */}
          {!product.isInStock && (
            <p className="text-xs text-red-600 mt-1 text-center">
              Out of Stock
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}