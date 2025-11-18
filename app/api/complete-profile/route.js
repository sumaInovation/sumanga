// app/api/complete-profile/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { status: 401 }
      );
    }

    await connectDB();
    const { phoneNumber, whatsappNumber, course } = await req.json();

    if (!phoneNumber || !whatsappNumber || !course) {
      return new Response(
        JSON.stringify({ error: "Phone number, WhatsApp number, and course are required" }), 
        { status: 400 }
      );
    }

    // Update user with phone numbers and set as student
    await User.findByIdAndUpdate(session.user.id, {
      phoneNumber,
      whatsappNumber,
      course,
      profileCompleted: true,
      role: "student",
    });

    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Complete profile error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update profile" }), 
      { status: 500 }
    );
  }
}