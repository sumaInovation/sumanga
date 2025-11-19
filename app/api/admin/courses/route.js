import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow admin access
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch ALL courses (both published and draft) for admin
    const courses = await Course.find({})
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    console.log(`👨‍💼 Admin fetched ${courses.length} total courses`);

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
        createdAt: course.createdAt,
        // Include additional admin-only fields if needed
        enrolledStudents: course.enrolledStudents?.length || 0
      }))
    });
    
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}