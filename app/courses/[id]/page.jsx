

// app/courses/[id]/page.jsx
'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// Function to extract YouTube ID from URL
function getYouTubeId(url) {
  if (!url) return null;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Function to check if URL is a YouTube URL
function isYouTubeUrl(url) {
  return url?.includes('youtube.com') || url?.includes('youtu.be');
}

// Offer Display Component - FIXED conditional logic
function OfferDisplay({ course }) {
  // Check if special offer exists and is active with discount
  if (!course.specialOffer || 
      course.specialOffer.isActive !== true || 
      course.specialOffer.discountPercentage <= 0) {
    return null;
  }

  const offer = course.specialOffer;
  const originalPrice = course.baseFees;
  const discountedPrice = offer.offerPrice > 0 ? offer.offerPrice : 
                         originalPrice - (originalPrice * offer.discountPercentage / 100);
  const savings = originalPrice - discountedPrice;

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-4 mb-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5 3.5h.01m-2.96 3.51h.01m-2.96 3.51h.01M9 18h6m-6-3h6m2.5-10.5v.5m0 5v.5m0 5v.5m4-11.5v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Special Offer! 🎉</h3>
            <p className="text-sm opacity-90">
              {offer.discountPercentage > 0 ? `Get ${offer.discountPercentage}% off!` : 'Special pricing available!'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end space-x-2 mb-1">
            <span className="text-sm line-through opacity-80">LKR {originalPrice?.toLocaleString()}</span>
            <span className="bg-white text-red-600 px-2 py-1 rounded-full text-sm font-bold">
              {offer.discountPercentage > 0 ? `Save ${offer.discountPercentage}%` : 'Special Offer'}
            </span>
          </div>
          <div className="text-2xl font-bold">LKR {discountedPrice?.toLocaleString()}</div>
          <div className="text-xs opacity-80">You save LKR {savings?.toLocaleString()}</div>
        </div>
      </div>
      
      {offer.validUntil && (
        <div className="mt-3 pt-3 border-t border-white border-opacity-20">
          <div className="flex items-center justify-center space-x-2 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Offer ends {new Date(offer.validUntil).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Next Batch Info Component
function NextBatchInfo({ course }) {
  // Use nextBatchStartDate from course or find from batches
  const nextBatchStartDate = course.nextBatchStartDate || 
    course.batches?.find(batch => 
      batch && (batch.status === 'upcoming' || batch.status === 'ongoing')
    )?.startDate;

  if (!nextBatchStartDate) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-semibold text-yellow-800">Next Batch</h3>
            <p className="text-yellow-700 text-sm">New batch dates will be announced soon</p>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(nextBatchStartDate);
  const today = new Date();
  const daysUntilStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-blue-800">Next Batch Starts</h3>
            <p className="text-blue-700 font-medium">
              {startDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            {daysUntilStart > 0 && (
              <p className="text-blue-600 text-sm">
                {daysUntilStart === 1 ? 'Starts tomorrow!' : `In ${daysUntilStart} days`}
              </p>
            )}
            {daysUntilStart === 0 && (
              <p className="text-blue-600 text-sm">Starts today!</p>
            )}
            {daysUntilStart < 0 && (
              <p className="text-blue-600 text-sm">Batch in progress</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Content Component
function TabContent({ activeTab, course, session }) {
  switch (activeTab) {
    case 'syllabus':
      return (
        <div>
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
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
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
        </div>
      );

    case 'videos':
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Collections</h2>
          <div className="space-y-6">
            {course.videoCollections?.map((collection, index) => (
              <div key={collection._id || index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{collection.title}</h3>
                {collection.description && (
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                )}
                
                {collection.videos?.length > 0 ? (
                  <div className="space-y-4">
                    {collection.videos.map((video, videoIndex) => (
                      <div key={video._id || videoIndex} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-lg">{video.title}</h4>
                            {video.description && (
                              <p className="text-gray-600 mt-2">{video.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <span>Duration: {video.duration} minutes</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                video.accessLevel === 'free' ? 'bg-green-100 text-green-800' :
                                video.accessLevel === 'preview' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {video.accessLevel === 'free' ? 'Free Access' :
                                 video.accessLevel === 'preview' ? 'Preview' : 'Enrolled Students Only'}
                              </span>
                            </div>
                          </div>
                          {session?.user && (
                            <div className="lg:w-48">
                              {isYouTubeUrl(video.videoUrl) ? (
                                <a
                                  href={video.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 flex items-center justify-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                  </svg>
                                  Watch on YouTube
                                </a>
                              ) : (
                                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                                    Watch Video
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {session?.user && video.accessLevel !== 'enrolled' && (
                          <div className="mt-4">
                            {isYouTubeUrl(video.videoUrl) ? (
                              <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                  src={`https://www.youtube.com/embed/${getYouTubeId(video.videoUrl)}`}
                                  title={video.title}
                                  className="w-full h-48 md:h-64 rounded-lg shadow-sm"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            ) : (
                              <div className="aspect-w-16 aspect-h-9">
                                <video 
                                  controls 
                                  className="w-full rounded-lg shadow-sm"
                                  poster={video.thumbnail}
                                >
                                  <source src={video.videoUrl} type="video/mp4" />
                                  <source src={video.videoUrl} type="video/webm" />
                                  <source src={video.videoUrl} type="video/ogg" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No videos in this collection yet.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Image Gallery</h2>
          {course.gallery?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {course.gallery.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Gallery image ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20">
                    <div className="transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <button 
                        onClick={() => {
                          // You can add a modal here to show the image in full size
                          window.open(image, '_blank');
                        }}
                        className="bg-white bg-opacity-90 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-100 transition-all"
                      >
                        View Full Size
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600 text-center">Image {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No images available</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding some images to the course gallery.</p>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

export default function CourseDetailPage() {
  const [activeTab, setActiveTab] = useState('syllabus');
  const [course, setCourse] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { id } = params;
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        
        // Fetch course data
        const courseRes = await fetch(`${baseUrl}/api/courses/${id}`, {
          cache: 'no-store',
        });

        if (!courseRes.ok) {
          if (courseRes.status === 404) {
            notFound();
          }
          throw new Error(`Failed to fetch course: ${courseRes.status}`);
        }

        const courseData = await courseRes.json();
        setCourse(courseData.course);

        // Fetch session (you might need to create an API route for this)
        const sessionRes = await fetch(`${baseUrl}/api/auth/session`);
        const sessionData = await sessionRes.json();
        setSession(sessionData);

      } catch (error) {
        console.error('Error in CourseDetailPage:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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

  // Calculate discounted price if special offer exists - FIXED logic
  const hasActiveOffer = course.specialOffer?.isActive === true && course.specialOffer.discountPercentage > 0;
  const discountedPrice = hasActiveOffer 
    ? (course.specialOffer.offerPrice > 0 
        ? course.specialOffer.offerPrice 
        : course.baseFees - (course.baseFees * course.specialOffer.discountPercentage / 100))
    : null;

  // Tab configuration - Now includes gallery tab
  const tabs = [
    { id: 'syllabus', name: 'Syllabus', visible: true },
    { id: 'videos', name: 'Video Collection', visible: course.videoCollections?.length > 0 },
    { id: 'gallery', name: 'Image Gallery', visible: course.gallery?.length > 0 },
  ].filter(tab => tab.visible);

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
            <div className="lg:w-80">
              {/* Special Offer Display - Only shows when isActive is true */}
              <OfferDisplay course={course} />
              
              {/* Next Batch Info */}
              <NextBatchInfo course={course} />

              <div className="bg-gray-50 rounded-lg p-6 border">
                <div className="text-center mb-4">
                  {hasActiveOffer ? (
                    <>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-2xl line-through text-gray-500">
                          LKR {course.baseFees?.toLocaleString()}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-bold">
                          {course.specialOffer.discountPercentage}% OFF
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        LKR {discountedPrice?.toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-gray-900">
                        LKR {course.baseFees?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Course fees</p>
                    </>
                  )}
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
                        <button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md">
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
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Thumbnail & Promo Video */}
            {(course.thumbnail || course.promoVideo) && (
              <section className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Media</h2>
                <div className="space-y-6">
                  {course.thumbnail && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Course Thumbnail</h3>
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full max-w-md rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                  {course.promoVideo && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Promotional Video</h3>
                      {isYouTubeUrl(course.promoVideo) ? (
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeId(course.promoVideo)}`}
                            title="Promotional Video"
                            className="w-full h-64 md:h-80 lg:h-96 rounded-lg shadow-sm"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="aspect-w-16 aspect-h-9">
                          <video 
                            controls 
                            className="w-full rounded-lg shadow-sm"
                            poster={course.thumbnail}
                          >
                            <source src={course.promoVideo} type="video/mp4" />
                            <source src={course.promoVideo} type="video/webm" />
                            <source src={course.promoVideo} type="video/ogg" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="p-6">
                <TabContent activeTab={activeTab} course={course} session={session} />
              </div>
            </div>

            {/* Requirements & Prerequisites */}
            {(course.equipmentUsed?.length > 0 || course.softwareUsed?.length > 0 || course.prerequisites?.length > 0) && (
              <section className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements & Prerequisites</h2>
                
                {course.equipmentUsed?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">Equipment Used</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.equipmentUsed.map((equipment, index) => (
                        <div key={index} className="border rounded p-3 bg-gray-50">
                          <p className="font-medium">{equipment.name}</p>
                          {equipment.description && (
                            <p className="text-sm text-gray-600 mt-1">{equipment.description}</p>
                          )}
                          {equipment.quantity && (
                            <p className="text-sm text-gray-500 mt-1">Quantity: {equipment.quantity}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {course.softwareUsed?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-3">Software Used</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.softwareUsed.map((software, index) => (
                        <div key={index} className="border rounded p-3 bg-gray-50">
                          <p className="font-medium">{software.name}</p>
                          {software.version && (
                            <p className="text-sm text-gray-600">Version: {software.version}</p>
                          )}
                          {software.description && (
                            <p className="text-sm text-gray-600 mt-1">{software.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {course.prerequisites?.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Prerequisites</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="text-gray-600">{prereq}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Course Tags */}
            {course.tags?.length > 0 && (
              <section className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-lg mb-4">Course Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Course Code:</span>
                  <span className="font-medium">{course.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{course.category?.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate:</span>
                  <span className="font-medium">
                    {course.certificateIncluded ? 'Included' : 'Not Included'}
                  </span>
                </div>
              </div>
            </div>

            {/* Duration Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-lg mb-4">Duration Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Days:</span>
                  <span className="font-medium">{course.duration?.totalDays || 0} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">{totalHours} hours</span>
                </div>
                {course.duration?.theoryHours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Theory Hours:</span>
                    <span className="font-medium">{course.duration.theoryHours} hours</span>
                  </div>
                )}
                {course.duration?.practicalHours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Practical Hours:</span>
                    <span className="font-medium">{course.duration.practicalHours} hours</span>
                  </div>
                )}
                {course.duration?.perDayHours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hours Per Day:</span>
                    <span className="font-medium">{course.duration.perDayHours} hours</span>
                  </div>
                )}
              </div>
            </div>

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
                {course.videoCollections?.length > 0 && (
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Video learning materials
                  </li>
                )}
                {course.gallery?.length > 0 && (
                  <li className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Course gallery images
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
}