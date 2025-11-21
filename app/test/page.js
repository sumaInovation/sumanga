
import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('✅ TEST ENDPOINT HIT - API is working on Render.com');
  
  return NextResponse.json({
    success: true,
    message: 'Payment API is working on Render.com',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
}

export async function POST(request) {
  console.log('✅ TEST POST ENDPOINT HIT');
  
  const body = await request.json();
  console.log('📦 TEST POST DATA:', body);
  
  return NextResponse.json({
    success: true,
    message: 'POST request received',
    received: body,
    timestamp: new Date().toISOString()
  });
}