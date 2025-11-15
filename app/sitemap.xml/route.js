
// app/sitemap.xml/route.js
export async function GET() {
  const baseUrl ='https://www.sumaautomation.lk';

  try {
    const productsRes = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store'
    });

    let products = [];
    if (productsRes.ok) {
      const data = await productsRes.json();
      products = data.products || [];
    }

    const urls = [
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
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.7'
    }));

    const allUrls = [...urls, ...productUrls];

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

    return new Response(sitemap, {
      headers: { 'Content-Type': 'application/xml' }
    });

  } catch (error) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
       <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
         <url>
           <loc>${baseUrl}</loc>
         </url>
       </urlset>`,
      { headers: { 'Content-Type': 'application/xml' } }
    );
  }
}
