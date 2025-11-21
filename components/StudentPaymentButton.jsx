
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentPaymentButton({ registration, student }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Create payment order
      const paymentResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId: registration._id,
          amount: registration.dueAmount,
          studentId: student._id,
          courseTitle: registration.course?.title || 'Course Payment',
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Failed to create payment order');
      }

      // Redirect to checkout page with payment details
      router.push(`/payment/checkout?order_id=${paymentData.orderId}`);
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      setError(error.message || 'Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  if (registration.paymentStatus === 'paid') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        ✅ Paid
      </span>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={isLoading || registration.dueAmount <= 0}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay LKR ${registration.dueAmount}`
        )}
      </button>
    </div>
  );
}