
// app/api/courses/[id]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

// GET - Fetch single course (PUBLIC - no authentication required)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const course = await Course.findById(id)
      .populate('instructor', 'name email')
      .populate('batches.enrolledStudents', 'name email');

    if (!course) {
      return Response.json({ error: 'Course not found' }, { status: 404 });
    }

    // Only return published courses to public users
    if (!course.isPublished) {
      return Response.json({ error: 'Course not found' }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      course 
    });
    
  } catch (error) {
    console.error('Error fetching course:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update course (admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    await connectDB();

    const course = await Course.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!course) {
      return Response.json({ error: 'Course not found' }, { status: 404 });
    }

    return Response.json({ 
      success: true,
      message: 'Course updated successfully',
      course: {
        _id: course._id.toString(),
        title: course.title,
        isPublished: course.isPublished
      }
    });

  } catch (error) {
    console.error('Error updating course:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete course (admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return Response.json({ error: 'Course not found' }, { status: 404 });
    }

    return Response.json({ 
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}