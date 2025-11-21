import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PaymentOrder from '@/models/PaymentOrder';
import Registration from '@/models/Registration';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { registrationId, amount, studentId, courseTitle } = await request.json();

    // Validate input
    if (!registrationId || !amount || !studentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify registration exists and belongs to student
    const registration = await Registration.findById(registrationId)
      .populate('course', 'title code')
      .populate('student', 'name email phoneNumber');

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    if (registration.student._id.toString() !== studentId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create payment order
    const orderId = `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentOrder = new PaymentOrder({
      orderId,
      registration: registrationId,
      student: studentId,
      course: registration.course._id,
      amount: amount,
      currency: 'LKR',
      status: 'pending',
      items: courseTitle || registration.course.title,
      studentDetails: {
        name: registration.student.name,
        email: registration.student.email,
        phone: registration.student.phoneNumber
      }
    });

    await paymentOrder.save();

    return NextResponse.json({
      success: true,
      orderId: paymentOrder.orderId,
      amount: paymentOrder.amount,
      registrationId: registration._id
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}