// app/api/courses/route.js
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

// GET - Fetch all published courses (PUBLIC - no authentication)
export async function GET() {
  try {
    await connectDB();

    // Only fetch published courses for public access
    const courses = await Course.find({ isPublished: true })
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    return Response.json({ 
      success: true, 
      courses: courses.map(course => ({
        _id: course._id.toString(),
        title: course.title,
        code: course.code,
        shortDescription: course.shortDescription,
        level: course.level,
        category: course.category,
        baseFees: course.baseFees,
        thumbnail: course.thumbnail,
        instructor: course.instructor,
        isPublished: course.isPublished,
        duration: course.duration,
        createdAt: course.createdAt
      }))
    });
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new course (admin only - keep this protected)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['admin', 'staff', 'instructor'].includes(session.user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const course = await Course.create({
      ...body,
      instructor: session.user.id,
      instructorName: session.user.name
    });

    return Response.json({ 
      success: true,
      course: {
        _id: course._id.toString(),
        title: course.title,
        code: course.code,
        instructor: course.instructor,
        isPublished: course.isPublished
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating course:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}