

// app/products/[slug]/page.js
import { getProductSlugsForSitemap } from '@/lib/products-data';
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Generate static paths for all products
export async function generateStaticParams() {
  try {
    const products = await getProductSlugsForSitemap();
    
    console.log(`📄 Generating static pages for ${products.length} products`);
    
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.warn('Failed to generate static params:', error);
    return [];
  }
}

// Fetch product data
async function getProduct(slug) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    console.log(`🔍 Fetching product: ${slug}`);

    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.log(`❌ API responded with status: ${res.status} for slug: ${slug}`);
      return null;
    }

    const data = await res.json();
    
    if (data.success && data.product) {
      console.log(`✅ Product found: ${data.product.name}`);
      return data.product;
    } else {
      console.log(`❌ Product not found in response for slug: ${slug}`);
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
        // ✅ FIX: Use 'website' instead of 'product'
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

// Product Schema for rich results
function generateProductSchema(product, slug) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.sumaautomation.lk';
  
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description?.substring(0, 200) || `${product.name} - Available at Suma Automation Sri Lanka`,
    "image": product.images?.map(img => img.url) || [product.thumbnail] || [`${baseUrl}/images/default-product.jpg`],
    "sku": product.sku || `SA-${slug}`,
    "mpn": product.sku || `SA-${slug}`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Sumaautomation"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/products/${slug}`,
      "priceCurrency": product.currency || "LKR",
      "price": product.price?.toString() || "0",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Sumaautomation",
        "url": baseUrl
      }
    }
  };

  // Add rating if available
  if (product.rating?.average && product.rating.average > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating.average.toString(),
      "reviewCount": product.rating.count.toString()
    };
  }

  return schema;
}

// Main page component
// Main page component
export default async function ProductPage({ params }) {
  let product;
  let slug; // ✅ Declare slug at the top level
  
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

    console.log(`✅ Rendering product page for: ${product.name}`);

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

  // ✅ Now slug is available in this scope
  const productSchema = generateProductSchema(product, slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Navigation Breadcrumb */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              href="/products" 
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-xs md:max-w-md">
              {product.name}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {hasImages && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, index) => (
                  <div 
                    key={index}
                    className="aspect-square relative border-2 border-gray-200 rounded-lg bg-white overflow-hidden hover:border-blue-500 transition-all duration-200 cursor-pointer"
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} - View ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Brand */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-lg text-gray-600 font-medium">
                  Brand: <span className="text-blue-600">{product.brand}</span>
                </span>
                {product.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                )}
              </div>
            </div>

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="text-gray-900 font-semibold">{rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500">({reviewCount} reviews)</span>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-3 bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {product.currency} {product.price?.toLocaleString()}
                </p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <p className="text-xl text-gray-500 line-through">
                      {product.currency} {product.originalPrice?.toLocaleString()}
                    </p>
                    <span className="bg-red-500 text-white text-sm px-2 py-1 rounded font-bold">
                      Save {discountPercentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              product.isInStock 
                ? "bg-green-100 text-green-800 border border-green-200" 
                : "bg-red-100 text-red-800 border border-red-200"
            }`}>
              <span className="text-lg">
                {product.isInStock ? "✓" : "✗"}
              </span>
              {product.isInStock ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!product.isInStock}
              >
                {product.isInStock ? "Add to Cart" : "Out of Stock"}
              </button>
              <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                ♡
              </button>
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
                <ul className="text-gray-700 space-y-2">
                  {product.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="text-green-500 text-lg">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
                <dl className="grid grid-cols-1 gap-3">
                  {Object.entries(product.specifications).slice(0, 6).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="font-medium text-gray-600">{key}:</dt>
                      <dd className="text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";