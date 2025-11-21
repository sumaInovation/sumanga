import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: 'connected', orderId })}\n\n`);
      
      // Keep connection open
      this.keepAlive = setInterval(() => {
        controller.enqueue(`data: ${JSON.stringify({ type: 'ping' })}\n\n`);
      }, 30000);
    },
    cancel() {
      if (this.keepAlive) clearInterval(this.keepAlive);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}