
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Log START - this should appear in Render logs
  console.log('🚨 ===== PAYHERE NOTIFICATION START =====');
  console.log('🕒 Timestamp:', new Date().toISOString());
  
  try {
    // Get the raw body first to see what's coming in
    const contentType = request.headers.get('content-type');
    console.log('📋 Content-Type:', contentType);
    
    // Check if it's form data
    if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      
      // Convert to object for logging
      const notificationData = {};
      for (const [key, value] of formData.entries()) {
        notificationData[key] = value;
      }
      
      console.log('✅ SUCCESS: Received form data from PayHere');
      console.log('📦 FULL NOTIFICATION DATA:', JSON.stringify(notificationData, null, 2));
      
      // Log important fields
      console.log('🔑 ORDER ID:', notificationData.order_id);
      console.log('💰 AMOUNT:', notificationData.payhere_amount);
      console.log('📊 STATUS CODE:', notificationData.status_code);
      console.log('📝 STATUS MESSAGE:', notificationData.status_message);
      console.log('🆔 PAYMENT ID:', notificationData.payment_id);
      console.log('🔐 MD5 SIG:', notificationData.md5sig ? 'PRESENT' : 'MISSING');
      
    } else {
      // Log raw body for debugging
      const rawBody = await request.text();
      console.log('❌ UNEXPECTED CONTENT TYPE');
      console.log('📦 RAW BODY:', rawBody);
    }
    
    console.log('✅ ===== PAYHERE NOTIFICATION PROCESSED SUCCESSFULLY =====');
    
    // Always return 200 OK
    return new Response('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
    
  } catch (error) {
    console.log('❌ ===== PAYHERE NOTIFICATION ERROR =====');
    console.log('💥 ERROR DETAILS:', error.message);
    console.log('📋 ERROR STACK:', error.stack);
    console.log('❌ ===== END ERROR =====');
    
    // Still return 200 to PayHere even on error
    return new Response('OK', { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      }
    });
  }
}