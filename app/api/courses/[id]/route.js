
// app/api/courses/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET(request, { params }) {
  try {
    console.log('🔍 GET /api/courses/[id] called');
    
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
    console.log('💰 Base Price:', course.basePrice);
    console.log('⏰ Duration (weeks):', course.duration);
    console.log('👥 Batches data:', course.batches?.length);

    // ✅ UPDATED: Process batches with new structure including startDate and endDate
    const processedBatches = (course.batches || []).map(batch => ({
      ...batch,
      _id: batch._id?.toString(),
      // Simple location string (no complex object)
      location: batch.location || '',
      // Simple arrays and strings
      conductDays: batch.conductDays || [],
      conductTime: batch.conductTime || '',
      offer: parseInt(batch.offer) || 0,
      status: batch.status || 'upcoming',
      // ✅ ADDED: Include startDate and endDate
      startDate: batch.startDate || null,
      endDate: batch.endDate || null
    }));

    // ✅ UPDATED: Get next batch info with date sorting
    const nextBatch = processedBatches
      .filter(batch => batch.status === 'upcoming')
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;

    const courseData = {
      ...course,
      _id: course._id.toString(),
      
      basePrice: course.basePrice || 0,
      duration: course.duration || 0,
     
      batches: processedBatches,
     
      videoCollections: course.videoCollections || [],
      syllabus: course.syllabus || [],
      gallery: course.gallery || [],
      // ✅ UPDATED: Next batch info with dates
      nextBatch: nextBatch ? {
        batchName: nextBatch.batchName,
        startDate: nextBatch.startDate,
        endDate: nextBatch.endDate,
        conductDays: nextBatch.conductDays,
        conductTime: nextBatch.conductTime,
        location: nextBatch.location,
        offer: nextBatch.offer
      } : null
    };

    console.log('📹 Video collections count:', courseData.videoCollections.length);
    console.log('📚 Syllabus days:', courseData.syllabus.length);
    console.log('👥 Batches count:', courseData.batches.length);
    console.log('💰 Base Price:', courseData.basePrice);
    console.log('⏰ Duration (weeks):', courseData.duration);
    console.log('📅 Next Batch:', courseData.nextBatch);

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
    const { id } = await params;
    
    await connectDB();
    
    const updates = await request.json();

    console.log('🔄 Updating course with ID:', id);
    console.log('📝 Full updates received:', updates);
    console.log('💰 Base Price from request:', updates.basePrice);
    console.log('⏰ Duration from request:', updates.duration);
    console.log('📅 Batches data:', updates.batches?.length, 'batches');
    console.log('📚 Syllabus data:', updates.syllabus?.length, 'days');

    // ✅ UPDATED: Process batches with new structure including startDate and endDate
    const processedBatches = Array.isArray(updates.batches) ? updates.batches.map(batch => ({
      batchName: batch.batchName || '',
      // ✅ ADDED: Handle startDate and endDate
      startDate: batch.startDate ? new Date(batch.startDate) : null,
      endDate: batch.endDate ? new Date(batch.endDate) : null,
      offer: parseInt(batch.offer) || 0,
      location: batch.location || '',
      conductTime: batch.conductTime || '',
      status: batch.status || 'upcoming',
      conductDays: Array.isArray(batch.conductDays) ? batch.conductDays : [],
      description: batch.description || '',
      features: Array.isArray(batch.features) ? batch.features : []
    })) : [];

    const processedUpdates = {
      // ✅ Only update provided fields, don't overwrite with undefined
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.code !== undefined && { code: updates.code }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.shortDescription !== undefined && { shortDescription: updates.shortDescription }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.level !== undefined && { level: updates.level }),
      
      // ✅ Only update if provided
      ...(updates.basePrice !== undefined && { basePrice: parseInt(updates.basePrice) || 0 }),
      ...(updates.duration !== undefined && { duration: parseInt(updates.duration) || 0 }),
      
      // ✅ Only update if provided
      ...(updates.batches !== undefined && { batches: processedBatches }),
      ...(updates.videoCollections !== undefined && { videoCollections: Array.isArray(updates.videoCollections) ? updates.videoCollections : [] }),
      ...(updates.syllabus !== undefined && { syllabus: Array.isArray(updates.syllabus) ? updates.syllabus : [] }),
      ...(updates.gallery !== undefined && { gallery: Array.isArray(updates.gallery) ? updates.gallery : [] }),
      
      ...(updates.thumbnail !== undefined && { thumbnail: updates.thumbnail }),
      ...(updates.isPublished !== undefined && { isPublished: Boolean(updates.isPublished) }),
    };

    console.log('🔄 Processed updates for saving:', processedUpdates);
    console.log('📅 Batches with dates:', processedBatches.map(b => ({
      batchName: b.batchName,
      startDate: b.startDate,
      endDate: b.endDate
    })));

    // ✅ Use findByIdAndUpdate with proper options
    const course = await Course.findByIdAndUpdate(
      id,
      { 
        $set: processedUpdates 
      },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    if (!course) {
      console.log('❌ Course not found with ID:', id);
      return NextResponse.json(
        { 
          success: false,
          error: 'Course not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Course updated successfully');
    console.log('💰 Saved Base Price:', course.basePrice);
    console.log('⏰ Saved Duration:', course.duration);
    console.log('✅ Saved Batches:', course.batches?.length);
    console.log('📅 Batch dates:', course.batches?.map(b => ({
      batchName: b.batchName,
      startDate: b.startDate,
      endDate: b.endDate
    })));

    return NextResponse.json({ 
      success: true, 
      course,
      message: 'Course updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating course:', error);
    
    let errorMessage = 'Failed to update course';
    let statusCode = 500;
    
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation failed: ' + Object.values(error.errors).map(e => e.message).join(', ');
      statusCode = 400;
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid course ID format';
      statusCode = 400;
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await connectDB();

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Course not found' 
        },
        { status: 404 }
      );
    }

    console.log('✅ Course deleted successfully:', course.title);

    return NextResponse.json({ 
      success: true, 
      message: 'Course deleted successfully',
      deletedCourse: {
        id: course._id,
        title: course.title,
        code: course.code
      }
    });

  } catch (error) {
    console.error('❌ Error deleting course:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete course: ' + error.message 
      },
      { status: 500 }
    );
  }
}