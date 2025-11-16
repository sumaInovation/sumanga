
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!baseUrl) {
      console.error('NEXT_PUBLIC_BASE_URL is not defined');
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`API responded with status: ${res.status} for slug: ${slug}`);
      return null;
    }

    const data = await res.json();
    return data.product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (!slug) {
      return {
        title: "Product Not Found | sumaautomation",
        description: "Product not found. Browse our Arduino, PLC and electronics components in Sri Lanka."
      };
    }

    const product = await getProduct(slug);
    
    if (!product) {
      return {
        title: "Product Not Found | sumaautomation",
        description: "Product not found. Browse our Arduino, PLC and electronics components in Sri Lanka."
      };
    }

    // Create SEO-optimized title and description
    const seoTitle = `${product.name} - Buy in Sri Lanka | sumaautomation`;
    const seoDescription = `Buy ${product.name} in Sri Lanka. ${product.description?.substring(0, 160) || 'Best quality electronic components'} Best price, fast delivery, expert support for Arduino and PLC projects.`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sumaautomation.lk';

    return {
      title: seoTitle,
      description: seoDescription,
      
      alternates: {
        canonical: `${baseUrl}/products/${slug}`,
      },
      
      openGraph: {
        title: `${product.name} - sumaautomation`,
        description: seoDescription,
        url: `${baseUrl}/products/${slug}`,
        images: [
          {
            url: product.thumbnail || product.images?.[0]?.url || `${baseUrl}/title.jpg`,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        type: 'article',
      },
      
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - sumaautomation`,
        description: seoDescription,
      },
      
      keywords: `${product.name}, ${product.brand}, arduino, plc, electronics, sri lanka, buy ${product.name.toLowerCase()}`,
      
      robots: {
        index: true,
        follow: true,
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Product Page | sumaautomation",
      description: "Browse our electronics components and automation products in Sri Lanka."
    };
  }
}

// Main page component
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
        {/* Navigation Breadcrumb */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link 
                  href="/" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  Home
                </Link>
              </li>
              <li>
                <span className="mx-2 text-slate-400">/</span>
                <Link 
                  href="/products" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  Products
                </Link>
              </li>
              <li>
                <span className="mx-2 text-slate-400">/</span>
                <span className="text-slate-900 font-semibold truncate max-w-xs">
                  {product.name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Main Product Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <Image
                src={product.thumbnail || product.images?.[0]?.url || "/placeholder.jpg"}
                width={600}
                height={600}
                alt={product.name}
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((img, i) => (
                  <div 
                    key={i} 
                    className="border-2 border-slate-200 rounded-xl bg-white overflow-hidden hover:border-blue-500 transition-all duration-200 hover:shadow-md"
                  >
                    <Image
                      src={img.url}
                      width={200}
                      height={200}
                      alt={`${product.name} - Image ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Title and Brand */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                by <span className="text-blue-600">{product.brand}</span>
              </p>
            </div>

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-200">
                <div className="flex items-center gap-1">
                  <span className="text-amber-500 text-lg">⭐</span>
                  <span className="text-slate-900 font-semibold">{rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-500">({reviewCount} reviews)</span>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-3 bg-linear-to-r from-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
              <p className="text-4xl font-bold text-slate-900">
                {product.currency} {product.price}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-4">
                  <p className="line-through text-slate-500 text-xl font-medium">
                    {product.currency} {product.originalPrice}
                  </p>
                  <span className="bg-linear-to-r from-red-500 to-pink-600 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg">
                    🎉 Save {discountPercentage}%
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white ${
              product.isInStock 
                ? "bg-linear-to-r from-green-500 to-emerald-600 shadow-lg" 
                : "bg-linear-to-r from-red-500 to-rose-600 shadow-lg"
            }`}>
              <span className="text-lg">
                {product.isInStock ? "✓" : "✗"}
              </span>
              {product.isInStock ? "In Stock - Ready to Ship" : "Out of Stock"}
            </div>

            {/* Add to Cart Button */}
            <button className="w-full bg-linear-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg">
              🛒 Add to Cart - {product.currency} {product.price}
            </button>

            {/* Description */}
            {product.description && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Description
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Key Features
                </h2>
                <ul className="text-slate-700 space-y-3">
                  {product.features.map((f, i) => (
                    <li 
                      key={i} 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    >
                      <span className="text-green-500 text-lg shrink-0">✓</span>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Specifications
                </h2>
                <dl className="grid grid-cols-1 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                      <dt className="font-medium text-slate-600">{key}:</dt>
                      <dd className="text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Related Products Suggestion */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                🔧 Need More Components?
              </h3>
              <p className="text-slate-700 mb-4">
                Check out our complete range of Arduino boards, PLC systems, and electronic components for your projects.
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg"
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