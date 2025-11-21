import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    // PayHere sends data as application/x-www-form-urlencoded
    const formData = await request.formData();
    
    const paymentData = {
      merchant_id: formData.get('merchant_id'),
      order_id: formData.get('order_id'),
      payhere_amount: formData.get('payhere_amount'),
      payhere_currency: formData.get('payhere_currency'),
      status_code: formData.get('status_code'),
      md5sig: formData.get('md5sig'),
      payment_id: formData.get('payment_id'),
      method: formData.get('method'),
      status_message: formData.get('status_message'),
      custom_1: formData.get('custom_1'),
      custom_2: formData.get('custom_2'),
      card_holder_name: formData.get('card_holder_name'),
      card_no: formData.get('card_no'),
      card_expiry: formData.get('card_expiry')
    };

    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    // Verify the payment signature
    const innerHash = crypto
      .createHash('md5')
      .update(merchant_secret)
      .digest('hex')
      .toUpperCase();

    const local_md5sig = crypto
      .createHash('md5')
      .update(
        paymentData.merchant_id +
        paymentData.order_id +
        paymentData.payhere_amount +
        paymentData.payhere_currency +
        paymentData.status_code +
        innerHash
      )
      .digest('hex')
      .toUpperCase();

    console.log('Payment notification received:', paymentData);
    console.log('Signature verification:', {
      local: local_md5sig,
      received: paymentData.md5sig,
      matches: local_md5sig === paymentData.md5sig
    });

    if (local_md5sig === paymentData.md5sig) {
      // Signature verified
      if (paymentData.status_code == 2) {
        // Payment successful
        console.log('Payment successful for order:', paymentData.order_id);
        
        // TODO: Update your database here
        // Example: updateOrderStatus(paymentData.order_id, 'completed');
        
        return NextResponse.json({ 
          status: 'success',
          message: 'Payment verified and processed'
        });
      } else {
        // Payment failed or other status
        console.log('Payment status:', paymentData.status_code, 'for order:', paymentData.order_id);
        
        // TODO: Update order status accordingly
        // Example: updateOrderStatus(paymentData.order_id, 'failed');
        
        return NextResponse.json({ 
          status: 'failed',
          message: `Payment failed with status: ${paymentData.status_code}`
        });
      }
    } else {
      // Signature verification failed
      console.error('Payment signature verification failed for order:', paymentData.order_id);
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}