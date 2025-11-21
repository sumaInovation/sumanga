
import { NextResponse } from 'next/server';

// Store active connections
const clients = new Set();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const orderId = formData.get('order_id');
    const statusCode = formData.get('status_code');
    const paymentId = formData.get('payment_id');
    
    console.log('🔔 Notification received for order:', orderId);

    // Convert to simple object for broadcasting
    const notificationData = {};
    for (const [key, value] of formData.entries()) {
      notificationData[key] = value;
    }

    // Broadcast to all clients (in real app, use Redis Pub/Sub)
    clients.forEach(client => {
      if (client.orderId === orderId) {
        try {
          client.controller.enqueue(
            `data: ${JSON.stringify({
              type: 'payment_notification',
              orderId,
              statusCode,
              paymentId,
              data: notificationData,
              timestamp: new Date().toISOString()
            })}\n\n`
          );
        } catch (error) {
          console.error('Error sending to client:', error);
          clients.delete(client);
        }
      }
    });

    // Log for debugging
    console.log('📢 Broadcasted notification to clients:', clients.size);

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Notification error:', error);
    return new Response('OK', { status: 200 });
  }
}

// SSE connection handler
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  const stream = new ReadableStream({
    start(controller) {
      const client = { controller, orderId };
      clients.add(client);

      // Send connection confirmation
      controller.enqueue(`data: ${JSON.stringify({ 
        type: 'connected', 
        orderId,
        message: 'Listening for payment notifications...'
      })}\n\n`);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clients.delete(client);
      });
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