
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

async function getProduct(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    
    // Find product by slug from all products
    const product = data.products.find(p => p.slug === slug);
    return product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.'
    };
  }
  
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.description,
    keywords: product.keywords?.join(', '),
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: product.images?.map(img => img.url) || [],
    }
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();
  }
  
  return <ProductClient product={product} />;
}