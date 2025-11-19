
// app/api/admin/stats/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [
      totalUsers,
      totalCourses,
      activeStudents,
      instructorsCount
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'instructor' })
    ]);

    return Response.json({ 
      success: true,
      totalUsers,
      totalCourses,
      activeStudents,
      instructorsCount,
      totalRevenue: 0 // Placeholder - integrate with payment system later
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}