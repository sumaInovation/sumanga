'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // You might want to fetch order details from your API
    const orderId = searchParams.get('order_id');
    if (orderId) {
      // Fetch order details from your backend
      // fetchOrderDetails(orderId).then(setOrderDetails);
    }
  }, [searchParams]);

  return (
    <div className="container mx-auto p-6 max-w-2xl text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-green-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your order has been processed successfully.
        </p>
        
        {orderDetails && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold mb-2">Order Details:</h3>
            <p>Order ID: {orderDetails.order_id}</p>
            <p>Amount: LKR {orderDetails.amount}</p>
          </div>
        )}
        
        <div className="space-y-3">
          <Link 
            href="/orders"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Your Orders
          </Link>
          <br />
          <Link 
            href="/"
            className="inline-block text-blue-600 hover:text-blue-700 underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}