
// app/courses/[id]/components/CourseDetail.jsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CourseDetail({ course }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [registering, setRegistering] = useState(false);

  // Available batches from course data
  const availableBatches = course.batches.filter(batch => 
    batch.status === 'upcoming' || batch.status === 'ongoing'
  );

  const handleRegister = async () => {
    if (!session) {
      // Redirect to login with return URL
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }

    if (!selectedBatch) {
      alert('Please select a batch');
      return;
    }

    setRegistering(true);

    try {
      const response = await fetch('/api/registration/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course._id,
          batchId: selectedBatch._id
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message with price details
        alert(`✅ Registration successful!\n\nCourse: ${course.title}\nBatch: ${selectedBatch.batchName}\nFinal Price: ₹${data.priceBreakdown.finalPrice}\nYou Saved: ₹${data.priceBreakdown.youSave}`);
        
        // Redirect to payment page
        router.push(`/payment/${data.registration._id}`);
      } else {
        alert(`❌ ${data.error || 'Registration failed. Please try again.'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('❌ Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  // Calculate price for a batch
  const calculateBatchPrice = (batch) => {
    const basePrice = course.basePrice;
    const offer = batch.offer || 0;
    const discountAmount = (basePrice * offer) / 100;
    const finalPrice = basePrice - discountAmount;
    
    return {
      basePrice,
      offer,
      discountAmount,
      finalPrice
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Course Header */}
          <div className="relative h-64 bg-gray-200">
            <img
              src={course.thumbnail || '/default-course.jpg'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                <p className="text-xl opacity-90">{course.shortDescription}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Course Details */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                <p className="text-gray-700 mb-6">{course.description}</p>

                {/* Course Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">Category</h3>
                    <p className="text-gray-600 capitalize">{course.category?.replace('-', ' ') || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Level</h3>
                    <p className="text-gray-600 capitalize">{course.level || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Duration</h3>
                    <p className="text-gray-600">{course.duration || 0} weeks</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Course Code</h3>
                    <p className="text-gray-600">{course.code || 'N/A'}</p>
                  </div>
                </div>

                {/* Batches Selection */}
                <h2 className="text-2xl font-bold mb-4">Available Batches</h2>
                
                {availableBatches.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border">
                    <p className="text-gray-600">No batches available at the moment.</p>
                    <p className="text-sm text-gray-500 mt-2">Check back later for new batches.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableBatches.map((batch) => {
                      const price = calculateBatchPrice(batch);
                      
                      return (
                        <div
                          key={batch._id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            selectedBatch?._id === batch._id
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }`}
                          onClick={() => setSelectedBatch(batch)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{batch.batchName}</h3>
                                {batch.status === 'ongoing' && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Ongoing
                                  </span>
                                )}
                                {batch.offer > 0 && (
                                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                    {batch.offer}% OFF
                                  </span>
                                )}
                              </div>
                              
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>📅 Starts: {new Date(batch.startDate).toLocaleDateString()}</p>
                                {batch.endDate && (
                                  <p>🏁 Ends: {new Date(batch.endDate).toLocaleDateString()}</p>
                                )}
                                <p>🕐 {batch.conductTime} • {batch.conductDays?.join(', ')}</p>
                                <p>📍 {batch.location}</p>
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              {batch.offer > 0 ? (
                                <div className="space-y-1">
                                  <p className="text-lg font-bold text-green-600">
                                    ₹{price.finalPrice.toLocaleString()}
                                  </p>
                                  <p className="text-sm text-gray-500 line-through">
                                    ₹{price.basePrice.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-red-600 font-medium">
                                    Save ₹{price.discountAmount.toLocaleString()}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-lg font-bold text-gray-900">
                                  ₹{price.basePrice.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Registration Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-8 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Enroll in Course</h3>
                  
                  {selectedBatch ? (
                    <div className="mb-6">
                      <div className="bg-white rounded-lg border p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Selected Batch</h4>
                        <p className="text-gray-700 font-medium">{selectedBatch.batchName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedBatch.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg border p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Price Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Base Price:</span>
                            <span>₹{course.basePrice?.toLocaleString()}</span>
                          </div>
                          
                          {selectedBatch.offer > 0 && (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Discount ({selectedBatch.offer}%):</span>
                                <span className="text-red-600">
                                  -₹{((course.basePrice * selectedBatch.offer) / 100).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-green-600 font-medium">
                                <span>You Save:</span>
                                <span>₹{((course.basePrice * selectedBatch.offer) / 100).toLocaleString()}</span>
                              </div>
                            </>
                          )}
                          
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between items-center font-bold text-lg">
                              <span className="text-gray-900">Final Price:</span>
                              <span className="text-green-600">
                                ₹{(course.basePrice - (course.basePrice * (selectedBatch.offer || 0) / 100)).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-yellow-800 text-sm">Please select a batch to see pricing</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleRegister}
                    disabled={!selectedBatch || registering}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      !selectedBatch || registering
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {registering ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : session ? (
                      'Register Now'
                    ) : (
                      'Login to Register'
                    )}
                  </button>

                  {!session && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      You need to be logged in to register for this course
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}