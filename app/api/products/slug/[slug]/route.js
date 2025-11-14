import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import dbConnect from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const product = await Product.findOne({ slug: params.slug, status: 'published' })
      .populate('createdBy', 'name email')
      .select('-__v');

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { 
      $inc: { viewCount: 1 } 
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}