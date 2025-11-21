'use client';
import PayHerePayment from '@/components/PayHerePayment';

export default function PaymentPage() {
  // Sample order details
  const orderDetails = {
    order_id: `order_${Date.now()}`, // Unique order ID
    amount: "1000.00",
    currency: "LKR",
    items: "Web Development Course",
    first_name: "Saman",
    last_name: "Perera",
    email: "samanp@gmail.com",
    phone: "0771234567",
    address: "No.1, Galle Road",
    city: "Colombo",
    country: "Sri Lanka"
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Complete Your Payment</h1>
      
      <div className="max-w-md mx-auto">
        <PayHerePayment orderDetails={orderDetails} />
      </div>
    </div>
  );
}