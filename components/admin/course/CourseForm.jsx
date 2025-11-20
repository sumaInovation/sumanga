
"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CourseSyllabusBuilder from "./CourseSyllabusBuilder";

export default function CourseForm({ 
  initialData = null, 
  mode = "create", 
  onSuccess,
  onCancel
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // ✅ UPDATED: Normalize data with startDate and endDate
  const normalizedInitialData = initialData ? {
    ...initialData,
    // ✅ SIMPLIFIED: Direct basePrice and duration
    basePrice: initialData.basePrice || 0,
    duration: initialData.duration || 0,
    // ✅ UPDATED: Batches with startDate and endDate
    batches: Array.isArray(initialData.batches) ? initialData.batches.map(batch => ({
      ...batch,
      _id: batch._id?.toString(),
      batchName: batch.batchName || "",
      startDate: batch.startDate || "",
      endDate: batch.endDate || "",
      offer: batch.offer || 0,
      location: batch.location || "",
      conductTime: batch.conductTime || "",
      conductDays: batch.conductDays || [],
      status: batch.status || "upcoming",
      description: batch.description || "",
      features: batch.features || []
    })) : [],
    // ✅ KEPT: Video collections, syllabus, gallery (unchanged)
    videoCollections: Array.isArray(initialData.videoCollections) ? initialData.videoCollections : [],
    syllabus: Array.isArray(initialData.syllabus) ? initialData.syllabus : [],
    gallery: Array.isArray(initialData.gallery) ? initialData.gallery : [],
  } : null;

  const [formData, setFormData] = useState(normalizedInitialData || {
    // Basic Information
    title: "",
    code: "",
    description: "",
    shortDescription: "",
    category: "plc-programming",
    level: "beginner",
    
    // ✅ SIMPLIFIED: Direct basePrice and duration
    basePrice: 0,
    duration: 0, // in weeks
    
    // ✅ UPDATED: Batches array with dates
    batches: [],
    
    // Media & Content (unchanged)
    syllabus: [],
    videoCollections: [],
    gallery: [],
    
    // Status
    isPublished: false,
  });

  const isEditMode = mode === "edit";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  // ✅ UPDATED: Wrap updateSyllabus with useCallback to prevent infinite re-renders
  const updateSyllabus = useCallback((syllabus) => {
    setFormData(prev => ({ ...prev, syllabus }));
  }, []);

  // ✅ UPDATED: Add new batch with start date
  const addBatch = () => {
    const newBatchNumber = formData.batches.length + 1;
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() + 7); // Default to 1 week from now
    
    setFormData(prev => ({
      ...prev,
      batches: [
        ...prev.batches,
        {
          batchName: `Batch ${newBatchNumber}`,
          startDate: defaultStartDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
          endDate: "", // Will be auto-calculated
          offer: 0,
          location: "",
          conductTime: "8:30 AM - 4:30 PM",
          conductDays: [],
          status: "upcoming",
          description: "",
          features: []
        }
      ]
    }));
  };

  // ✅ UPDATED: Update batch fields including dates
  const updateBatch = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      batches: prev.batches.map((batch, i) => 
        i === index ? { ...batch, [field]: value } : batch
      )
    }));
  };

  // ✅ UPDATED: Update batch conduct days
  const updateBatchDays = (batchIndex, day, checked) => {
    setFormData(prev => ({
      ...prev,
      batches: prev.batches.map((batch, i) => 
        i === batchIndex ? {
          ...batch,
          conductDays: checked
            ? [...(batch.conductDays || []), day]
            : (batch.conductDays || []).filter(d => d !== day)
        } : batch
      )
    }));
  };

  const removeBatch = (index) => {
    setFormData(prev => ({
      ...prev,
      batches: prev.batches.filter((_, i) => i !== index)
    }));
  };

  // Handle gallery URL changes
  const handleGalleryChange = (index, value) => {
    const updatedGallery = [...formData.gallery];
    updatedGallery[index] = value;
    setFormData(prev => ({
      ...prev,
      gallery: updatedGallery
    }));
  };

  const addArrayItem = (arrayName, template) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], template]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  // ✅ UPDATED: Simplified handleSubmit function with date handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode ? `/api/courses/${initialData._id}` : '/api/courses';
      const method = isEditMode ? 'PUT' : 'POST';

      // ✅ UPDATED: Prepare data for submission with dates
      const submitData = {
        // Basic fields
        title: formData.title || "",
        code: formData.code || "",
        description: formData.description || "",
        shortDescription: formData.shortDescription || "",
        category: formData.category || "plc-programming",
        level: formData.level || "beginner",

        // ✅ SIMPLIFIED: Direct basePrice and duration
        basePrice: parseInt(formData.basePrice) || 0,
        duration: parseInt(formData.duration) || 0,

        // ✅ UPDATED: Batches with startDate and endDate
        batches: (formData.batches || []).map(batch => ({
          batchName: batch.batchName || "",
          startDate: batch.startDate || "",
          endDate: batch.endDate || "",
          offer: batch.offer || 0,
          location: batch.location || "",
          conductTime: batch.conductTime || "",
          conductDays: Array.isArray(batch.conductDays) ? batch.conductDays : [],
          status: batch.status || "upcoming",
          description: batch.description || "",
          features: Array.isArray(batch.features) ? batch.features : []
        })),

        // ✅ KEPT: Media arrays
        videoCollections: Array.isArray(formData.videoCollections) ? formData.videoCollections : [],
        syllabus: Array.isArray(formData.syllabus) ? formData.syllabus : [],
        gallery: Array.isArray(formData.gallery) ? formData.gallery : [],

        // Status
        isPublished: Boolean(formData.isPublished),
      };

      // ✅ ADDED: Debug logging to verify data including dates
      console.log("🎯 FINAL SUBMIT DATA:", {
        title: submitData.title,
        basePrice: submitData.basePrice,
        duration: submitData.duration,
        batches: submitData.batches.map(batch => ({
          batchName: batch.batchName,
          startDate: batch.startDate,
          endDate: batch.endDate,
          status: batch.status
        })),
        batchesCount: submitData.batches.length
      });

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (data.success) {
        alert(`Course ${isEditMode ? 'updated' : 'created'} successfully!`);
        if (onSuccess) {
          onSuccess(data.course);
        }
      } else {
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} course`);
      }
    } catch (error) {
      console.error('Error submitting course:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} course: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", name: "Basic Info", icon: "📝" },
    { id: "syllabus", name: "Syllabus", icon: "📚" },
    { id: "batches", name: "Course Batches", icon: "👥" },
    { id: "media", name: "Media & Videos", icon: "🎬" },
    { id: "details", name: "Final Details", icon: "✅" }
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || !['admin', 'staff', 'instructor'].includes(session.user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to {isEditMode ? 'edit' : 'create'} courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Course' : 'Create New Course'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditMode ? 'Update course details and syllabus' : 'Add a comprehensive technical course with detailed syllabus'}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Welcome, {session?.user?.name}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <BasicInfoTab 
              formData={formData} 
              onInputChange={handleInputChange}
              onNumberChange={handleNumberChange}
            />
          )}

          {/* Syllabus Builder Tab */}
          {activeTab === "syllabus" && (
            <CourseSyllabusBuilder 
              syllabus={formData.syllabus}
              onSyllabusChange={updateSyllabus}
            />
          )}

          {/* Course Batches Tab - UPDATED with date fields */}
          {activeTab === "batches" && (
            <CourseBatchesTab 
              formData={formData}
              onAddBatch={addBatch}
              onUpdateBatch={updateBatch}
              onUpdateBatchDays={updateBatchDays}
              onRemoveBatch={removeBatch}
              courseDuration={formData.duration}
            />
          )}

          {/* Media & Videos Tab */}
          {activeTab === "media" && (
            <MediaVideosTab 
              formData={formData}
              setFormData={setFormData}
              onInputChange={handleInputChange}
              onAddArrayItem={addArrayItem}
              onRemoveArrayItem={removeArrayItem}
              onGalleryChange={handleGalleryChange}
            />
          )}

          {/* Course Details Tab */}
          {activeTab === "details" && (
            <CourseDetailsTab 
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {activeTab === "basic" ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Previous
              </button>
            )}

            {activeTab === "details" ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading 
                    ? `${isEditMode ? 'Updating' : 'Creating'} Course...` 
                    : `${isEditMode ? 'Update' : 'Create'} Course`
                  }
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Basic Info Tab - SIMPLIFIED
function BasicInfoTab({ formData, onInputChange, onNumberChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., PLC Programming Fundamentals"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Code *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., PLC-101"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="plc-programming">PLC Programming</option>
            <option value="industrial-automation">Industrial Automation</option>
            <option value="electrical">Electrical</option>
            <option value="pneumatics">Pneumatics</option>
            <option value="robotics">Robotics</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level *
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        {/* ✅ SIMPLIFIED: Base Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Price (₹) *
          </label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice || 0}
            onChange={(e) => onNumberChange('basePrice', e.target.value)}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* ✅ SIMPLIFIED: Duration in weeks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (weeks) *
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration || 0}
            onChange={(e) => onNumberChange('duration', e.target.value)}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description *
        </label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={onInputChange}
          required
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Brief description (max 200 characters)"
          maxLength="200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onInputChange}
          required
          rows="6"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Detailed course description with key highlights"
        />
      </div>
    </div>
  );
}

// UPDATED: Course Batches Tab with date fields
function CourseBatchesTab({ 
  formData, 
  onAddBatch, 
  onUpdateBatch, 
  onUpdateBatchDays,
  onRemoveBatch,
  courseDuration
}) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const batchStatuses = ["upcoming", "ongoing", "completed"];

  // Calculate end date based on start date and course duration
  const calculateEndDate = (startDate) => {
    if (!startDate || !courseDuration) return "";
    
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + (courseDuration * 7)); // Add weeks as days
    
    return end.toISOString().split('T')[0];
  };

  // Handle start date change and auto-calculate end date
  const handleStartDateChange = (index, startDate) => {
    onUpdateBatch(index, 'startDate', startDate);
    
    // Auto-calculate end date
    const endDate = calculateEndDate(startDate);
    if (endDate) {
      onUpdateBatch(index, 'endDate', endDate);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Batches</h2>
        <button
          type="button"
          onClick={onAddBatch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Batch
        </button>
      </div>

      {formData.batches.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Batches Added</h3>
          <p className="text-gray-600">Add your first batch to schedule classes for this course</p>
        </div>
      ) : (
        <div className="space-y-6">
          {formData.batches.map((batch, index) => (
            <div key={index} className="border rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{batch.batchName}</h3>
                <button
                  type="button"
                  onClick={() => onRemoveBatch(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Remove Batch
                </button>
              </div>

              {/* Batch Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    value={batch.batchName}
                    onChange={(e) => onUpdateBatch(index, 'batchName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="e.g., Weekend Batch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={batch.status || "upcoming"}
                    onChange={(e) => onUpdateBatch(index, 'status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {batchStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ ADDED: Start Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={batch.startDate || ""}
                    onChange={(e) => handleStartDateChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Course duration: {courseDuration || 0} weeks
                  </p>
                </div>

                {/* ✅ ADDED: End Date Field (auto-calculated but editable) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={batch.endDate || ""}
                    onChange={(e) => onUpdateBatch(index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min={batch.startDate || new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-calculated from start date
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offer (%)
                  </label>
                  <input
                    type="number"
                    value={batch.offer || 0}
                    onChange={(e) => onUpdateBatch(index, 'offer', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conduct Time
                  </label>
                  <input
                    type="text"
                    value={batch.conductTime}
                    onChange={(e) => onUpdateBatch(index, 'conductTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 8:30 AM - 4:30 PM"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={batch.location}
                    onChange={(e) => onUpdateBatch(index, 'location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Main Campus, Building A"
                  />
                </div>
              </div>

              {/* Conduct Days */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conduct Days
                </label>
                <div className="flex flex-wrap gap-3">
                  {daysOfWeek.map(day => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={batch.conductDays?.includes(day) || false}
                        onChange={(e) => onUpdateBatchDays(index, day, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Batch Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Description
                </label>
                <textarea
                  value={batch.description || ""}
                  onChange={(e) => onUpdateBatch(index, 'description', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional batch description or special notes"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Media & Videos Tab (unchanged)
function MediaVideosTab({ formData, setFormData, onInputChange, onAddArrayItem, onRemoveArrayItem, onGalleryChange }) {
  const safeGallery = Array.isArray(formData.gallery) ? formData.gallery : [];
  const safeVideoCollections = Array.isArray(formData.videoCollections) ? formData.videoCollections : [];

  // Fixed video collection handlers
  const handleAddVideoCollection = () => {
    onAddArrayItem('videoCollections', { 
      title: "", 
      description: "", 
      videos: [] 
    });
  };

  const handleUpdateVideoCollection = (collectionIndex, field, value) => {
    const updatedCollections = [...safeVideoCollections];
    updatedCollections[collectionIndex] = {
      ...updatedCollections[collectionIndex],
      [field]: value
    };
    setFormData(prev => ({ ...prev, videoCollections: updatedCollections }));
  };

  const handleAddVideoToCollection = (collectionIndex) => {
    const updatedCollections = [...safeVideoCollections];
    if (!updatedCollections[collectionIndex].videos) {
      updatedCollections[collectionIndex].videos = [];
    }
    updatedCollections[collectionIndex].videos.push({
      title: "",
      videoUrl: "",
      duration: 0,
      description: "",
      thumbnail: "",
      accessLevel: "enrolled"
    });
    setFormData(prev => ({ ...prev, videoCollections: updatedCollections }));
  };

  const handleRemoveVideoFromCollection = (collectionIndex, videoIndex) => {
    const updatedCollections = [...safeVideoCollections];
    if (updatedCollections[collectionIndex].videos) {
      updatedCollections[collectionIndex].videos.splice(videoIndex, 1);
      setFormData(prev => ({ ...prev, videoCollections: updatedCollections }));
    }
  };

  const handleUpdateVideoInCollection = (collectionIndex, videoIndex, field, value) => {
    const updatedCollections = [...safeVideoCollections];
    if (updatedCollections[collectionIndex].videos && updatedCollections[collectionIndex].videos[videoIndex]) {
      updatedCollections[collectionIndex].videos[videoIndex] = {
        ...updatedCollections[collectionIndex].videos[videoIndex],
        [field]: value
      };
      setFormData(prev => ({ ...prev, videoCollections: updatedCollections }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Media & Video Collections</h2>
      
      {/* Media URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail URL
          </label>
          <input
            type="url"
            name="thumbnail"
            value={formData.thumbnail || ""}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Images</h3>
        {safeGallery.map((image, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="url"
              value={image}
              onChange={(e) => onGalleryChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/gallery-image.jpg"
            />
            <button
              type="button"
              onClick={() => onRemoveArrayItem('gallery', index)}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onAddArrayItem('gallery', "")}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          + Add Gallery Image
        </button>
      </div>

      {/* Video Collections */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Video Collections</h3>
          <button
            type="button"
            onClick={handleAddVideoCollection}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Video Collection
          </button>
        </div>

        {safeVideoCollections.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-4xl mb-4">🎬</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Video Collections</h4>
            <p className="text-gray-600">Add your first video collection to organize course videos</p>
          </div>
        ) : (
          safeVideoCollections.map((collection, collectionIndex) => (
            <div key={collectionIndex} className="border rounded-lg p-4 mb-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">
                  {collection.title ? `Collection: ${collection.title}` : `Video Collection ${collectionIndex + 1}`}
                </h4>
                <button
                  type="button"
                  onClick={() => onRemoveArrayItem('videoCollections', collectionIndex)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Remove Collection
                </button>
              </div>
              
              {/* Collection Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Title *
                  </label>
                  <input
                    type="text"
                    value={collection.title || ""}
                    onChange={(e) => handleUpdateVideoCollection(collectionIndex, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., PLC Programming Basics"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Description
                  </label>
                  <input
                    type="text"
                    value={collection.description || ""}
                    onChange={(e) => handleUpdateVideoCollection(collectionIndex, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Fundamental concepts of PLC programming"
                  />
                </div>
              </div>

              {/* Videos in Collection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium text-gray-700">
                    Videos in this Collection ({collection.videos?.length || 0})
                  </h5>
                  <button
                    type="button"
                    onClick={() => handleAddVideoToCollection(collectionIndex)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    + Add Video
                  </button>
                </div>
                
                {collection.videos && collection.videos.length > 0 ? (
                  collection.videos.map((video, videoIndex) => (
                    <div key={videoIndex} className="border rounded p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Video Title *
                          </label>
                          <input
                            type="text"
                            value={video.title || ""}
                            onChange={(e) => handleUpdateVideoInCollection(collectionIndex, videoIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Video title"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Video URL *
                          </label>
                          <input
                            type="url"
                            value={video.videoUrl || ""}
                            onChange={(e) => handleUpdateVideoInCollection(collectionIndex, videoIndex, 'videoUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/video.mp4"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            value={video.duration || ""}
                            onChange={(e) => handleUpdateVideoInCollection(collectionIndex, videoIndex, 'duration', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="45"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thumbnail URL
                          </label>
                          <input
                            type="url"
                            value={video.thumbnail || ""}
                            onChange={(e) => handleUpdateVideoInCollection(collectionIndex, videoIndex, 'thumbnail', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/thumbnail.jpg"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveVideoFromCollection(collectionIndex, videoIndex)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                          Remove Video
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No videos added to this collection yet</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Course Details Tab (unchanged)
function CourseDetailsTab({ formData, setFormData }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Final Course Details</h2>
      
      {/* Course Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Course Settings</h3>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished || false}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                isPublished: e.target.checked 
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Publish course immediately</span>
          </label>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Course Summary</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Title:</strong> {formData.title || "Not set"}</p>
            <p><strong>Code:</strong> {formData.code || "Not set"}</p>
            <p><strong>Duration:</strong> {formData.duration || 0} weeks</p>
            <p><strong>Level:</strong> {formData.level}</p>
            <p><strong>Base Price:</strong> ₹{formData.basePrice || 0}</p>
            <p><strong>Syllabus Days:</strong> {formData.syllabus?.length || 0}</p>
            <p><strong>Video Collections:</strong> {formData.videoCollections?.length || 0}</p>
            <p><strong>Batches:</strong> {formData.batches?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}