'use client';

import { useState } from 'react';
import PayHerePayment from '../../components/PayHerePayment';

export default function CheckoutPage() {
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Sample order details - in real app, this would come from your state/cart
  const orderDetails = {
    order_id: `ORDER_${Date.now()}`,
    items: "Sample Product",
    amount: "1000.00",
    currency: "LKR",
    first_name: "Saman",
    last_name: "Perera",
    email: "samanp@gmail.com",
    phone: "0771234567",
    address: "No.1, Galle Road",
    city: "Colombo",
    country: "Sri Lanka",
    delivery_address: "No. 46, Galle road, Kalutara South",
    delivery_city: "Kalutara",
    delivery_country: "Sri Lanka",
    custom_1: "additional info 1",
    custom_2: "additional info 2"
  };

  const handlePaymentComplete = (orderId) => {
    setPaymentStatus('completed');
    console.log("Payment completed for order:", orderId);
    // Redirect to success page or show success message
    // router.push('/payment-success');
  };

  const handlePaymentDismissed = () => {
    setPaymentStatus('dismissed');
    console.log("Payment was dismissed by user");
  };

  const handlePaymentError = (error) => {
    setPaymentStatus('error');
    console.error("Payment error:", error);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Summary</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">{orderDetails.items}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono text-sm">{orderDetails.order_id}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>Total:</span>
            <span className="text-blue-600">LKR {orderDetails.amount}</span>
          </div>
        </div>

        {paymentStatus === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-700 font-medium">Payment completed successfully!</p>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 font-medium">Payment failed. Please try again.</p>
          </div>
        )}

        <PayHerePayment
          orderDetails={orderDetails}
          onPaymentComplete={handlePaymentComplete}
          onPaymentDismissed={handlePaymentDismissed}
          onPaymentError={handlePaymentError}
        />

        <p className="text-xs text-gray-500 mt-4 text-center">
          You will be redirected to PayHere secure payment page
        </p>
      </div>
    </div>
  );
}