
// app/courses/[id]/page.jsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

async function getCourse(id) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/courses/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch course: ${res.status}`);
    }

    const data = await res.json();
    return data.course;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export default async function CourseDetailPage({ params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const course = await getCourse(id);

    if (!course) {
      notFound();
    }

    // Calculate total enrolled students across all batches (safe handling)
    const totalEnrolledStudents = course.batches?.reduce((total, batch) => {
      return total + (batch.enrolledStudents?.length || 0);
    }, 0) || 0;

    // Find active batches (safe handling for empty array)
    const activeBatches = course.batches?.filter(batch => 
      batch && (batch.status === 'upcoming' || batch.status === 'ongoing')
    ) || [];

    // Calculate total hours from duration or syllabus
    const totalHours = course.duration?.totalHours || 
                     course.duration?.totalDays * (course.duration?.perDayHours || 0) || 0;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Course Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Course Image and Basic Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    course.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    {course.level}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                    {course.category}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                
                <p className="text-lg text-gray-600 mb-6">{course.description}</p>

                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {totalHours} hours
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {totalEnrolledStudents} students enrolled
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {course.instructor?.name || 'Instructor'}
                  </div>
                </div>
              </div>

              {/* Pricing and CTA */}
              <div className="lg:w-80 bg-gray-50 rounded-lg p-6 border">
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-gray-900">
                    {course.baseFees?.toLocaleString()} LKR
                  </p>
                  <p className="text-sm text-gray-500">Course fees</p>
                </div>

                {activeBatches.length > 0 ? (
                  <div className="space-y-3">
                    {activeBatches.map((batch) => (
                      <div key={batch._id} className="border rounded-lg p-3 bg-white">
                        <p className="font-medium text-sm">Batch {batch.batchNumber}</p>
                        <p className="text-xs text-gray-500">
                          Starts: {new Date(batch.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {batch.enrolledStudents?.length || 0}/{batch.maxStudents} enrolled
                        </p>
                        <button className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700">
                          Enroll Now
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-gray-400 text-white py-3 px-4 rounded-md text-sm font-medium cursor-not-allowed"
                  >
                    No Active Batches
                  </button>
                )}

                {/* Admin Actions */}
                {session?.user?.role === 'admin' && (
                  <div className="mt-4 space-y-2">
                    <Link
                      href={`/admin/courses/${course._id}/edit`}
                      className="block w-full text-center bg-yellow-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-yellow-700"
                    >
                      Edit Course
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Syllabus Section */}
              <section className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Syllabus</h2>
                {course.syllabus?.length > 0 ? (
                  <div className="space-y-4">
                    {course.syllabus.map((day, index) => (
                      <div key={day._id || index} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          Day {day.dayNumber}: {day.dayTitle}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          Total Duration: {day.totalDuration} minutes
                        </p>
                        <div className="space-y-2">
                          {day.items?.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center justify-between py-2 border-b last:border-b-0">
                              <div>
                                <p className="font-medium">{item.title}</p>
                                <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                              </div>
                              <span className="text-sm text-gray-500">{item.duration} min</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Syllabus not available yet.</p>
                )}
              </section>

              {/* Equipment & Requirements - Only show if data exists */}
              {(course.equipmentUsed?.length > 0 || course.prerequisites?.length > 0) && (
                <section className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Equipment & Requirements</h2>
                  {course.equipmentUsed?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Equipment Used:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {course.equipmentUsed.map((equipment, index) => (
                          <li key={index} className="text-gray-600">
                            {equipment.name} {equipment.quantity && `(${equipment.quantity})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {course.prerequisites?.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Prerequisites:</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {course.prerequisites.map((prereq, index) => (
                          <li key={index} className="text-gray-600">{prereq}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Features */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-lg mb-4">Course Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Hands-on practical sessions
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Industry expert instructors
                  </li>
                  {course.certificateIncluded && (
                    <li className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Certificate of completion
                    </li>
                  )}
                </ul>
              </div>

              {/* Batches Info - Only show if batches exist */}
              {course.batches?.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-lg mb-4">Available Batches</h3>
                  {activeBatches.length > 0 ? (
                    <div className="space-y-3">
                      {activeBatches.map((batch) => (
                        <div key={batch._id} className="border rounded p-3">
                          <p className="font-medium">Batch {batch.batchNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(batch.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">{batch.schedule?.time}</p>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${((batch.enrolledStudents?.length || 0) / batch.maxStudents) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {batch.enrolledStudents?.length || 0} of {batch.maxStudents} seats filled
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No upcoming batches scheduled.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in CourseDetailPage:', error);
    notFound();
  }
}