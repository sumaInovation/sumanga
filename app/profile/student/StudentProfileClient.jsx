// app/profile/student/StudentProfileClient.jsx
'use client';

import { useState } from 'react';

export default function StudentProfileClient({ user, registrations }) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-600 mt-2">Manage your profile, courses, and payments</p>
        </div>

        {/* Profile with Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Profile Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-6">
              <img
                src={user?.image || '/default-avatar.png'}
                alt={user?.name}
                className="w-20 h-20 rounded-full border-4 border-blue-200"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    🎓 Student Account
                  </span>
                  <span className="text-sm text-gray-500">
                    Member since {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">👤</span>
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">📚</span>
                Registered Courses ({registrations.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">💰</span>
                Payment Status
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Details Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Full Name
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-lg font-semibold text-gray-900">
                        {user?.name}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email Address
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-lg font-semibold text-gray-900">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone Number
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-lg font-semibold text-gray-900">
                        {user?.phoneNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      WhatsApp Number
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-lg font-semibold text-gray-900">
                        {user?.whatsappNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* Registered Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Registered Courses</h3>
                {registrations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No courses registered yet.</p>
                    <a href="/courses" className="text-blue-600 hover:text-blue-500 mt-2 inline-block">
                      Browse Courses
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((registration) => (
                      <div key={registration._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">
                              {registration.courseTitle}
                            </h4>
                            <p className="text-gray-600">Batch: {registration.batchName}</p>
                            <p className="text-sm text-gray-500">
                              Registered on: {new Date(registration.registrationDate).toLocaleDateString()}
                            </p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                              registration.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : registration.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {registration.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ₹{registration.finalPrice}
                            </p>
                            {registration.offerApplied > 0 && (
                              <p className="text-sm text-red-600">
                                {registration.offerApplied}% OFF
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payment Status Tab */}
            {activeTab === 'payments' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
                {registrations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payment records found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((registration) => (
                      <div key={registration._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{registration.courseTitle}</h4>
                            <p className="text-gray-600">Batch: {registration.batchName}</p>
                            <p className="text-sm text-gray-500">
                              Due Amount: ₹{registration.dueAmount}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              registration.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800'
                                : registration.paymentStatus === 'partial'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {registration.paymentStatus}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">
                              Paid: ₹{registration.amountPaid}
                            </p>
                            {registration.dueAmount > 0 && (
                              <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}