
// app/products/[slug]/page.js
import { getProductSlugsForSitemap } from '@/lib/products-data';
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// REMOVE THIS DUPLICATE FUNCTION - it's already in lib/products-data.js
// export async function getProductSlugsForSitemap() {
//   try {
//     await connectDB();
//     // ... your code
//   } catch (error) {
//     return [];
//   }
// }

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

// Your existing getProduct function
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

// Your existing page component
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
            <div className="space-y-3 bg-gradient-to-r from-white to-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
              <p className="text-4xl font-bold text-slate-900">
                {product.currency} {product.price}
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