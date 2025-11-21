
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PayHerePayment({ orderDetails }) {
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const router = useRouter();

  const initializePayment = useCallback(async () => {
    setIsLoading(true);
    setDebugInfo('Starting payment process...');
    
    try {
      // Generate hash (keep your existing hash generation code)
      const hashResponse = await fetch('/api/payment/generate-payment-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
          order_id: orderDetails.order_id,
          amount: orderDetails.amount,
          currency: orderDetails.currency || 'LKR',
        }),
      });

      const hashData = await hashResponse.json();
      
      if (!hashResponse.ok || !hashData.hash) {
        throw new Error('Failed to generate payment hash');
      }

      // IMPORTANT: Use the debug notify_url
      const payment = {
        sandbox: true, // Use sandbox for testing
        merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
        return_url: undefined,
        cancel_url: undefined,
        notify_url: `${window.location.origin}/api/payment/payment-notify`, // Debug URL
        order_id: orderDetails.order_id,
        items: orderDetails.items || 'Test Payment',
        amount: orderDetails.amount.toString(),
        currency: orderDetails.currency || 'LKR',
        hash: hashData.hash,
        first_name: orderDetails.first_name || 'Test',
        last_name: orderDetails.last_name || 'User',
        email: orderDetails.email || 'test@example.com',
        phone: orderDetails.phone || '0770000000',
        address: orderDetails.address || 'Test Address',
        city: orderDetails.city || 'Colombo',
        country: orderDetails.country || 'Sri Lanka',
        custom_1: `debug_${Date.now()}`, // Add timestamp for tracking
        custom_2: 'debug_payment'
      };

      setDebugInfo('Payment object created. Starting PayHere popup...');

      // Start payment
      if (window.payhere && window.payhere.startPayment) {
        window.payhere.startPayment(payment);
      } else {
        throw new Error('PayHere SDK not loaded');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [orderDetails]);

  const loadPayHereSDK = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.payhere) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.payhere.lk/lib/payhere.js';
      script.async = true;
      
      script.onload = () => {
        console.log('PayHere SDK loaded');
        
        // Simple event handlers for debug
        window.payhere.onCompleted = function onCompleted(orderId) {
          console.log('Payment completed:', orderId);
          setDebugInfo(`Payment completed! Order: ${orderId}. Check server logs for notification.`);
          
          // You can check the notification in your server logs
          setTimeout(() => {
            alert('Payment completed! Check your server console for the notification data.');
          }, 1000);
        };

        window.payhere.onDismissed = function onDismissed() {
          console.log('Payment dismissed');
          setDebugInfo('Payment was cancelled by user.');
        };

        window.payhere.onError = function onError(error) {
          console.log('Payment error:', error);
          setDebugInfo(`Payment error: ${error}`);
        };

        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load PayHere SDK'));
      };

      document.head.appendChild(script);
    });
  }, []);

  const handlePayment = async () => {
    setDebugInfo('Loading PayHere SDK...');
    try {
      await loadPayHereSDK();
      await initializePayment();
    } catch (error) {
      setDebugInfo(`Error: ${error.message}`);
    }
  };

  return (
    <div className="w-full p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Test Payment (Debug Mode)</h3>
      
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-3 px-6 rounded disabled:bg-gray-400"
      >
        {isLoading ? 'Processing...' : 'Test PayHere Payment'}
      </button>

      {/* Debug Info Display */}
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <h4 className="font-semibold mb-2">Debug Information:</h4>
        <pre className="text-sm whitespace-pre-wrap">
          {debugInfo || 'Click the button to start payment test...'}
        </pre>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>🔍 <strong>How to test:</strong></p>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Click the payment button</li>
          <li>Complete the payment in PayHere popup</li>
          <li>Check your server console logs for notification data</li>
          <li>You should see "PAYHERE NOTIFICATION RECEIVED!" in logs</li>
        </ol>
      </div>
    </div>
  );
}