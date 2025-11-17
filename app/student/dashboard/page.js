// app/student/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this data from your API
    // For now, we'll use mock data
    const mockStudent = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+94 77 123 4567',
      enrolledCourses: 2,
      completedCourses: 0
    };

    const mockEnrollments = [
      {
        _id: '1',
        courseId: {
          title: 'Basic PLC Programming',
          slug: 'basic-plc-programming',
          category: 'PLC Programming',
          level: 'Basic',
          progress: 30
        },
        status: 'approved',
        enrolledAt: '2024-01-15'
      },
      {
        _id: '2',
        courseId: {
          title: 'Advanced Robotics Programming',
          slug: 'advanced-robotics-programming',
          category: 'Robotics Programming',
          level: 'Advanced',
          progress: 0
        },
        status: 'pending',
        enrolledAt: '2024-01-20'
      }
    ];

    setStudent(mockStudent);
    setEnrollments(mockEnrollments);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {student?.name}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey with Suma Automation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{student?.enrolledCourses}</p>
                <p className="text-gray-600">Enrolled Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{student?.completedCourses}</p>
                <p className="text-gray-600">Completed Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-gray-600">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <Link 
              href="/courses"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>

          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {enrollment.courseId.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full ${
                        enrollment.courseId.level === 'Basic' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {enrollment.courseId.level}
                      </span>
                      <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        enrollment.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {enrollment.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {enrollment.status === 'approved' && (
                      <>
                        <div className="text-sm text-gray-600 mb-1">
                          Progress: {enrollment.courseId.progress}%
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${enrollment.courseId.progress}%` }}
                          ></div>
                        </div>
                        <Link 
                          href={`/courses/${enrollment.courseId.slug}`}
                          className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Continue Learning →
                        </Link>
                      </>
                    )}
                    {enrollment.status === 'pending' && (
                      <span className="text-sm text-gray-600">
                        Awaiting approval
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {enrollments.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No courses enrolled yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start your learning journey by enrolling in a course
                </p>
                <Link 
                  href="/courses"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}