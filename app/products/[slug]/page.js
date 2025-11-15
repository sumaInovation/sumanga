
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sumaautomation.lk';

// Fetch product by slug (server-side)
async function getProduct(slug) {
  try {
    const res = await fetch(`${BASE_URL}/api/products/slug/${slug}`, {
      cache: 'no-store', // always fresh
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) return null;
    return data.product;
  } catch (err) {
    console.error('Error fetching product:', err);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found - Suma Automation',
      description: 'The product you are looking for is not available at Suma Automation.',
    };
  }

  const title = product.metaTitle || `${product.name} | ${product.brand} - Suma Automation`;
  const description =
    product.metaDescription ||
    product.shortDescription ||
    product.description?.substring(0, 160) ||
    `Buy ${product.name} from ${product.brand} - Suma Automation Sri Lanka.`;

  return {
    title,
    description,
    keywords: `${product.name}, ${product.brand}, ${product.category}, electronics, automation, Sri Lanka`,
    alternates: { canonical: `${BASE_URL}/products/${product.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE_URL}/products/${product.slug}`,
      siteName: 'Suma Automation',
      images: [
        {
          url: product.thumbnail || product.images?.[0]?.url || `${BASE_URL}/og-image.jpg`,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.thumbnail || product.images?.[0]?.url || `${BASE_URL}/og-image.jpg`],
    },
    other: {
      'msvalidate.01': '2E5D63B8F0683F41631830141F3AF7C0',
    },
  };
}

// Pre-render known products (optional, for SSG)
export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/api/products`, { cache: 'no-store' });
    const products = await res.json();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  if (!product) notFound();

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const rating = product.rating?.average || 0;
  const reviewCount = product.rating?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
            <li className="flex items-center"><span className="text-gray-400 mx-2">/</span>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            </li>
            <li className="flex items-center"><span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
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
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.alt || `${product.name} - Image ${i + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">{product.category}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-600">by {product.brand}</p>
            </div>

            {rating > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} className={`w-5 h-5 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">({reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{product.currency} {product.price.toFixed(2)}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-xl text-gray-500 line-through">{product.currency} {product.originalPrice.toFixed(2)} <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full">Save {discount}%</span></p>
              )}
            </div>

            {/* Stock */}
            <p className={`text-lg font-semibold ${product.isInStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.isInStock ? '✅ In Stock' : '❌ Out of Stock'}
            </p>

            {/* Description */}
            {product.description && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Force server-side dynamic rendering
export const dynamic = 'force-dynamic';
