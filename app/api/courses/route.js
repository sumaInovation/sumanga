
// app/api/courses/route.js
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

// GET - Fetch all published courses (PUBLIC - no authentication)
export async function GET() {
  try {
    await connectDB();

    // Only fetch published courses for public access
    const courses = await Course.find({ isPublished: true })
      .sort({ createdAt: -1 });

    // Process courses with simplified structure
    const processedCourses = courses.map(course => {
      // Get active batches
      const activeBatches = (course.batches || []).filter(batch => 
        batch && (batch.status === 'upcoming' || batch.status === 'ongoing')
      );

      // ✅ UPDATED: Get next batch with date sorting
      const nextBatch = activeBatches
        .filter(batch => batch.status === 'upcoming')
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0] || null;

      return {
        _id: course._id.toString(),
        title: course.title,
        code: course.code,
        shortDescription: course.shortDescription,
        level: course.level,
        category: course.category,
        basePrice: course.basePrice || 0,
        duration: course.duration || 0,
        thumbnail: course.thumbnail,
        isPublished: course.isPublished,
        // ✅ UPDATED: Include startDate and endDate in batches
        batches: (course.batches || []).map(batch => ({
          _id: batch._id?.toString(),
          batchName: batch.batchName,
          startDate: batch.startDate,
          endDate: batch.endDate,
          offer: batch.offer,
          location: batch.location,
          conductTime: batch.conductTime,
          conductDays: batch.conductDays || [],
          status: batch.status
        })),
        activeBatchesCount: activeBatches.length,
        // ✅ UPDATED: Next batch info with dates
        nextBatch: nextBatch ? {
          batchName: nextBatch.batchName,
          startDate: nextBatch.startDate,
          endDate: nextBatch.endDate,
          conductDays: nextBatch.conductDays,
          conductTime: nextBatch.conductTime,
          location: nextBatch.location,
          offer: nextBatch.offer
        } : null,
        createdAt: course.createdAt,
        gallery: course.gallery || [],
        videoCollections: course.videoCollections || []
      };
    });

    return Response.json({ 
      success: true, 
      courses: processedCourses
    });
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    return Response.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST - Create a new course (admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'staff', 'instructor'].includes(session.user.role)) {
      return Response.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    console.log('🆕 Creating new course with data:', {
      title: body.title,
      basePrice: body.basePrice,
      duration: body.duration,
      batches: body.batches?.length
    });

    // ✅ UPDATED: Process batches with new structure including startDate and endDate
    const processedBatches = Array.isArray(body.batches) ? body.batches.map(batch => ({
      batchName: batch.batchName || `Batch ${Date.now()}`,
      // ✅ ADDED: Handle startDate and endDate
      startDate: batch.startDate ? new Date(batch.startDate) : new Date(), // Default to current date if not provided
      endDate: batch.endDate ? new Date(batch.endDate) : null, // Will be auto-calculated if not provided
      offer: parseInt(batch.offer) || 0,
      location: batch.location || '',
      conductTime: batch.conductTime || '',
      status: batch.status || 'upcoming',
      conductDays: Array.isArray(batch.conductDays) ? batch.conductDays : [],
      description: batch.description || '',
      features: Array.isArray(batch.features) ? batch.features : []
    })) : [];

    const courseData = {
      ...body,
      basePrice: parseInt(body.basePrice) || 0,
      duration: parseInt(body.duration) || 0,
      batches: processedBatches,
      videoCollections: Array.isArray(body.videoCollections) ? body.videoCollections : [],
      syllabus: Array.isArray(body.syllabus) ? body.syllabus : [],
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      isPublished: Boolean(body.isPublished),
    };

    console.log('📅 Batch dates being created:', processedBatches.map(b => ({
      batchName: b.batchName,
      startDate: b.startDate,
      endDate: b.endDate
    })));

    const course = await Course.create(courseData);

    console.log('✅ Course created successfully:', {
      id: course._id,
      title: course.title,
      basePrice: course.basePrice,
      duration: course.duration,
      batches: course.batches?.length
    });

    // ✅ UPDATED: Include dates in the response
    return Response.json({ 
      success: true,
      course: {
        _id: course._id.toString(),
        title: course.title,
        code: course.code,
        basePrice: course.basePrice,
        duration: course.duration,
        batches: course.batches.map(batch => ({
          ...batch,
          _id: batch._id.toString(),
          startDate: batch.startDate,
          endDate: batch.endDate
        })),
        isPublished: course.isPublished,
        videoCollections: course.videoCollections,
        syllabus: course.syllabus,
        gallery: course.gallery
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating course:', error);
    
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    if (error.name === 'ValidationError') {
      errorMessage = 'Validation failed: ' + Object.values(error.errors).map(e => e.message).join(', ');
      statusCode = 400;
    } else if (error.code === 11000) {
      errorMessage = 'Course code already exists';
      statusCode = 400;
    }
    
    return Response.json({ 
      success: false,
      error: errorMessage 
    }, { status: statusCode });
  }
}