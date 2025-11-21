// app/api/user/student-profile/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    await connectDB();

    // Step 1: Filter by role = 'student'
    // Step 2: Compare email with logged-in user's email
    const student = await User.findOne({ 
      role: 'student',
      email: session.user.email 
    }).select('name email phoneNumber whatsappNumber image role createdAt lastLogin');

    if (!student) {
      return new Response(JSON.stringify({ 
        error: 'Student profile not found or you are not registered as a student',
        user: null 
      }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ 
      success: true,
      user: student 
    }), {
      status: 200,
    });
  } catch (error) {
    console.error('Student profile fetch error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      user: null 
    }), {
      status: 500,
    });
  }
}