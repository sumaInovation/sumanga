
// app/courses/page.jsx
import Link from 'next/link';

async function getCourses() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data = await res.json();
    return data.courses || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PLC & Robotics Courses</h1>
          <p className="mt-2 text-lg text-gray-600">
            Explore our comprehensive training programs designed for skill development
          </p>
        </div>

        {/* Course Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const totalHours = (course.duration || 0) * 40;
              const totalEnrolledStudents = course.batches?.reduce((total, batch) => {
                return total + (batch.enrolledStudents?.length || 0);
              }, 0) || 0;

              const nextBatch = course.batches
                ?.filter(batch => batch.status === 'upcoming')
                ?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col h-[480px] overflow-hidden"
                >
                  {/* Course Image */}
                  <div className="h-40 bg-gray-200 relative">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {course.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Badges Container */}
                    <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                      
                      {nextBatch?.startDate && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          🗓️ {new Date(nextBatch.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-5 flex flex-col flex-1">
                    {/* Course Title and Basic Info */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {course.level}
                        </span>
                        <span className="text-sm text-gray-500">
                          {totalHours}h
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                    </div>

                    {/* Batch Info - Only show if exists */}
                    {nextBatch && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-blue-800">
                            {nextBatch.batchName}
                          </span>
                          {nextBatch.offer > 0 && (
                            <span className="text-green-600 font-medium">
                              {nextBatch.offer}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stats and Price */}
                    <div className="mt-auto space-y-3">
                      {/* Enrollment and Duration */}
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>👥 {totalEnrolledStudents} enrolled</span>
                        <span>📅 {course.duration || 0} weeks</span>
                      </div>

                      {/* Price Row */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xl font-bold text-gray-900">
                            {course.basePrice?.toLocaleString() || '0'} LKR
                          </p>
                          {course.batches?.some(batch => batch.offer > 0) && !nextBatch?.offer && (
                            <p className="text-xs text-green-600">Special offers available</p>
                          )}
                        </div>
                        
                        {/* CTA Button */}
                        <Link
                          href={`/courses/${course._id}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                        >
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No courses available yet</h3>
              <p className="mt-2 text-gray-500">We're working on bringing you amazing courses. Check back soon!</p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Simplified Stats Section */}
        {courses.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Course Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{courses.length}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">
                  {courses.filter(course => course.isPublished).length}
                </p>
                <p className="text-sm text-gray-600">Published</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-purple-600">
                  {courses.reduce((total, course) => total + (course.batches?.reduce((sum, batch) => sum + (batch.enrolledStudents?.length || 0), 0) || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Enrollments</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-orange-600">
                  {courses.reduce((total, course) => total + (course.batches?.filter(batch => batch.status === 'upcoming' || batch.status === 'ongoing').length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Active Batches</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}