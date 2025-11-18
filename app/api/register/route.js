// app/api/register/route.js
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, phoneNumber, whatsappNumber, role } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Name, email and password are required" }), 
        { status: 400 }
      );
    }

    // For student registration, phone numbers are required
    if (role === "student" && (!phoneNumber || !whatsappNumber || !course)) {
      return new Response(
        JSON.stringify({ error: "Phone number, WhatsApp number, and course are required for student registration" }), 
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return new Response(
        JSON.stringify({ redirect: "/login?message=already_registered" }), 
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "user",
      profileCompleted: true,
    };

    // Add phone numbers only for students
    if (role === "student") {
      userData.phoneNumber = phoneNumber;
      userData.whatsappNumber = whatsappNumber;
      userData.course = course;
    }

    await User.create(userData);

    return new Response(
      JSON.stringify({ redirect: "/login?message=registered_successfully" }), 
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500 }
    );
  }
}