// app/api/courses/register/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Course from '@/models/Course';
import Student from '@/models/Student';
import Enrollment from '@/models/Enrollment';

export async function POST(request) {
  try {
    await dbConnect();
    
    const {
      name,
      email,
      phone,
      education,
      experience,
      street,
      city,
      interests,
      paymentMethod,
      courseSlug
    } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !courseSlug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the course
    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if student already exists
    let student = await Student.findOne({ email });
    
    if (!student) {
      // Create new student
      student = await Student.create({
        name,
        email,
        phone,
        education,
        experience,
        address: {
          street,
          city,
          country: 'Sri Lanka'
        },
        interests
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: student._id,
      courseId: course._id
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'You are already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId: student._id,
      courseId: course._id,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Update course enrollment count
    await Course.findByIdAndUpdate(course._id, {
      $inc: { enrollmentCount: 1 }
    });

    return NextResponse.json({
      success: true,
      enrollmentId: enrollment._id,
      message: 'Registration successful. Please complete the payment.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}