// app/api/courses/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET(request, { params }) {
  try {
    console.log('🔍 GET /api/courses/[id] called');
    
    // ✅ FIX: Await the params promise
    const { id } = await params;
    
    console.log('📋 Course ID from params:', id);
    console.log('📋 Type of ID:', typeof id);

    // Validate ID
    if (!id || id === 'undefined' || id === 'null' || id === '[id]') {
      console.log('❌ Invalid course ID:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Valid course ID is required',
          receivedId: id 
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if ID is a valid MongoDB ObjectId
    const mongoose = await import('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid MongoDB ObjectId:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid course ID format',
          receivedId: id 
        },
        { status: 400 }
      );
    }

    console.log('📖 Finding course in database with ID:', id);
    const course = await Course.findById(id).lean();

    if (!course) {
      console.log('❌ Course not found with ID:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Course not found',
          receivedId: id 
        },
        { status: 404 }
      );
    }

    console.log('✅ Course found:', course.title);
    
    // Ensure all arrays exist
    const courseData = {
      ...course,
      _id: course._id.toString(),
      videoCollections: course.videoCollections || [],
      syllabus: course.syllabus || [],
      equipmentUsed: course.equipmentUsed || [],
      softwareUsed: course.softwareUsed || [],
      prerequisites: course.prerequisites || [],
      tags: course.tags || [],
      gallery: course.gallery || [],
      batches: course.batches || [],
      enrolledStudents: course.enrolledStudents || [],
      duration: course.duration || {
        totalDays: 0,
        totalHours: 0,
        theoryHours: 0,
        practicalHours: 0,
        perDayHours: 3
      }
    };

    console.log('📹 Video collections count:', courseData.videoCollections.length);
    console.log('📚 Syllabus days:', courseData.syllabus.length);

    return NextResponse.json({ 
      success: true, 
      course: courseData 
    });

  } catch (error) {
    console.error('❌ Error in GET /api/courses/[id]:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch course',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // ✅ FIX: Await the params promise
    const { id } = await params;
    
    await connectDB();
    
    const updates = await request.json();

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      course 
    });

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // ✅ FIX: Await the params promise
    const { id } = await params;
    
    await connectDB();

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Course deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course: ' + error.message },
      { status: 500 }
    );
  }
}