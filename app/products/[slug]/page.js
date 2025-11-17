
// app/products/[slug]/page.js
import { getProductSlugsForSitemap } from '@/lib/products-data';
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ReviewForm } from './ReviewForm';

// Generate static paths for all products
export async function generateStaticParams() {
  try {
    const products = await getProductSlugsForSitemap();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📄 Generating static pages for ${products.length} products`);
    }
    
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.warn('Failed to generate static params:', error);
    return [];
  }
}

// Fetch product data with reviews
async function getProduct(slug) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Fetching product: ${slug}`);
    }

    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`❌ API responded with status: ${res.status} for slug: ${slug}`);
      }
      return null;
    }

    const data = await res.json();
    
    if (data.success && data.product) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Product found: ${data.product.name}`);
      }
      
      // ✅ Fetch real reviews for this product
      let reviews = [];
      try {
        const reviewsRes = await fetch(`${baseUrl}/api/products/${data.product._id}/reviews`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: "no-store",
        });

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          reviews = reviewsData.reviews || [];
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Fetched ${reviews.length} reviews for product`);
            // Debug: log user data from NEW schema
            reviews.forEach((review, index) => {
              console.log(`👤 Review ${index + 1} - UserInfo:`, {
                name: review.userInfo?.name,
                image: review.userInfo?.image,
                email: review.userInfo?.email
              });
            });
          }
        }
      } catch (reviewError) {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ Could not fetch reviews, using empty array:', reviewError.message);
        }
      }

      return {
        ...data.product,
        reviews: reviews
      };
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log(`❌ Product not found in response for slug: ${slug}`);
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching product:', error.message);
    return null;
  }
}

// Enhanced metadata for better SEO
export async function generateMetadata({ params }) {
  try {
    // ✅ FIX: Await params
    const { slug } = await params;

    if (!slug) {
      return {
        title: "Product Not Found | Sumaautomation",
        description: "Product not found. Browse our Arduino, PLC and electronics components in Sri Lanka.",
      };
    }

    const product = await getProduct(slug);
    
    if (!product) {
      return {
        title: "Product Not Found | Sumaautomation",
        description: "Product not found. Browse our Arduino, PLC and electronics components in Sri Lanka.",
      };
    }

    // Optimized SEO title and description
    const seoTitle = `${product.name} | Buy in Sri Lanka | Sumaautomation`;
    const truncatedDescription = product.description?.substring(0, 155) || 'Quality electronic components and automation solutions';
    const seoDescription = `${truncatedDescription}... Best prices, fast delivery, expert support. Buy ${product.name} in Sri Lanka.`;

    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.sumaautomation.lk';
    const productImage = product.thumbnail || product.images?.[0]?.url || `${baseUrl}/images/default-product.jpg`;

    return {
      title: seoTitle,
      description: seoDescription,
      
      alternates: {
        canonical: `${baseUrl}/products/${slug}`,
      },
      
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: `${baseUrl}/products/${slug}`,
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: `${product.name} - Sumaautomation Sri Lanka`,
          },
        ],
        type: 'website',
        siteName: 'Sumaautomation',
        locale: 'en_LK',
      },
      
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: [productImage],
      },
      
      keywords: product.tags?.join(', ') || `${product.name}, ${product.brand}, ${product.category}, electronics, automation, sri lanka`,
      
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        }
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Product Details | Sumaautomation",
      description: "View product details and specifications. Buy electronics components and automation solutions in Sri Lanka.",
    };
  }
}

// Product Schema for rich results with REAL reviews
function generateProductSchema(product, slug) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.sumaautomation.lk';
  
  // ✅ FIX: Ensure positive values and valid ranges
  const ratingValue = product.rating?.average || 0;
  const reviewCount = product.rating?.count || 0;
  
  // Ensure rating is between 1-5 and reviewCount is positive
  const safeRatingValue = Math.max(1, Math.min(5, ratingValue)); // Clamp between 1-5
  const safeReviewCount = Math.max(1, reviewCount); // Minimum 1 review
  
  // Set price valid for 30 days from now
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name || "Unnamed Product",
    "description": product.description?.substring(0, 200) || `${product.name} - Available at Suma Automation Sri Lanka`,
    "image": product.images?.map(img => img.url) || [product.thumbnail] || [`${baseUrl}/images/default-product.jpg`],
    "sku": product.sku || `SA-${slug}`,
    "mpn": product.sku || `SA-${slug}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Suma Automation"
    },
    // ✅ FIXED: Use safe values that meet Google's requirements
    "aggregateRating": {
      "@type": "AggregateRating", 
      "ratingValue": safeRatingValue.toString(),
      "reviewCount": safeReviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    // ✅ COMPLETE: Includes all recommended fields with corrections
    "offers": {
      "@type": "Offer",
      "price": product.price?.toString() || "0",
      "priceCurrency": product.currency || "LKR",
      "priceValidUntil": priceValidUntil,
      "availability": product.isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${baseUrl}/products/${slug}`,
      "seller": {
        "@type": "Organization",
        "name": "Suma Automation",
        "url": baseUrl
      },
      // ✅ CORRECTED: Shipping details with unitCode
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "LKR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "LK"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": "1",
            "maxValue": "2",
            "unitCode": "DAY" // ✅ ADDED: unitCode for days
          },
          "transitTime": {
            "@type": "QuantitativeValue", 
            "minValue": "3",
            "maxValue": "7",
            "unitCode": "DAY" // ✅ ADDED: unitCode for days
          }
        }
      },
      // ✅ CORRECTED: Return policy with applicableCountry
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn",
        "applicableCountry": "LK" // ✅ ADDED: applicable country
      }
    }
  };

  return schema;
}

// Safe Image Component (without event handlers for Server Components)
function SafeImage({ src, alt, className, sizes, priority = false }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}

// ✅ SIMPLE Avatar Component without event handlers (Server Component safe)
function UserAvatar({ userInfo, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  // Get user initials for fallback
  const getInitials = (name) => {
    if (!name) return "CU";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get color based on name for consistent avatar colors
  const getColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-red-500', 'bg-yellow-500', 'bg-indigo-500',
      'bg-pink-500', 'bg-teal-500'
    ];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  const userName = userInfo?.name || "Customer";
  const userImage = userInfo?.image;

  // Simple approach: Show image if available, otherwise show initials
  // No event handlers in Server Components
  return (
    <div className={`${sizeClasses[size]} relative`}>
      {userImage ? (
        // Simple img tag without onError handler
        <img
          src={userImage}
          alt={userName}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
        />
      ) : (
        // Fallback with initials
        <div
          className={`${sizeClasses[size]} rounded-full ${getColor(userName)} flex items-center justify-center text-white font-semibold ${textSizes[size]} border-2 border-gray-200`}
        >
          {getInitials(userName)}
        </div>
      )}
    </div>
  );
}

// ✅ UPDATED Review Item Component
function ReviewItem({ review }) {
  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 bg-white">
      {/* User Info Header with Avatar */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          {/* ✅ FIXED: Use userInfo instead of author */}
          <UserAvatar userInfo={review.userInfo} size="md" />
          
          {/* User Name and Rating */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {review.userInfo?.name || "Customer"} {/* ✅ FIXED */}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-gray-900 font-semibold text-sm">
                {review.rating}.0
              </span>
            </div>
          </div>
        </div>
        
        {/* Review Date */}
        <span className="text-sm text-gray-500 sm:text-right">
          {formatDate(review.createdAt)}
        </span>
      </div>
      
      {/* Review Title */}
      {review.title && (
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {review.title}
        </h3>
      )}
      
      {/* Review Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed line-clamp-4">{review.comment}</p>
      
      {/* Review Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {review.helpful?.count > 0 && (
            <span className="text-xs sm:text-sm">
              {review.helpful.count} people found this helpful
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 self-end sm:self-auto">
          <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium px-2 py-1 rounded hover:bg-blue-50">
            Helpful
          </button>
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-50">
            Report
          </button>
        </div>
      </div>
      
      {/* Admin Response */}
      {review.adminReply && (
        <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
            <span className="text-blue-600 font-semibold text-sm">Admin Response</span>
            <span className="text-blue-500 text-xs sm:text-sm">
              {formatDate(review.adminReply.repliedAt)}
            </span>
          </div>
          <p className="text-blue-700 text-sm sm:text-base">{review.adminReply.text}</p>
        </div>
      )}
    </div>
  );
}

// Main page component
export default async function ProductPage({ params }) {
  let product;
  let slug;
  
  try {
    // ✅ Get the slug from params
    const resolvedParams = await params;
    slug = resolvedParams.slug;

    if (!slug) {
      console.error('❌ No slug provided in params');
      return notFound();
    }

    product = await getProduct(slug);
    
    if (!product) {
      console.error(`❌ Product not found for slug: ${slug}`);
      return notFound();
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Rendering product page for: ${product.name}`);
      console.log(`📊 Found ${product.reviews?.length || 0} reviews`);
      // Debug: Check review structure
      if (product.reviews && product.reviews.length > 0) {
        console.log('🔍 Sample review structure:', {
          id: product.reviews[0]._id,
          userInfo: product.reviews[0].userInfo,
          rating: product.reviews[0].rating,
          comment: product.reviews[0].comment
        });
      }
    }

  } catch (error) {
    console.error('❌ Error in ProductPage:', error);
    return notFound();
  }

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  const rating = product.rating?.average || 0;
  const reviewCount = product.rating?.count || 0;
  const hasImages = product.images && product.images.length > 0;
  const primaryImage = product.thumbnail || product.images?.[0]?.url || "/images/placeholder-product.jpg";

  // ✅ Generate schema with real reviews
  const productSchema = generateProductSchema(product, slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Navigation Breadcrumb */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center space-x-2 text-sm overflow-x-auto">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium whitespace-nowrap"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href="/products" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium whitespace-nowrap"
            >
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-[150px] sm:max-w-xs md:max-w-md">
              {product.name}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Product Images - Mobile First */}
          <div className="space-y-4 order-1">
            {/* Main Image */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square relative">
                <SafeImage
                  src={primaryImage}
                  alt={product.name}
                  className="object-cover"
                  priority={true}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {hasImages && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.images.slice(0, 4).map((img, index) => (
                  <div 
                    key={index}
                    className="aspect-square relative border-2 border-gray-200 rounded-lg sm:rounded-xl bg-white overflow-hidden hover:border-blue-500 transition-all duration-200 cursor-pointer"
                  >
                    <SafeImage
                      src={img.url}
                      alt={`${product.name} - View ${index + 1}`}
                      className="object-cover"
                      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 12.5vw, 10vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details - Mobile First */}
          <div className="space-y-4 sm:space-y-6 order-2">
            {/* Title and Brand */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight break-words">
                {product.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-base sm:text-lg text-gray-600 font-medium">
                  Brand: <span className="text-blue-600">{product.brand}</span>
                </span>
                {product.category && (
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium self-start">
                    {product.category}
                  </span>
                )}
              </div>
            </div>

            {/* Rating - Mobile Optimized */}
            {rating > 0 && (
              <div className="flex items-center gap-3 bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-base sm:text-lg">★</span>
                  <span className="text-gray-900 font-semibold text-sm sm:text-base">{rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500 text-sm sm:text-base">({reviewCount} reviews)</span>
              </div>
            )}

            {/* Pricing - Mobile Optimized */}
            <div className="space-y-2 sm:space-y-3 bg-gradient-to-r from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {product.currency} {product.price?.toLocaleString()}
                </p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <p className="text-lg sm:text-xl text-gray-500 line-through">
                      {product.currency} {product.originalPrice?.toLocaleString()}
                    </p>
                    <span className="bg-red-500 text-white text-xs sm:text-sm px-2 py-1 rounded font-bold">
                      Save {discountPercentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Status - Mobile Optimized */}
            <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base ${
              product.isInStock 
                ? "bg-green-100 text-green-800 border border-green-200" 
                : "bg-red-100 text-red-800 border border-red-200"
            }`}>
              <span className="text-base">
                {product.isInStock ? "✓" : "✗"}
              </span>
              {product.isInStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
                disabled={!product.isInStock}
              >
                {product.isInStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button 
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-base sm:text-lg sm:w-auto w-full"
                aria-label="Add to wishlist"
              >
                ♡ Wishlist
              </button>
            </div>

            {/* Key Features - Mobile Optimized */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4">Key Features</h2>
                <ul className="text-gray-700 space-y-2 sm:space-y-3">
                  {product.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-500 text-lg mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description - Mobile Optimized */}
            {product.description && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications - Mobile Optimized */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4">Specifications</h2>
                <dl className="grid grid-cols-1 gap-2 sm:gap-3">
                  {Object.entries(product.specifications).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-0">
                      <dt className="font-medium text-gray-600 text-sm sm:text-base">{key}:</dt>
                      <dd className="text-gray-900 text-sm sm:text-base sm:text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* ✅ REVIEW FORM SECTION - Mobile Optimized */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <ReviewForm productId={product._id} productName={product.name} />
            </div>

            {/* ✅ UPDATED REAL REVIEWS SECTION - Mobile Optimized */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Customer Reviews ({product.reviews.length})
                  </h2>
                  {rating > 0 && (
                    <div className="flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg">
                      <span className="text-yellow-400 text-lg sm:text-xl">★</span>
                      <span className="text-gray-900 font-bold text-base sm:text-lg">{rating.toFixed(1)}</span>
                      <span className="text-gray-600 text-sm sm:text-base">out of 5</span>
                    </div>
                  )}
                </div>
                
                {/* Reviews Summary Stats - Mobile Optimized */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Rating Breakdown</h3>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const starCount = product.reviews.filter(r => r.rating === star).length;
                      const percentage = (starCount / product.reviews.length) * 100;
                      return (
                        <div key={star} className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm text-gray-600 w-6 sm:w-8">{star} ★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500 w-8 sm:w-12">({starCount})</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Review Highlights</h3>
                    <div className="flex items-center gap-2 text-green-600 text-sm sm:text-base">
                      <span>✓</span>
                      <span>{product.reviews.filter(r => r.rating >= 4).length} positive reviews</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 text-sm sm:text-base">
                      <span>💬</span>
                      <span>{product.reviews.filter(r => r.comment && r.comment.length > 50).length} detailed reviews</span>
                    </div>
                    {product.reviews.some(r => r.adminReply) && (
                      <div className="flex items-center gap-2 text-purple-600 text-sm sm:text-base">
                        <span>👨‍💼</span>
                        <span>{product.reviews.filter(r => r.adminReply).length} admin responses</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Individual Reviews with User Avatars - Mobile Optimized */}
                <div className="space-y-4 sm:space-y-6">
                  {product.reviews.map((review) => (
                    <ReviewItem key={review._id} review={review} />
                  ))}
                </div>
              </div>
            )}

            {/* No Reviews Message - Mobile Optimized */}
            {(!product.reviews || product.reviews.length === 0) && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 text-center">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">💬</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600 text-sm sm:text-base">Be the first to share your experience with this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";