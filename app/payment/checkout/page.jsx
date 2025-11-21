
import PayHerePayment from '../../../components/PayHerePayment';
import { connectDB } from '@/lib/mongodb';
import PaymentOrder from '@/models/PaymentOrder';

async function getPaymentOrder(orderId) {
  await connectDB();
  
  const paymentOrder = await PaymentOrder.findOne({ orderId })
    .populate('registration')
    .populate('student')
    .populate('course');

  if (!paymentOrder) {
    return null;
  }

  return JSON.parse(JSON.stringify(paymentOrder));
}

// Fix: searchParams is a Promise in App Router
export default async function CheckoutPage({ searchParams }) {
  // Await the searchParams promise
  const params = await searchParams;
  const orderId = params.order_id;
  
  if (!orderId) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Payment</h1>
          <p className="text-gray-600">No payment order specified.</p>
          <a 
            href="/profile/student" 
            className="inline-block mt-4 text-blue-600 hover:text-blue-500"
          >
            Return to Profile
          </a>
        </div>
      </div>
    );
  }

  const paymentOrder = await getPaymentOrder(orderId);

  if (!paymentOrder) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Not Found</h1>
          <p className="text-gray-600">The payment order could not be found or may have expired.</p>
          <a 
            href="/profile/student" 
            className="inline-block mt-4 text-blue-600 hover:text-blue-500"
          >
            Return to Profile
          </a>
        </div>
      </div>
    );
  }

  const orderDetails = {
    order_id: paymentOrder.orderId,
    items: paymentOrder.items,
    amount: paymentOrder.amount.toFixed(2),
    currency: paymentOrder.currency,
    first_name: paymentOrder.studentDetails.name.split(' ')[0],
    last_name: paymentOrder.studentDetails.name.split(' ').slice(1).join(' ') || 'Student',
    email: paymentOrder.studentDetails.email,
    phone: paymentOrder.studentDetails.phone || '0770000000',
    address: "Student Address",
    city: "Colombo",
    country: "Sri Lanka",
    custom_1: paymentOrder.registration._id,
    custom_2: paymentOrder.student._id
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Complete Your Payment</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Payment Summary</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Course:</span>
            <span className="font-medium">{paymentOrder.items}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono text-sm">{orderDetails.order_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Student:</span>
            <span className="font-medium">{paymentOrder.studentDetails.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{paymentOrder.studentDetails.email}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>Total Amount:</span>
            <span className="text-blue-600">LKR {orderDetails.amount}</span>
          </div>
        </div>

        <PayHerePayment orderDetails={orderDetails} />

        <div className="mt-4 text-center">
          <a 
            href="/profile/student" 
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ← Back to Profile
          </a>
        </div>
      </div>
    </div>
  );
}