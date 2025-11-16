
// app/sitemap.xml/route.js
import { getProductSlugsForSitemap } from '@/lib/products-data';

export async function GET() {
  const baseUrl = 'https://www.sumaautomation.lk';

  try {
    console.log('🗺️ Generating sitemap with direct database access...');
    const products = await getProductSlugsForSitemap();
    
    console.log(`📝 Sitemap processing ${products.length} products`);

    const staticUrls = [
      {
        loc: `${baseUrl}/`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        loc: `${baseUrl}/products`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8'
      }
    ];

    const productUrls = products.map(product => ({
      loc: `${baseUrl}/products/${product.slug}`,
      lastmod: product.updatedAt?.toISOString() || new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    }));

    const allUrls = [...staticUrls, ...productUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`).join('')}
</urlset>`;

    console.log(`✅ Sitemap generated successfully with ${allUrls.length} URLs`);

    return new Response(sitemap, {
      headers: { 
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' // Cache 1 hour
      }
    });

  } catch (error) {
    console.error('❌ Sitemap generation failed:', error);
    return generateFallbackSitemap(baseUrl);
  }
}

function generateFallbackSitemap(baseUrl) {
  const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  return new Response(fallbackSitemap, {
    headers: { 
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-cache'
    }
  });
}

export const dynamic = 'force-dynamic';