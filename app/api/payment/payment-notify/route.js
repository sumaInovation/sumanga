
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const registration = await Registration.findById(params.id)
      .populate('course', 'title code duration')
      .populate('student', 'name email');

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({
      registration: {
        _id: registration._id,
        course: registration.course?.title,
        student: registration.student?.name,
        totalAmount: registration.totalAmount,
        amountPaid: registration.amountPaid,
        dueAmount: registration.dueAmount,
        paymentStatus: registration.paymentStatus,
        paymentHistory: registration.paymentHistory,
        accessGranted: registration.accessGranted
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}