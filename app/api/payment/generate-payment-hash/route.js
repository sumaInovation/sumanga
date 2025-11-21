
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  console.log('Generate payment hash API called');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { merchant_id, order_id, amount, currency } = body;

    // Validate required fields
    if (!merchant_id || !order_id || !amount || !currency) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: merchant_id, order_id, amount, currency' 
        },
        { status: 400 }
      );
    }

    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;
    
    if (!merchant_secret) {
      console.error('Merchant secret not found in environment variables');
      return NextResponse.json(
        { 
          success: false,
          error: 'Server configuration error - Merchant secret not set' 
        },
        { status: 500 }
      );
    }

    // Generate hash as per PayHere documentation
    const innerHash = crypto
      .createHash('md5')
      .update(merchant_secret)
      .digest('hex')
      .toUpperCase();

    const amountFormatted = parseFloat(amount).toFixed(2);
    
    const hashString = merchant_id + 
                      order_id + 
                      amountFormatted + 
                      currency + 
                      innerHash;

    const hash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    console.log('Hash generated successfully for order:', order_id);

    return NextResponse.json({ 
      success: true,
      hash: hash
    });

  } catch (error) {
    console.error('Error in generate-payment-hash:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}