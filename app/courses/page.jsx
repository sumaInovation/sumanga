
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
          <h1 className="text-3xl font-bold text-gray-900">Our Courses</h1>
          <p className="mt-2 text-lg text-gray-600">
            Explore our comprehensive training programs designed for skill development
          </p>
        </div>

        {/* Course Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              // ✅ UPDATED: Calculate total hours from duration in weeks
              const totalHours = (course.duration || 0) * 40; // Assuming 40 hours per week

              // ✅ UPDATED: Calculate total enrolled students across all batches
              const totalEnrolledStudents = course.batches?.reduce((total, batch) => {
                return total + (batch.enrolledStudents?.length || 0);
              }, 0) || 0;

              // ✅ UPDATED: Find active batches
              const activeBatchesCount = course.batches?.filter(
                batch => batch.status === 'upcoming' || batch.status === 'ongoing'
              ).length || 0;

              // ✅ ADDED: Find next batch start date
              const nextBatch = course.batches
                ?.filter(batch => batch.status === 'upcoming')
                ?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

              // ✅ ADDED: Format date for display
              const formatDate = (dateString) => {
                if (!dateString) return null;
                const date = new Date(dateString);
                return date.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short'
                });
              };

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Course Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full ${course.thumbnail ? 'hidden' : 'flex'} bg-gradient-to-r from-blue-500 to-purple-600 items-center justify-center`}
                    >
                      <span className="text-white text-lg font-semibold">
                        {course.title.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    {/* Active Batches Badge */}
                    {activeBatchesCount > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {activeBatchesCount} Active Batch{activeBatchesCount > 1 ? 'es' : ''}
                        </span>
                      </div>
                    )}

                    {/* ✅ ADDED: Next Batch Date Badge */}
                    {nextBatch?.startDate && (
                      <div className="absolute bottom-4 left-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          🗓️ Starts {formatDate(nextBatch.startDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {course.level}
                      </span>
                      <span className="text-sm text-gray-500">
                        {totalHours} hours
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.shortDescription || course.description}
                    </p>

                    {/* ✅ ADDED: Next Batch Info */}
                    {nextBatch && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-blue-800">
                            Next Batch: {nextBatch.batchName}
                          </span>
                          {nextBatch.startDate && (
                            <span className="text-blue-600">
                              {formatDate(nextBatch.startDate)}
                            </span>
                          )}
                        </div>
                        {nextBatch.offer > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            🎁 {nextBatch.offer}% discount available
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {/* ✅ UPDATED: Use basePrice instead of baseFees */}
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{course.basePrice?.toLocaleString() || '0'}
                        </p>
                        {/* ✅ UPDATED: Check for batch offers instead of specialOffers */}
                        {course.batches?.some(batch => batch.offer > 0) && !nextBatch?.offer && (
                          <p className="text-sm text-green-600">Special offers available</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {totalEnrolledStudents} enrolled
                        </p>
                      </div>
                    </div>

                    {/* Course Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="capitalize">
                        {course.category?.replace('-', ' ')}
                      </span>
                      <span>
                        {course.duration || 0} weeks
                      </span>
                    </div>

                    {/* CTA Button */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            CS
                          </span>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          Course Station
                        </span>
                      </div>

                      <Link
                        href={`/courses/${course._id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        View Details
                      </Link>
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

        {/* Stats Section */}
        {courses.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                <p className="text-sm text-gray-600">Total Courses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(course => course.isPublished).length}
                </p>
                <p className="text-sm text-gray-600">Published</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((total, course) => total + (course.batches?.reduce((sum, batch) => sum + (batch.enrolledStudents?.length || 0), 0) || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Enrollments</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((total, course) => total + (course.batches?.filter(batch => batch.status === 'upcoming' || batch.status === 'ongoing').length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Active Batches</p>
              </div>
            </div>

            {/* ✅ ADDED: Upcoming Batches Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Batches</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.flatMap(course => 
                  course.batches
                    ?.filter(batch => batch.status === 'upcoming')
                    ?.map(batch => ({
                      ...batch,
                      courseTitle: course.title,
                      courseId: course._id
                    })) || []
                )
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .slice(0, 6) // Show only next 6 batches
                .map((batch, index) => (
                  <Link
                    key={`${batch.courseId}-${batch._id}-${index}`}
                    href={`/courses/${batch.courseId}`}
                    className="block p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900 text-sm line-clamp-1">
                        {batch.courseTitle}
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {batch.batchName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      🗓️ {batch.startDate ? new Date(batch.startDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 'TBA'}
                    </p>
                    <p className="text-xs text-gray-500">
                      🕐 {batch.conductDays?.join(', ')} at {batch.conductTime}
                    </p>
                    {batch.offer > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        🎁 {batch.offer}% discount
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}