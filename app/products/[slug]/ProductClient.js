
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductClient({ product }) {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Calculate pricing
  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savingAmount = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  // Fetch all products for related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (data.products) {
            // Filter products from same category, excluding current product
            const related = data.products
              .filter(p => p._id !== product._id && p.category === product.category)
              .slice(0, 4);
            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleAddToCart = async () => {
    if (!product.isInStock) return;
    
    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: selectedQuantity,
        }),
      });

      if (response.ok) {
        alert('Product added to cart successfully!');
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    window.location.href = '/checkout';
  };

  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: '/placeholder-product.jpg', alt: product.name, isPrimary: true }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-700">Products</Link>
            <span>/</span>
            <Link href={`/categories/${product.category}`} className="hover:text-gray-700 capitalize">
              {product.category}
            </Link>
            {product.subcategory && (
              <>
                <span>/</span>
                <Link href={`/categories/${product.category}/${product.subcategory}`} className="hover:text-gray-700 capitalize">
                  {product.subcategory}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Product images */}
          <div className="flex flex-col">
            {/* Main image */}
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
              <Image
                src={displayImages[selectedImage]?.url || displayImages[0]?.url}
                alt={displayImages[selectedImage]?.alt || product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
                priority
              />
            </div>

            {/* Image thumbnails */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex h-20 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 ${
                      index === selectedImage ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover object-center rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            {/* Product status */}
            <div className="flex items-center space-x-4 mb-4">
              {!product.isInStock && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
              {product.isOnSale && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  On Sale
                </span>
              )}
              {product.isFeatured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            {/* Brand */}
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Brand: <span className="font-medium text-gray-900">{product.brand}</span>
              </p>
              <p className="text-sm text-gray-600">
                SKU: <span className="font-medium text-gray-900">{product.sku}</span>
              </p>
            </div>

            {/* Ratings */}
            <div className="mt-3 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <svg
                    key={rating}
                    className={`h-5 w-5 flex-shrink-0 ${
                      product.rating?.average > rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-600">
                {product.rating?.average?.toFixed(1) || '0.0'} out of 5 stars
              </p>
              <p className="ml-4 text-sm text-gray-500">
                {product.rating?.count || 0} reviews
              </p>
            </div>

            {/* Pricing */}
            <div className="mt-4">
              <div className="flex items-center">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <>
                    <p className="text-3xl font-bold text-gray-900">
                      {product.currency} {product.price.toFixed(2)}
                    </p>
                    <p className="ml-2 text-xl text-gray-500 line-through">
                      {product.currency} {product.originalPrice.toFixed(2)}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      Save {discountPercentage}%
                    </p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    {product.currency} {product.price.toFixed(2)}
                  </p>
                )}
              </div>
              {savingAmount > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  You save {product.currency} {savingAmount.toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock status */}
            <div className="mt-4">
              {product.isInStock ? (
                <p className="text-sm text-green-600 font-medium">
                  {product.stock > product.lowStockAlert 
                    ? `In Stock (${product.stock} available)`
                    : `Only ${product.stock} left in stock!`
                  }
                </p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <div className="mt-4">
                <p className="text-gray-600">{product.shortDescription}</p>
              </div>
            )}

            {/* Quantity selector and buttons */}
            <div className="mt-6">
              <div className="flex items-center space-x-4 mb-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!product.isInStock}
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isInStock || isAddingToCart}
                  className={`flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    (!product.isInStock || isAddingToCart) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.isInStock || isAddingToCart}
                  className={`flex-1 bg-gray-900 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                    (!product.isInStock || isAddingToCart) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Additional info */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.shipping?.isFree ? 'Free shipping' : `Shipping: ${product.currency} ${product.shipping?.cost?.toFixed(2) || '0.00'}`}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">30-day return policy</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product details tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['description', 'specifications', 'features', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Specifications</h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'features' && product.features && product.features.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Features</h3>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {product.features.map((feature, index) => (
                      <li key={index} className="px-4 py-4">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Reviews</h3>
                  <div className="mt-2 flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <svg
                          key={rating}
                          className={`h-5 w-5 flex-shrink-0 ${
                            product.rating?.average > rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="ml-2 text-sm text-gray-600">
                      Based on {product.rating?.count || 0} reviews
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <p className="text-gray-600 text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/products/${relatedProduct.slug}`}>
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                      <Image
                        src={relatedProduct.thumbnail || relatedProduct.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="h-48 w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900">{relatedProduct.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{relatedProduct.brand}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-base font-medium text-gray-900">
                          {relatedProduct.currency} {relatedProduct.price.toFixed(2)}
                        </p>
                        {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                          <p className="text-sm text-gray-500 line-through">
                            {relatedProduct.currency} {relatedProduct.originalPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}