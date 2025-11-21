

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PayHerePayment({ orderDetails }) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initializePayment = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      console.log('Starting payment for order:', orderDetails.order_id);
      
      const hashResponse = await fetch('/api/payment/generate-payment-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '121XXXX',
          order_id: orderDetails.order_id,
          amount: orderDetails.amount,
          currency: orderDetails.currency || 'LKR',
        }),
      });

      console.log('Hash API response status:', hashResponse.status);

      let hashData;
      try {
        hashData = await hashResponse.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!hashResponse.ok) {
        throw new Error(hashData.error || `Server error: ${hashResponse.status}`);
      }

      if (!hashData.success) {
        throw new Error(hashData.error || 'Failed to generate payment hash');
      }

      if (!hashData.hash) {
        throw new Error('No hash returned from server');
      }

      console.log('Payment hash generated successfully:', hashData.hash);

      const payment = {
        sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true',
        merchant_id: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '121XXXX',
        return_url: undefined,
        cancel_url: undefined,
        notify_url: `${window.location.origin}/api/payment/payment-notify`,
        ...orderDetails,
        hash: hashData.hash,
      };

      console.log('Payment object created, starting PayHere...');

      if (window.payhere && window.payhere.startPayment) {
        window.payhere.startPayment(payment);
      } else {
        throw new Error('PayHere SDK not loaded');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Failed to initialize payment');
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
        console.log('PayHere SDK loaded successfully');
        
        // FIX: Pass the order_id when payment is completed
        window.payhere.onCompleted = function onCompleted(orderId) {
          console.log('Payment completed for order:', orderId);
          setPaymentStatus('completed');
          setErrorMessage('');
          
          // FIX: Redirect to success page WITH order_id
          setTimeout(() => {
            router.push(`/payment/success?order_id=${orderId}`);
          }, 1500);
        };

        window.payhere.onDismissed = function onDismissed() {
          console.log('Payment dismissed by user');
          setPaymentStatus('dismissed');
          setErrorMessage('');
        };

        window.payhere.onError = function onError(error) {
          console.error('PayHere SDK error:', error);
          setPaymentStatus('error');
          setErrorMessage('Payment processing error. Please try again.');
        };

        resolve();
      };

      script.onerror = () => {
        console.error('Failed to load PayHere SDK');
        reject(new Error('Failed to load payment system'));
      };

      document.head.appendChild(script);
    });
  }, [router]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setPaymentStatus(null);
      setErrorMessage('');
      await loadPayHereSDK();
      await initializePayment();
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setErrorMessage(error.message || 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* ... (keep your existing UI) ... */}
      
      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        ) : (
          `Pay LKR ${orderDetails.amount}`
        )}
      </button>
    </div>
  );
}