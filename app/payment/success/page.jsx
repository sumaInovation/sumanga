
import Link from 'next/link';
import { Suspense } from 'react';
import { connectDB } from '@/lib/mongodb';
import PaymentOrder from '@/models/PaymentOrder';
import Registration from '@/models/Registration';

async function confirmPayment(orderId) {
  try {
    await connectDB();

    console.log('🎯 Confirming payment for order:', orderId);

    // Find the payment order with proper population
    const paymentOrder = await PaymentOrder.findOne({ orderId })
      .populate('registration')
      .populate('student')
      .populate('course'); // Make sure this population works

    if (!paymentOrder) {
      console.error('❌ Payment order not found:', orderId);
      return { success: false, error: 'Payment order not found' };
    }

    console.log('📋 Found payment order:', paymentOrder._id);

    // If already completed, return early
    if (paymentOrder.status === 'completed') {
      console.log('✅ Payment already completed');
      return { success: true, alreadyCompleted: true };
    }

    // Update payment order
    paymentOrder.status = 'completed';
    paymentOrder.paymentDate = new Date();
    paymentOrder.paymentMethod = 'payhere_sandbox';
    await paymentOrder.save();
    console.log('✅ Payment order updated to completed');

    // Update registration
    const registration = await Registration.findById(paymentOrder.registration._id)
      .populate('course'); // Populate course for duration calculation

    if (registration) {
      console.log('📝 Registration BEFORE update:', {
        totalAmount: registration.totalAmount,
        amountPaid: registration.amountPaid,
        dueAmount: registration.dueAmount,
        paymentStatus: registration.paymentStatus
      });

      const paymentAmount = paymentOrder.amount;
      
      // Create payment history object FIRST (this is where the validation happens)
      const paymentHistoryData = {
        amount: paymentAmount,
        paymentDate: new Date(),
        paymentMethod: 'payhere_sandbox', // Must match your enum exactly
        transactionId: orderId,
        status: 'success', // Must be 'success' not 'completed'
        notes: 'PayHere sandbox payment'
      };

      console.log('💰 Payment history data:', paymentHistoryData);

      // Add to payment history FIRST
      registration.paymentHistory.push(paymentHistoryData);

      // Then update payment amounts
      registration.amountPaid += paymentAmount;
      registration.dueAmount = Math.max(0, registration.totalAmount - registration.amountPaid);
      
      // Update payment status based on amounts
      if (registration.amountPaid >= registration.totalAmount) {
        registration.paymentStatus = 'paid';
        registration.dueAmount = 0;
      } else if (registration.amountPaid > 0) {
        registration.paymentStatus = 'partial';
      }

      // Auto-grant access if paid
      if (registration.paymentStatus === 'paid' && !registration.accessGranted) {
        registration.accessGranted = true;
        registration.accessStartDate = new Date();
        
        // Set access end date - handle case where course might not be populated
        let courseDuration = 12; // default duration in weeks
        if (registration.course && registration.course.duration) {
          courseDuration = registration.course.duration;
        } else if (paymentOrder.course && paymentOrder.course.duration) {
          courseDuration = paymentOrder.course.duration;
        }
        
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + (courseDuration * 7) + 30); // weeks to days + grace period
        registration.accessEndDate = endDate;
        
        console.log('🔓 Course access granted for', courseDuration, 'weeks');
      }

      // Save the registration - this will trigger your pre-save middleware
      await registration.save();
      
      console.log('✅ Registration AFTER update:', {
        amountPaid: registration.amountPaid,
        dueAmount: registration.dueAmount,
        paymentStatus: registration.paymentStatus,
        accessGranted: registration.accessGranted
      });

      return {
        success: true,
        registration: {
          amountPaid: registration.amountPaid,
          dueAmount: registration.dueAmount,
          paymentStatus: registration.paymentStatus,
          accessGranted: registration.accessGranted
        },
        paymentOrder: {
          orderId: paymentOrder.orderId,
          amount: paymentOrder.amount,
          status: paymentOrder.status
        }
      };

    } else {
      console.error('❌ Registration not found');
      return { success: false, error: 'Registration not found' };
    }

  } catch (error) {
    console.error('💥 Payment confirmation error:', error);
    
    // More detailed error logging
    if (error.errors) {
      console.error('🔍 Validation errors:', error.errors);
    }
    if (error.name === 'ValidationError') {
      Object.keys(error.errors).forEach(field => {
        console.error(`🔍 Field ${field}:`, error.errors[field]);
      });
    }
    
    return { success: false, error: error.message };
  }
}

// Get orderId from URL search params
async function getOrderId(searchParams) {
  const params = await searchParams;
  return params.order_id;
}

export default async function PaymentSuccessPage({ searchParams }) {
  const orderId = await getOrderId(searchParams);
  
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Payment</h1>
          <p className="text-gray-600 mb-6">No payment order specified.</p>
          <Link href="/profile/student" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Return to Profile
          </Link>
        </div>
      </div>
    );
  }

  // Confirm the payment when success page loads
  const paymentResult = await confirmPayment(orderId);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        {/* Success Message */}
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          {paymentResult.success ? 'Payment Successful!' : 'Payment Processing'}
        </h1>
        
        {paymentResult.success ? (
          <>
            <p className="text-gray-600 mb-4">
              Thank you for your payment! Your course access has been activated.
            </p>
            {paymentResult.registration && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2">Payment Details:</h3>
                <p className="text-sm">
                  <span className="font-medium">Amount Paid:</span> LKR {paymentResult.registration.amountPaid?.toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Due Amount:</span> LKR {paymentResult.registration.dueAmount?.toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    paymentResult.registration.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {paymentResult.registration.paymentStatus}
                  </span>
                </p>
                {paymentResult.registration.accessGranted && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    ✅ Course access granted
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              There was an issue processing your payment.
            </p>
            {paymentResult.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-600">
                  Error: {paymentResult.error}
                </p>
              </div>
            )}
          </>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/profile/student"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Your Profile
          </Link>
          <Link 
            href="/courses"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Browse More Courses
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Order ID: {orderId}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Need help? <Link href="/contact" className="text-blue-600 hover:text-blue-700">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}