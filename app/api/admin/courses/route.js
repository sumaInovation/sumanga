
// app/api/admin/courses/route.js
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'staff'].includes(session.user.role)) {
      return Response.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    await connectDB();

    // ✅ FIXED: Remove instructor population - instructor field doesn't exist
    const courses = await Course.find().sort({ createdAt: -1 });

    console.log('👨‍💼 Admin fetched', courses.length, 'total courses');

    // Process courses for admin response
    const processedCourses = courses.map(course => ({
      _id: course._id.toString(),
      title: course.title,
      code: course.code,
      description: course.description,
      shortDescription: course.shortDescription,
      category: course.category,
      level: course.level,
      basePrice: course.basePrice,
      duration: course.duration,
      // ✅ UPDATED: Batches now include startDate and endDate
      batches: course.batches ? course.batches.map(batch => ({
        _id: batch._id?.toString(),
        batchName: batch.batchName,
        startDate: batch.startDate,
        endDate: batch.endDate,
        offer: batch.offer,
        conductDays: batch.conductDays,
        conductTime: batch.conductTime,
        location: batch.location,
        status: batch.status,
        description: batch.description,
        features: batch.features
      })) : [],
      syllabus: course.syllabus || [],
      videoCollections: course.videoCollections || [],
      gallery: course.gallery || [],
      thumbnail: course.thumbnail,
      isPublished: course.isPublished,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));

    return Response.json({ 
      success: true, 
      courses: processedCourses
    });
    
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    return Response.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}