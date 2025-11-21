'use client';

import { useState, useCallback } from 'react';

export default function PayHerePayment({ orderDetails, onPaymentComplete, onPaymentDismissed, onPaymentError }) {
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Generate hash from backend
      const hashResponse = await fetch('/api/generate-payment-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
          order_id: orderDetails.order_id,
          amount: orderDetails.amount,
          currency: orderDetails.currency,
        }),
      });

      const hashData = await hashResponse.json();

      if (!hashResponse.ok) {
        throw new Error(hashData.error || 'Failed to generate payment hash');
      }

      // Payment configuration
      const payment = {
        sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true',
        merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
        return_url: undefined,
        cancel_url: undefined,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment-notify`,
        ...orderDetails,
        hash: hashData.hash,
      };

      console.log('Starting payment with:', payment);

      // Initialize PayHere payment
      if (window.payhere && window.payhere.startPayment) {
        window.payhere.startPayment(payment);
      } else {
        throw new Error('PayHere SDK not loaded');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      onPaymentError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [orderDetails, onPaymentError]);

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
        // Set up PayHere event handlers
        window.payhere.onCompleted = (orderId) => {
          console.log('Payment completed for order:', orderId);
          onPaymentComplete?.(orderId);
        };

        window.payhere.onDismissed = () => {
          console.log('Payment dismissed by user');
          onPaymentDismissed?.();
        };

        window.payhere.onError = (error) => {
          console.error('Payment error:', error);
          onPaymentError?.(error);
        };

        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load PayHere SDK'));
      };

      document.head.appendChild(script);
    });
  }, [onPaymentComplete, onPaymentDismissed, onPaymentError]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      await loadPayHereSDK();
      await initializePayment();
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {isLoading ? 'Processing...' : `Pay LKR ${orderDetails.amount}`}
    </button>
  );
}