
// app/courses/[id]/page.jsx
"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState, useEffect } from "react";

// Function to extract YouTube ID from URL
function getYouTubeId(url) {
  if (!url) return null;

  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

// Function to check if URL is a YouTube URL
function isYouTubeUrl(url) {
  return url?.includes("youtube.com") || url?.includes("youtu.be");
}

// Function to validate image URL and handle base64 images
function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  const invalidProtocols = ['chrome://', 'javascript:', 'file://'];
  
  // Check for base64 images
  if (url.startsWith('data:image')) {
    return true;
  }
  
  // Check for regular URLs
  try {
    if (url.startsWith('/') || url.startsWith('./')) {
      return true; // Relative paths are valid
    }
    
    const urlObj = new URL(url);
    return !invalidProtocols.some(protocol => url.startsWith(protocol)) &&
           (urlObj.protocol === 'http:' || urlObj.protocol === 'https:');
  } catch {
    return false;
  }
}

// Function to get safe image source
function getSafeImageSrc(image) {
  if (!image) return '/images/image-not-found.jpg';
  
  if (isValidImageUrl(image)) {
    return image;
  }
  
  return '/images/image-not-found.jpg';
}

// ✅ UPDATED: Simple Price Display Component for new structure
function PriceDisplay({ course }) {
  const basePrice = course.basePrice || 0;
  const currency = 'INR'; // Default currency

  return (
    <div className="text-center mb-6">
      <p className="text-4xl font-bold text-white">
        {basePrice?.toLocaleString()}LKR
      </p>
      <p className="text-sm text-gray-400 mt-2">Course fees</p>
    </div>
  );
}

// ✅ UPDATED: Next Batch Info Component with dates
function NextBatchInfo({ course }) {
  // Find the first upcoming batch sorted by start date
  const nextBatch = course.batches
    ?.filter(batch => batch.status === 'upcoming')
    ?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  if (!nextBatch) {
    return (
      <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-yellow-300">Next Batch</h3>
            <p className="text-yellow-200 text-sm">
              New batch dates will be announced soon
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-blue-900 bg-opacity-50 border border-blue-600 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-800 bg-opacity-50 p-2 rounded-full">
          <svg
            className="w-6 h-6 text-blue-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-300">Next Batch: {nextBatch.batchName}</h3>
          <p className="text-blue-200 text-sm">
            📅 Starts: {formatDate(nextBatch.startDate)}
          </p>
          
          <p className="text-blue-200 text-sm">
            🕐 {nextBatch.conductDays?.join(', ')} at {nextBatch.conductTime}
          </p>
          <p className="text-blue-300 text-sm">
            📍 Location: {nextBatch.location}
          </p>
          {nextBatch.offer > 0 && (
            <p className="text-green-300 text-sm font-medium">
              🎁 Special Offer: {nextBatch.offer}% off
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Image Modal Component
function ImageModal({ image, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-0"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10 bg-black bg-opacity-70 rounded-full w-12 h-12 flex items-center justify-center transition-all border border-white border-opacity-30"
      >
        ×
      </button>
      
      <div className="absolute top-4 left-4 z-10">
        <a
          href={image}
          download={`course-image-${Date.now()}.jpg`}
          className="bg-white bg-opacity-90 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-100 transition-all shadow-lg flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </a>
      </div>

      <div className="w-full h-full flex items-center justify-center p-4">
        <img 
          src={image}
          alt="Full size" 
          className="max-w-full max-h-full w-auto h-auto object-contain"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            console.error('Modal image failed to load');
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

// Enhanced Gallery Tab
function GalleryTab({ course }) {
  const [selectedImage, setSelectedImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  if (!course.gallery || course.gallery.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-300">
          No images available
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Get started by adding some images to the course gallery.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        Image Gallery
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.gallery.map((image, index) => (
          <div
            key={index}
            className="text-center p-4 bg-gray-800 rounded-lg border border-gray-700 shadow-lg"
          >
            <p className="text-sm font-medium mb-2 text-gray-300">Image {index + 1}</p>
            <img 
              src={image} 
              alt={`Gallery image ${index + 1}`} 
              className="w-64 h-64 object-contain mx-auto border border-gray-600 rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'w-64 h-64 flex items-center justify-center bg-gray-700 rounded-lg';
                fallback.innerHTML = `
                  <div class="text-center text-gray-400">
                    <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-sm">Image not available</p>
                  </div>
                `;
                e.target.parentNode.appendChild(fallback);
              }}
            />
            <button
              onClick={() => handleImageClick(image)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all border border-blue-500"
            >
              View Full Size
            </button>
          </div>
        ))}
      </div>
      
      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

// ✅ UPDATED: Expandable Syllabus Component
function ExpandableSyllabus({ syllabus }) {
  const [expandedDay, setExpandedDay] = useState(null);

  const toggleDay = (dayIndex) => {
    if (expandedDay === dayIndex) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayIndex);
    }
  };

  if (!syllabus || syllabus.length === 0) {
    return (
      <p className="text-gray-400">Syllabus not available yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {syllabus.map((day, index) => (
        <div key={day._id || index} className="border border-gray-700 rounded-lg bg-gray-800 overflow-hidden">
          {/* Day Header - Always Visible */}
          <button
            onClick={() => toggleDay(index)}
            className="w-full text-left p-4 hover:bg-gray-750 transition-colors flex justify-between items-center"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white">
                Day {day.dayNumber}: {day.dayTitle}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Total Duration: {day.totalDuration} minutes
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-3">
                {day.items?.length || 0} items
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  expandedDay === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {/* Day Content - Expandable */}
          {expandedDay === index && (
            <div className="px-4 pb-4 border-t border-gray-700 pt-4">
              <div className="space-y-3">
                {day.items?.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between py-3 px-3 bg-gray-750 rounded-lg border border-gray-600"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-medium text-white">{item.title}</p>
                        <span className="text-xs px-2 py-1 bg-gray-600 text-gray-300 rounded-full capitalize">
                          {item.type}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-300">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-md min-w-16 text-center">
                      {item.duration} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Tab Content Component
function TabContent({ activeTab, course, session }) {
  switch (activeTab) {
    case "syllabus":
      return (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Course Syllabus
          </h2>
          <ExpandableSyllabus syllabus={course.syllabus} />
        </div>
      );

    case "videos":
      return (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Video Collections
          </h2>
          <div className="space-y-6">
            {course.videoCollections?.map((collection, index) => (
              <div
                key={collection._id || index}
                className="border border-gray-700 rounded-lg p-4 bg-gray-800"
              >
                <h3 className="font-semibold text-lg mb-3 text-white">
                  {collection.title}
                </h3>
                {collection.description && (
                  <p className="text-gray-300 mb-4">{collection.description}</p>
                )}

                {collection.videos?.length > 0 ? (
                  <div className="space-y-4">
                    {collection.videos.map((video, videoIndex) => (
                      <div
                        key={video._id || videoIndex}
                        className="border border-gray-700 rounded-lg p-4 bg-gray-900"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-white text-lg">
                              {video.title}
                            </h4>
                            {video.description && (
                              <p className="text-gray-300 mt-2">
                                {video.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                              <span>Duration: {video.duration} minutes</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  video.accessLevel === "free"
                                    ? "bg-green-900 text-green-300"
                                    : video.accessLevel === "preview"
                                    ? "bg-blue-900 text-blue-300"
                                    : "bg-purple-900 text-purple-300"
                                }`}
                              >
                                {video.accessLevel === "free"
                                  ? "Free Access"
                                  : video.accessLevel === "preview"
                                  ? "Preview"
                                  : "Enrolled Students Only"}
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
                                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 flex items-center justify-center gap-2 border border-red-500"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                  </svg>
                                  Watch on YouTube
                                </a>
                              ) : (
                                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 border border-blue-500">
                                  Watch Video
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {session?.user && video.accessLevel !== "enrolled" && (
                          <div className="mt-4">
                            {isYouTubeUrl(video.videoUrl) ? (
                              <div className="aspect-w-16 aspect-h-9">
                                <iframe
                                  src={`https://www.youtube.com/embed/${getYouTubeId(
                                    video.videoUrl
                                  )}`}
                                  title={video.title}
                                  className="w-full h-48 md:h-64 rounded-lg shadow-lg border border-gray-600"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            ) : (
                              <div className="aspect-w-16 aspect-h-9">
                                <video
                                  controls
                                  className="w-full rounded-lg shadow-lg border border-gray-600"
                                  poster={video.thumbnail}
                                >
                                  <source
                                    src={video.videoUrl}
                                    type="video/mp4"
                                  />
                                  <source
                                    src={video.videoUrl}
                                    type="video/webm"
                                  />
                                  <source
                                    src={video.videoUrl}
                                    type="video/ogg"
                                  />
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
                  <p className="text-gray-400 text-sm">
                    No videos in this collection yet.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case "gallery":
      return <GalleryTab course={course} />;

    default:
      return null;
  }
}

// ✅ UPDATED: Batch Enrollment Component with Registration
// ✅ FIXED: Batch Enrollment Component 
function BatchEnrollment({ batch, course, session, onRegistrationSuccess }) {
  const [registering, setRegistering] = useState(false);

  // Debug
  console.log('BatchEnrollment - User logged in:', !!session);

  const batchPrice = batch.offer > 0 
    ? course.basePrice - (course.basePrice * batch.offer / 100)
    : course.basePrice;

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleRegister = async () => {
    console.log('Register button clicked - User:', session?.user?.email);
    
    setRegistering(true);

    try {
      const response = await fetch('/api/registration/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course._id,
          batchId: batch._id
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Registration successful!\nCourse: ${course.title}\nBatch: ${batch.batchName}\nPrice: ₹${data.priceBreakdown.finalPrice}`);
        window.location.href = `/payment/${data.registration._id}`;
        
        if (onRegistrationSuccess) {
          onRegistrationSuccess(data.registration);
        }
      } else {
        alert(`❌ ${data.error || 'Registration failed'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="border border-gray-600 rounded-xl p-4 bg-gray-900">
      <p className="font-medium text-white text-sm">{batch.batchName}</p>
      <p className="text-xs text-gray-400">
        📅 {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
      </p>
      <p className="text-xs text-gray-400">
        🕐 {batch.conductDays?.join(', ')} at {batch.conductTime}
      </p>
      <p className="text-xs text-gray-400">📍 {batch.location}</p>
      
      <div className="mt-2 mb-3">
        {batch.offer > 0 ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Original:</span>
              <span className="text-gray-400 line-through">₹{course.basePrice?.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-400">Discount:</span>
              <span className="text-green-400">{batch.offer}% OFF</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-white">Final Price:</span>
              <span className="text-green-400 text-lg">{batchPrice?.toLocaleString()} LKR</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between font-semibold">
            <span className="text-white">Course Fee:</span>
            <span className="text-white text-lg">{batchPrice?.toLocaleString()} LKR</span>
          </div>
        )}
      </div>

      <button 
        onClick={handleRegister}
        disabled={registering}
        className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all border ${
          registering 
            ? 'bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-blue-500'
        }`}
      >
        {registering ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Registering...
          </div>
        ) : (
          'Enroll Now' // ✅ This should ONLY show when user is logged in
        )}
      </button>

     
    </div>
  );
}


// ✅ UPDATED: Batch Info Component with dates
function BatchInfo({ batch, course }) {
  const batchPrice = batch.offer > 0 
    ? course.basePrice - (course.basePrice * batch.offer / 100)
    : course.basePrice;

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="border border-gray-600 rounded-xl p-4 bg-gray-900">
      <p className="font-medium text-white text-sm">
        {batch.batchName}
      </p>
      <p className="text-xs text-gray-400">
        📅 {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
      </p>
      <p className="text-xs text-gray-400">
        🕐 {batch.conductDays?.join(', ')} at {batch.conductTime}
      </p>
      <p className="text-xs text-gray-400">
        📍 {batch.location}
      </p>
      <p className="text-xs text-yellow-400 font-medium mt-1 capitalize">
        Status: {batch.status}
      </p>
      {batch.offer > 0 && (
        <p className="text-xs text-green-400 font-medium">
          🎁 {batch.offer}% off: {batchPrice?.toLocaleString()}LKR
        </p>
      )}
      <button
        disabled
        className="w-full mt-3 bg-gray-700 text-gray-400 py-3 px-4 rounded-lg text-sm font-medium cursor-not-allowed border border-gray-600"
      >
        {batch.status === 'ongoing' ? 'Batch Started' : 'Batch Completed'}
      </button>
    </div>
  );
}

// Main Course Detail Page Component
export default function CourseDetailPage() {
  const [activeTab, setActiveTab] = useState("syllabus");
  const [course, setCourse] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const { id } = params;
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        // Fetch course data
        const courseRes = await fetch(`/api/courses/${id}`, {
          cache: "no-store",
        });

        if (!courseRes.ok) {
          if (courseRes.status === 404) {
            notFound();
          }
          throw new Error(`Failed to fetch course: ${courseRes.status}`);
        }

        const courseData = await courseRes.json();
        
        console.log('=== COURSE DATA ===');
        console.log('Course:', courseData.course);
        console.log('Base Price:', courseData.course?.basePrice);
        console.log('Duration:', courseData.course?.duration);
        console.log('Batches:', courseData.course?.batches);
        console.log('=== END COURSE DATA ===');
        
        setCourse(courseData.course);

        // Fetch session
        const sessionRes = await fetch(`${baseUrl}/api/auth/session`);
        const sessionData = await sessionRes.json();
        setSession(sessionData);
      } catch (error) {
        console.error("Error in CourseDetailPage:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-lg text-white">Loading...</div>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  // Find upcoming batches only for enrollment
  const upcomingBatches = course.batches?.filter(batch => batch.status === 'upcoming') || [];
  
  // Find all batches for display in sidebar
  const allBatches = course.batches || [];

  // Calculate total hours from duration (in weeks)
  const totalHours = course.duration * 40; // Assuming 40 hours per week

  // Tab configuration
  const tabs = [
    { id: "syllabus", name: "Syllabus", visible: true },
    {
      id: "videos",
      name: "Video Collection",
      visible: course.videoCollections?.length > 0,
    },
    {
      id: "gallery",
      name: "Image Gallery",
      visible: course.gallery?.length > 0,
    },
  ].filter((tab) => tab.visible);

  // Get course thumbnail for background
  const backgroundImage = course.thumbnail;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImage ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${getSafeImageSrc(backgroundImage)})` : 'linear-gradient(rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/95"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Course Image and Basic Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-6">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full border ${
                    course.isPublished
                      ? "bg-green-900/50 text-green-300 border-green-600"
                      : "bg-gray-800 text-gray-300 border-gray-600"
                  }`}
                >
                  {course.isPublished ? "Published" : "Draft"}
                </span>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-900/50 text-blue-300 border border-blue-600">
                  {course.level}
                </span>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-900/50 text-purple-300 border border-purple-600">
                  {course.category}
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-base text-gray-300">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {totalHours} hours ({course.duration} weeks)
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-3 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {course.batches?.reduce((total, batch) => total + (batch.enrolledStudents?.length || 0), 0) || 0} students enrolled
                </div>
              </div>
            </div>

            {/* Pricing and CTA */}
            <div className="lg:w-96">
              <NextBatchInfo course={course} />

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-2xl">
                <PriceDisplay course={course} />

                {/* UPDATED: Only show Enroll Now for upcoming batches */}
                {upcomingBatches.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBatches.map((batch) => (
                      <BatchEnrollment 
                        key={batch._id} 
                        batch={batch} 
                        course={course} 
                      />
                    ))}
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-700 text-gray-400 py-3 px-4 rounded-lg text-sm font-medium cursor-not-allowed border border-gray-600"
                  >
                    No Upcoming Batches
                  </button>
                )}

                {/* Admin Actions */}
                {session?.user?.role === "admin" && (
                  <div className="mt-4 space-y-2">
                    <Link
                      href={`/admin/courses/${course._id}/edit`}
                      className="block w-full text-center bg-yellow-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-yellow-800 border border-yellow-600"
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
            {/* Tab Navigation */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
              <div className="border-b border-gray-700">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-400"
                          : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <TabContent
                  activeTab={activeTab}
                  course={course}
                  session={session}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Details */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
              <h3 className="font-semibold text-lg mb-4 text-white">Course Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Course Code:</span>
                  <span className="font-medium text-white">{course.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-medium text-white capitalize">
                    {course.category?.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span className="font-medium text-white capitalize">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-medium text-white">{course.duration} weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Hours:</span>
                  <span className="font-medium text-white">{totalHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Course Fee:</span>
                  <span className="font-medium text-white"> {course.basePrice?.toLocaleString()} LKR</span>
                </div>
              </div>
            </div>

            {/* Batches Info */}
            {allBatches.length > 0 && (
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
                <h3 className="font-semibold text-lg mb-4 text-white">
                  All Batches
                </h3>
                {allBatches.length > 0 ? (
                  <div className="space-y-3">
                    {allBatches.map((batch) => (
                      batch.status === 'upcoming' ? (
                        <BatchEnrollment 
                          key={batch._id} 
                          batch={batch} 
                          course={course} 
                        />
                      ) : (
                        <BatchInfo 
                          key={batch._id} 
                          batch={batch} 
                          course={course} 
                        />
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    No batches scheduled.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}