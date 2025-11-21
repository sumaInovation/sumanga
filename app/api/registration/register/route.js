// app/api/registration/register/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";
import Registration from "@/models/Registration";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    await connectDB();

    const { courseId, batchId } = await request.json();

    // Get student
    const student = await User.findOne({ email: session.user.email });
    if (!student) {
      return new Response(JSON.stringify({ error: 'Student not found' }), {
        status: 404,
      });
    }

    // Get course and batch
    const course = await Course.findById(courseId);
    if (!course) {
      return new Response(JSON.stringify({ error: 'Course not found' }), {
        status: 404,
      });
    }

    const batch = course.batches.id(batchId);
    if (!batch) {
      return new Response(JSON.stringify({ error: 'Batch not found' }), {
        status: 404,
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      student: student._id,
      course: courseId,
      batch: batchId
    });

    if (existingRegistration) {
      return new Response(JSON.stringify({ 
        error: 'You are already registered for this course batch' 
      }), {
        status: 400,
      });
    }

    // Calculate pricing with discount
    const basePrice = course.basePrice;
    const offerPercentage = batch.offer || 0;
    const discountAmount = (basePrice * offerPercentage) / 100;
    const finalPrice = basePrice - discountAmount;

    // Create registration
    const registration = await Registration.create({
      student: student._id,
      course: courseId,
      batch: batchId,
      basePrice: basePrice,
      finalPrice: finalPrice,
      offerApplied: offerPercentage,
      discountAmount: discountAmount,
      totalAmount: finalPrice,
      dueAmount: finalPrice,
      registrationStatus: 'pending',
      paymentStatus: 'pending'
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Course registration successful',
      registration: registration,
      priceBreakdown: {
        basePrice: basePrice,
        discount: `${offerPercentage}%`,
        discountAmount: discountAmount,
        finalPrice: finalPrice,
        youSave: discountAmount
      }
    }), {
      status: 200,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}