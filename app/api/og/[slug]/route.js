
import { ImageResponse } from '@vercel/og';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

// runtime nodejs
export const runtime = 'nodejs';

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    await connectDB();
    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return new Response('Product not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            background: 'white',
            width: '1200px',
            height: '630px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 60,
            fontWeight: 'bold',
            color: '#111',
            padding: 40,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div style={{ textAlign: 'center' }}>{product.name}</div>
          <div style={{ fontSize: 40, color: '#555', marginTop: 20 }}>
            {product.brand}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error('OG Image Error:', err);
    return new Response('Failed to generate image', { status: 500 });
  }
}