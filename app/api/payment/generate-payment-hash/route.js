import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { merchant_id, order_id, amount, currency } = await request.json();
    
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;
    
    if (!merchant_secret) {
      return NextResponse.json(
        { error: 'Merchant secret not configured' },
        { status: 500 }
      );
    }

    // Generate hash as per PayHere documentation
    const innerHash = crypto
      .createHash('md5')
      .update(merchant_secret)
      .digest('hex')
      .toUpperCase();

    const hashString = merchant_id + order_id + 
                      parseFloat(amount).toFixed(2) + 
                      currency + innerHash;

    const hash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    return NextResponse.json({ hash });
  } catch (error) {
    console.error('Error generating hash:', error);
    return NextResponse.json(
      { error: 'Failed to generate payment hash' },
      { status: 500 }
    );
  }
}