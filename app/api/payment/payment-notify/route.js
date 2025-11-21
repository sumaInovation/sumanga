import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Get the form data from PayHere
    const formData = await request.formData();
    
    // Convert form data to simple object for logging
    const notificationData = {};
    for (const [key, value] of formData.entries()) {
      notificationData[key] = value;
    }

    // Log everything to console (check your server logs)
    console.log('🔔 PAYHERE NOTIFICATION RECEIVED!');
    console.log('📦 Full notification data:', JSON.stringify(notificationData, null, 2));
    console.log('📍 Order ID:', notificationData.order_id);
    console.log('💰 Amount:', notificationData.payhere_amount);
    console.log('📊 Status Code:', notificationData.status_code);
    console.log('📝 Status Message:', notificationData.status_message);
    console.log('🆔 Payment ID:', notificationData.payment_id);
    console.log('💳 Method:', notificationData.method);
    console.log('🔐 MD5 Signature:', notificationData.md5sig);

    // Also log to a file or external service if needed
    // You can check these logs in your server console or Vercel logs

    // Always return 200 OK to PayHere
    return new Response('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
    
  } catch (error) {
    console.error('❌ ERROR in notification handler:', error);
    
    // Still return 200 to PayHere even if we have errors
    return new Response('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
  }
}