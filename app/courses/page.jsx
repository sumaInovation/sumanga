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
              // Calculate total hours safely
              const totalHours = course.duration?.totalHours || 
                               (course.duration?.totalDays || 0) * (course.duration?.perDayHours || 0) || 0;

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
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          {course.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{course.baseFees?.toLocaleString()}
                        </p>
                        {course.specialOffers?.some(offer => offer.isActive) && (
                          <p className="text-sm text-green-600">Special offer available</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {course.enrolledStudents?.length || 0} enrolled
                        </p>
                      </div>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {course.instructor?.name?.charAt(0) || 'I'}
                          </span>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {course.instructor?.name || 'Instructor'}
                        </span>
                      </div>

                      <Link
                        href={`/courses/${course._id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
              <p className="text-gray-500">Check back later for new course offerings.</p>
            </div>
          </div>
        )}

        {/* Admin Actions - Only show if user is admin (you can add this back later if needed) */}
        {/* {session?.user?.role === 'admin' && (
          <div className="mt-8 text-center">
            <Link
              href="/admin/courses/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Create New Course
            </Link>
          </div>
        )} */}
      </div>
    </div>
  );
}