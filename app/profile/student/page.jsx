
// app/profile/student/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Registration from "@/models/Registration";
import StudentProfileClient from "./StudentProfileClient";

async function getStudentData() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  try {
    await connectDB();

    // Get student details
    const student = await User.findOne({ 
      role: 'student',
      email: session.user.email 
    }).select('name email phoneNumber whatsappNumber image role createdAt lastLogin');

    if (!student) {
      redirect('/unauthorized');
    }

    // ✅ FIXED: Use 'student' field instead of 'user'
    const registrations = await Registration.find({
      student: student._id  // 👈 Changed from 'user' to 'student'
    })
    .populate('course', 'title code thumbnail basePrice duration')
    .populate('student', 'name email') // 👈 Also populate student if needed
    .sort({ registrationDate: -1 });

    console.log('✅ Found registrations:', registrations.length); // Debug log

    return { 
      user: JSON.parse(JSON.stringify(student)),
      registrations: JSON.parse(JSON.stringify(registrations))
    };
  } catch (error) {
    console.error('Error fetching student data:', error);
    redirect('/error');
  }
}

export default async function StudentProfile() {
  const data = await getStudentData();
  
  return <StudentProfileClient {...data} />;
}