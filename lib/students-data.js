// lib/students-data.js
import Student from '@/models/Student';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import dbConnect from '@/lib/database';

export async function createStudent(studentData) {
  try {
    await dbConnect();
    
    const student = await Student.create(studentData);
    return {
      success: true,
      student: {
        ...student.toObject(),
        _id: student._id.toString()
      }
    };
  } catch (error) {
    console.error('Error creating student:', error);
    return { success: false, error: error.message };
  }
}

export async function getStudentByEmail(email) {
  try {
    await dbConnect();
    
    const student = await Student.findOne({ email }).lean();
    if (!student) return null;
    
    return {
      ...student,
      _id: student._id.toString()
    };
  } catch (error) {
    console.error('Error fetching student:', error);
    return null;
  }
}

export async function getStudentEnrollments(studentId) {
  try {
    await dbConnect();
    
    const enrollments = await Enrollment.find({ studentId })
      .populate('courseId')
      .sort({ enrolledAt: -1 })
      .lean();
    
    return enrollments.map(enrollment => ({
      ...enrollment,
      _id: enrollment._id.toString(),
      courseId: {
        ...enrollment.courseId,
        _id: enrollment.courseId._id.toString()
      },
      enrolledAt: enrollment.enrolledAt.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return [];
  }
}

export async function updateEnrollmentStatus(enrollmentId, status) {
  try {
    await dbConnect();
    
    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { status },
      { new: true }
    ).lean();
    
    return {
      success: true,
      enrollment: {
        ...enrollment,
        _id: enrollment._id.toString()
      }
    };
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return { success: false, error: error.message };
  }
}