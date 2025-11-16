
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

// Fetch product data with better caching and error handling
async function getProduct(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!baseUrl) {
      console.error('NEXT_PUBLIC_BASE_URL is not defined');
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout

    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: "no-store",
      signal: controller.signal,
      next: { 
        tags: [`product-${slug}`] // For revalidation
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        console.warn(`Product not found for slug: ${slug}`);
      } else {
        console.error(`API responded with status: ${res.status} for slug: ${slug}`);
      }
      return null;
    }

    const data = await res.json();
    return data.product || null;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timeout fetching product:', slug);
    } else {
      console.error('Error fetching product:', error);
    }
    return null;
  }
}

// Enhanced metadata for better SEO
// Dynamic metadata for SEO - CORRECTED VERSION
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (!slug) {
      return {
        title: "Product Not Found | sumaautomation",
        description: "Product not found. Browse our Arduino, PLC and electronics components in Sri Lanka.",
        robots: {
          index: false,
          follow: true,
        }
      };
    }

    const product = await getProduct(slug);
    
    if (!product) {
      return {
        title: "Product Not Found | sumaautomation",
        description: "Product not found. Browse our Arduino, PLC and electronics components in Sri Lanka.",
        robots: {
          index: false,
          follow: true,
        }
      };
    }

    // Optimized SEO title and description
    const seoTitle = `${product.name} - Buy in Sri Lanka | sumaautomation`;
    const truncatedDescription = product.description?.substring(0, 120) || 'Quality electronic components';
    const seoDescription = `Buy ${product.name} in Sri Lanka. ${truncatedDescription} Best price, fast delivery, expert support.`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sumaautomation.lk';
    const productImage = product.thumbnail || product.images?.[0]?.url || `${baseUrl}/title.jpg`;

    return {
      title: seoTitle,
      description: seoDescription,
      
      alternates: {
        canonical: `${baseUrl}/products/${slug}`,
      },
      
      openGraph: {
        title: `${product.name} - Buy Online | sumaautomation`,
        description: seoDescription,
        url: `${baseUrl}/products/${slug}`,
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: `Buy ${product.name} in Sri Lanka - sumaautomation`,
          },
        ],
        type: 'website', // ✅ CORRECTED: Use 'website' instead of 'product'
        siteName: 'sumaautomation',
        locale: 'en_LK',
      },
      
      twitter: {
        card: "summary_large_image",
        site: "@sumaautomation", // Add your Twitter handle if you have one
        title: `${product.name} - Buy in Sri Lanka`,
        description: seoDescription,
        images: [productImage],
      },
      
      keywords: `${product.name}, ${product.brand}, arduino, plc, electronics, sri lanka, buy online, ${product.category}`,
      
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
      
      // Additional meta tags for products
      other: {
        'product:brand': product.brand,
        'product:price:amount': product.price.toString(),
        'product:price:currency': product.currency,
        'product:availability': product.isInStock ? 'in stock' : 'out of stock',
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Product Details | sumaautomation",
      description: "View product details and specifications. Buy electronics components in Sri Lanka.",
      robots: {
        index: true,
        follow: true,
      }
    };
  }
}
// Product Schema for rich results
function generateProductSchema(product, slug) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sumaautomation.lk';
  
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images?.map(img => img.url) || [product.thumbnail],
    "sku": product.sku || slug,
    "mpn": product.mpn || slug,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/products/${slug}`,
      "priceCurrency": product.currency,
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      "availability": product.isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "sumaautomation",
        "url": baseUrl
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": product.currency
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "LK"
        }
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating.average.toString(),
      "reviewCount": product.rating.count.toString()
    } : undefined
  };
}

// Main page component with enhanced features
export default async function ProductPage({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (!slug) {
      console.error('No slug provided in params');
      return notFound();
    }

    const product = await getProduct(slug);
    
    if (!product) {
      console.error(`Product not found for slug: ${slug}`);
      return notFound();
    }

    const discountPercentage =
      product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : product.discount || 0;

    const rating = product.rating?.average || 0;
    const reviewCount = product.rating?.count || 0;
    const hasImages = product.images && product.images.length > 0;

    // Generate schema markup
    const productSchema = generateProductSchema(product, slug);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        
        {/* Navigation Breadcrumb with microdata */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm" itemScope itemType="https://schema.org/BreadcrumbList">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link 
                  href="/" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  itemProp="item"
                >
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li>
                <span className="mx-2 text-slate-400">/</span>
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link 
                  href="/products" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                  itemProp="item"
                >
                  <span itemProp="name">Products</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li>
                <span className="mx-2 text-slate-400">/</span>
              </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span className="text-slate-900 font-semibold truncate max-w-xs" itemProp="name">
                  {product.name}
                </span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </div>
        </nav>

        {/* Main Product Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8 lg:gap-12" itemScope itemType="https://schema.org/Product">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image
                src={product.thumbnail || product.images?.[0]?.url || "/placeholder-product.jpg"}
                width={600}
                height={600}
                alt={product.name}
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                priority
                itemProp="image"
              />
            </div>

            {hasImages && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <div 
                    key={i} 
                    className="border-2 border-slate-200 rounded-xl bg-white overflow-hidden hover:border-blue-500 transition-all duration-200 hover:shadow-md cursor-pointer"
                  >
                    <Image
                      src={img.url}
                      width={200}
                      height={200}
                      alt={`${product.name} - View ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight" itemProp="name">
                {product.name}
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Brand: <span className="text-blue-600" itemProp="brand" itemScope itemType="https://schema.org/Brand">
                  <span itemProp="name">{product.brand}</span>
                </span>
              </p>
            </div>

            {/* Rating with microdata */}
            {rating > 0 && (
              <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                <div className="flex items-center gap-1">
                  <span className="text-amber-500 text-lg">⭐</span>
                  <span className="text-slate-900 font-semibold" itemProp="ratingValue">{rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-500">(<span itemProp="reviewCount">{reviewCount}</span> reviews)</span>
              </div>
            )}

            {/* Pricing with microdata */}
            <div className="space-y-3 bg-gradient-to-r from-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <meta itemProp="priceCurrency" content={product.currency} />
              <p className="text-3xl lg:text-4xl font-bold text-slate-900">
                <span itemProp="price">{product.price}</span> {product.currency}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-4">
                  <p className="line-through text-slate-500 text-xl font-medium">
                    {product.currency} {product.originalPrice}
                  </p>
                  <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg">
                    🎉 Save {discountPercentage}%
                  </span>
                </div>
              )}
              <link itemProp="availability" href={product.isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white ${
              product.isInStock 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg" 
                : "bg-gradient-to-r from-red-500 to-rose-600 shadow-lg"
            }`}>
              <span className="text-lg">
                {product.isInStock ? "✓" : "✗"}
              </span>
              {product.isInStock ? "In Stock - Ready to Ship" : "Out of Stock"}
            </div>

            {/* Add to Cart Button */}
            <button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!product.isInStock}
            >
              {product.isInStock ? "🛒 Add to Cart" : "❌ Out of Stock"} - {product.currency} {product.price}
            </button>

            {/* Quick Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">🚀 Key Features</h2>
                <ul className="text-slate-700 space-y-2">
                  {product.features.slice(0, 5).map((f, i) => (
                    <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      <span className="text-green-500 text-lg shrink-0">✓</span>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  📝 Description
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line" itemProp="description">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  ⚙️ Specifications
                </h2>
                <dl className="grid grid-cols-1 gap-2">
                  {Object.entries(product.specifications).slice(0, 8).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                      <dt className="font-medium text-slate-600">{key}:</dt>
                      <dd className="text-slate-900 text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="text-2xl mb-2">🚚</div>
                <p className="text-sm font-medium text-slate-700">Fast Delivery</p>
                <p className="text-xs text-slate-500">Islandwide</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="text-2xl mb-2">🔒</div>
                <p className="text-sm font-medium text-slate-700">Secure Payment</p>
                <p className="text-xs text-slate-500">SSL Protected</p>
              </div>
            </div>

            {/* Related Products CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                🔧 Need More Components?
              </h3>
              <p className="text-slate-700 mb-4 text-sm">
                Explore our complete range of Arduino boards, PLC systems, and electronic components for your projects.
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg text-sm"
              >
                Browse All Products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in ProductPage:', error);
    return notFound();
  }
}

export const dynamic = "force-dynamic";