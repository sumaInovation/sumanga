
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

async function getProduct(slug, useCacheBust = false) {
  try {
    console.log('🟢 Fetching product for slug:', slug);
    
    // Use relative URL for API calls during build
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXTAUTH_URL 
      : 'http://localhost:3000';
    
    // Add timestamp to bust cache
    let url = `${baseUrl}/api/products/slug/${slug}`;
    if (useCacheBust) {
      const timestamp = Date.now();
      url += `?t=${timestamp}`;
    }
    
    const res = await fetch(url, {
      // Force no caching in production
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    const data = await res.json();
    
    if (!res.ok || !data.success) {
      console.log('❌ Product fetch failed:', data.error);
      return null;
    }
    
    console.log('✅ Product fetched successfully:', data.product?.name);
    return data.product;
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  // Use cache busting for metadata too
  const product = await getProduct(slug, true); // true = use cache busting
  
  if (!product) {
    return {
      title: 'Product Not Found - Suma Automation',
      description: 'The product you are looking for is not available at Suma Automation.',
    };
  }

  // Use environment variable for base URL
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.sumaautomation.lk';
  
  // Generate optimal description between 25-160 characters
  const generateOptimalDescription = (product) => {
    // Try existing descriptions first
    const existingDescription = product.metaDescription || 
      product.shortDescription || 
      product.description?.substring(0, 160);
    
    if (existingDescription && existingDescription.length >= 25) {
      return existingDescription.replace(/<[^>]*>/g, '').substring(0, 160);
    }
    
    // Enhanced fallback descriptions
    const enhancedDescriptions = [
      `Buy ${product.name} from ${product.brand}. ${product.category} available for ${product.currency} ${product.price}. Fast shipping across Sri Lanka.`,
      `Purchase ${product.name} - ${product.brand} ${product.category}. Best price ${product.currency} ${product.price}. Official warranty. Order from Suma Automation.`,
      `${product.name} by ${product.brand}. ${product.category} available in Sri Lanka. Price: ${product.currency} ${product.price}. Fast delivery from Suma Automation.`,
      `Get ${product.name} from ${product.brand}. ${product.category} at best price ${product.currency} ${product.price}. Official products with warranty in Sri Lanka.`
    ];
    
    // Select the most appropriate description
    let selectedDescription = enhancedDescriptions[0];
    
    // Choose a description that fits best (prioritize shorter ones that are still descriptive)
    for (const desc of enhancedDescriptions) {
      if (desc.length >= 25 && desc.length <= 160) {
        selectedDescription = desc;
        break;
      }
    }
    
    // Ensure final description is within limits
    return selectedDescription.substring(0, 160);
  };

  const cleanDescription = generateOptimalDescription(product);

  return {
    title: product.metaTitle || `${product.name} - ${product.brand} | Suma Automation`,
    description: cleanDescription,
    keywords: product.tags?.join(', ') || `${product.name}, ${product.brand}, electronics, Sri Lanka`,
    
    // Open Graph
    openGraph: {
      title: product.metaTitle || `${product.name} - ${product.brand}`,
      description: cleanDescription,
      images: [
        {
          url: product.thumbnail || product.images?.[0]?.url || `${baseUrl}/og-image.jpg`,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
      url: `${baseUrl}/products/${slug}`,
      siteName: 'Suma Automation',
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle || `${product.name} - ${product.brand}`,
      description: cleanDescription,
      images: [product.thumbnail || product.images?.[0]?.url || `${baseUrl}/og-image.jpg`],
    },
    
    // Additional meta tags for SEO
    alternates: {
      canonical: `${baseUrl}/products/${slug}`,
    },
    
    // Bing verification
    other: {
      'msvalidate.01': "2E5D63B8F0683F41631830141F3AF7C0",
    }
  };
}

// Generate static params for known products
export async function generateStaticParams() {
  // Return empty array during build to avoid API calls
  return [];
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug, true); // Use cache busting here too
  
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

      {/* Rest of your component remains the same */}
      {/* ... */}
    </div>
  );
}

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';