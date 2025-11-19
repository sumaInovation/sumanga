
"use client";

import { useState } from "react";
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

  // Normalize initial data to ensure all arrays are defined and properly structured
  const normalizedInitialData = initialData ? {
    ...initialData,
    equipmentUsed: Array.isArray(initialData.equipmentUsed) ? initialData.equipmentUsed : [{ name: "", description: "", quantity: 1 }],
    softwareUsed: Array.isArray(initialData.softwareUsed) ? initialData.softwareUsed : [{ name: "", version: "", description: "" }],
    prerequisites: Array.isArray(initialData.prerequisites) ? initialData.prerequisites : [""],
    tags: Array.isArray(initialData.tags) ? initialData.tags : [],
    videoCollections: Array.isArray(initialData.videoCollections) 
      ? initialData.videoCollections.map(collection => ({
          _id: collection._id || undefined,
          title: collection.title || "",
          description: collection.description || "",
          videos: Array.isArray(collection.videos) 
            ? collection.videos.map(video => ({
                _id: video._id || undefined,
                title: video.title || "",
                videoUrl: video.videoUrl || "",
                duration: video.duration || 0,
                description: video.description || "",
                thumbnail: video.thumbnail || "",
                accessLevel: video.accessLevel || "enrolled"
              }))
            : []
        }))
      : [],
    gallery: Array.isArray(initialData.gallery) ? initialData.gallery : [],
    syllabus: Array.isArray(initialData.syllabus) ? initialData.syllabus : []
  } : null;

  const [formData, setFormData] = useState(normalizedInitialData || {
    title: "",
    code: "",
    description: "",
    shortDescription: "",
    category: "plc-programming",
    level: "beginner",
    baseFees: 0,
    duration: {
      totalDays: 0,
      totalHours: 0,
      theoryHours: 0,
      practicalHours: 0,
      perDayHours: 3
    },
    syllabus: [],
    equipmentUsed: [{ name: "", description: "", quantity: 1 }],
    softwareUsed: [{ name: "", version: "", description: "" }],
    prerequisites: [""],
    certificateIncluded: true,
    isPublished: false,
    isFeatured: false,
    tags: [],
    language: "English",
    thumbnail: "",
    promoVideo: "",
    gallery: [],
    videoCollections: []
  });

  const isEditMode = mode === "edit";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const updateSyllabus = (syllabus) => {
    setFormData(prev => ({ ...prev, syllabus }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode ? `/api/courses/${initialData._id}` : '/api/courses';
      const method = isEditMode ? 'PUT' : 'POST';

      // Clean and prepare data for submission
      const submitData = {
        ...formData,
        // Clean empty arrays and filter valid items
        equipmentUsed: (formData.equipmentUsed || [])
          .filter(eq => eq.name && eq.name.trim() !== "")
          .map(eq => ({
            name: eq.name.trim(),
            description: eq.description?.trim() || "",
            quantity: eq.quantity || 1
          })),
        
        softwareUsed: (formData.softwareUsed || [])
          .filter(sw => sw.name && sw.name.trim() !== "")
          .map(sw => ({
            name: sw.name.trim(),
            version: sw.version?.trim() || "",
            description: sw.description?.trim() || ""
          })),
        
        prerequisites: (formData.prerequisites || [])
          .filter(req => req && req.trim() !== "")
          .map(req => req.trim()),
        
        tags: (formData.tags || [])
          .filter(tag => {
            if (typeof tag === 'string') return tag.trim() !== "";
            if (tag && typeof tag === 'object') {
              return tag.name?.trim() !== "" || tag.value?.trim() !== "";
            }
            return false;
          })
          .map(tag => {
            if (typeof tag === 'string') return tag.trim();
            if (tag && typeof tag === 'object') {
              return tag.name?.trim() || tag.value?.trim() || '';
            }
            return '';
          }),
        
        videoCollections: (formData.videoCollections || [])
          .filter(collection => collection.title && collection.title.trim() !== "")
          .map(collection => ({
            _id: collection._id, // Keep existing ID for updates
            title: collection.title.trim(),
            description: collection.description?.trim() || "",
            videos: (collection.videos || [])
              .filter(video => video.title && video.title.trim() !== "")
              .map(video => ({
                _id: video._id, // Keep existing ID for updates
                title: video.title.trim(),
                videoUrl: video.videoUrl?.trim() || "",
                duration: parseInt(video.duration) || 0,
                description: video.description?.trim() || "",
                thumbnail: video.thumbnail?.trim() || "",
                accessLevel: video.accessLevel || "enrolled"
              }))
          })),
        
        gallery: (formData.gallery || [])
          .filter(image => image && image.trim() !== "")
          .map(image => image.trim()),
        
        // Ensure duration values are numbers
        duration: {
          totalDays: parseInt(formData.duration.totalDays) || 0,
          totalHours: parseInt(formData.duration.totalHours) || 0,
          theoryHours: parseInt(formData.duration.theoryHours) || 0,
          practicalHours: parseInt(formData.duration.practicalHours) || 0,
          perDayHours: parseInt(formData.duration.perDayHours) || 3
        },
        
        // Ensure baseFees is a number
        baseFees: parseInt(formData.baseFees) || 0
      };

      console.log("Submitting course data:", submitData);

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
        // Refresh the page to ensure clean state
        if (isEditMode) {
          router.refresh();
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
    { id: "equipment", name: "Equipment & Software", icon: "🔧" },
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
              onNestedChange={handleNestedChange}
            />
          )}

          {/* Syllabus Builder Tab */}
          {activeTab === "syllabus" && (
            <CourseSyllabusBuilder 
              syllabus={formData.syllabus}
              onSyllabusChange={updateSyllabus}
            />
          )}

          {/* Equipment & Software Tab */}
          {activeTab === "equipment" && (
            <EquipmentSoftwareTab 
              formData={formData}
              onArrayChange={handleArrayChange}
              onAddArrayItem={addArrayItem}
              onRemoveArrayItem={removeArrayItem}
            />
          )}

          {/* Media & Videos Tab */}
          {activeTab === "media" && (
            <MediaVideosTab 
              formData={formData}
              setFormData={setFormData}
              onInputChange={handleInputChange}
              onArrayChange={handleArrayChange}
              onAddArrayItem={addArrayItem}
              onRemoveArrayItem={removeArrayItem}
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

// Basic Info Tab (unchanged)
function BasicInfoTab({ formData, onInputChange, onNestedChange }) {
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Fees (₹) *
          </label>
          <input
            type="number"
            name="baseFees"
            value={formData.baseFees}
            onChange={onInputChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language *
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="English">English</option>
            <option value="Sinhala">Sinhala</option>
            <option value="Tamil">Tamil</option>
          </select>
        </div>
      </div>

      {/* Duration Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Duration Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Days *
            </label>
            <input
              type="number"
              value={formData.duration.totalDays || 0}
              onChange={(e) => onNestedChange('duration', 'totalDays', parseInt(e.target.value))}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Hours *
            </label>
            <input
              type="number"
              value={formData.duration.totalHours || 0}
              onChange={(e) => onNestedChange('duration', 'totalHours', parseInt(e.target.value))}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theory Hours
            </label>
            <input
              type="number"
              value={formData.duration.theoryHours || 0}
              onChange={(e) => onNestedChange('duration', 'theoryHours', parseInt(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Practical Hours
            </label>
            <input
              type="number"
              value={formData.duration.practicalHours || 0}
              onChange={(e) => onNestedChange('duration', 'practicalHours', parseInt(e.target.value))}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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

// Equipment & Software Tab (unchanged)
function EquipmentSoftwareTab({ formData, onArrayChange, onAddArrayItem, onRemoveArrayItem }) {
  const safeEquipmentUsed = Array.isArray(formData.equipmentUsed) ? formData.equipmentUsed : [];
  const safeSoftwareUsed = Array.isArray(formData.softwareUsed) ? formData.softwareUsed : [];
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Equipment & Software</h2>
      
      {/* Equipment Used */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Used</h3>
        {safeEquipmentUsed.map((equipment, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Name
              </label>
              <input
                type="text"
                value={equipment.name || ""}
                onChange={(e) => onArrayChange('equipmentUsed', index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Siemens S7-1200 PLC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={equipment.description || ""}
                onChange={(e) => onArrayChange('equipmentUsed', index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Basic PLC trainer kit"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={equipment.quantity || 1}
                  onChange={(e) => onArrayChange('equipmentUsed', index, 'quantity', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveArrayItem('equipmentUsed', index)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onAddArrayItem('equipmentUsed', { name: "", description: "", quantity: 1 })}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          + Add Equipment
        </button>
      </div>

      {/* Software Used */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Software Used</h3>
        {safeSoftwareUsed.map((software, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Software Name
              </label>
              <input
                type="text"
                value={software.name || ""}
                onChange={(e) => onArrayChange('softwareUsed', index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., TIA Portal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version
              </label>
              <input
                type="text"
                value={software.version || ""}
                onChange={(e) => onArrayChange('softwareUsed', index, 'version', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., V17"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={software.description || ""}
                  onChange={(e) => onArrayChange('softwareUsed', index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Siemens automation software"
                />
              </div>
              <button
                type="button"
                onClick={() => onRemoveArrayItem('softwareUsed', index)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onAddArrayItem('softwareUsed', { name: "", version: "", description: "" })}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          + Add Software
        </button>
      </div>
    </div>
  );
}

// Media & Videos Tab - FIXED VERSION
function MediaVideosTab({ formData, setFormData, onInputChange, onArrayChange, onAddArrayItem, onRemoveArrayItem }) {
  // Ensure arrays are always defined
  const safeGallery = Array.isArray(formData.gallery) ? formData.gallery : [];
  const safeVideoCollections = Array.isArray(formData.videoCollections) ? formData.videoCollections : [];
  const safeTags = Array.isArray(formData.tags) ? formData.tags : [];

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Promo Video URL
          </label>
          <input
            type="url"
            name="promoVideo"
            value={formData.promoVideo || ""}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/promo-video.mp4"
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
              onChange={(e) => onArrayChange('gallery', index, '', e.target.value)}
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Video Description
                          </label>
                          <input
                            type="text"
                            value={video.description || ""}
                            onChange={(e) => handleUpdateVideoInCollection(collectionIndex, videoIndex, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Brief video description"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Access Level
                          </label>
                          <select
                            value={video.accessLevel || "enrolled"}
                            onChange={(e) => handleUpdateVideoInCollection(collectionIndex, videoIndex, 'accessLevel', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="free">Free</option>
                            <option value="preview">Preview</option>
                            <option value="enrolled">Enrolled Only</option>
                          </select>
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

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Tags</h3>
        {safeTags.map((tag, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={typeof tag === 'string' ? tag : tag.name || tag.value || ''}
              onChange={(e) => onArrayChange('tags', index, '', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., PLC, Automation, Industrial"
            />
            <button
              type="button"
              onClick={() => onRemoveArrayItem('tags', index)}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onAddArrayItem('tags', "")}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          + Add Tag
        </button>
      </div>
    </div>
  );
}

// Course Details Tab (unchanged)
function CourseDetailsTab({ formData, setFormData }) {
  const safePrerequisites = Array.isArray(formData.prerequisites) ? formData.prerequisites : [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Final Course Details</h2>
      
      {/* Prerequisites */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prerequisites</h3>
        {safePrerequisites.map((prereq, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={prereq}
              onChange={(e) => {
                const newPrereqs = [...safePrerequisites];
                newPrereqs[index] = e.target.value;
                setFormData(prev => ({ ...prev, prerequisites: newPrereqs }));
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Basic electrical knowledge"
            />
            <button
              type="button"
              onClick={() => {
                const newPrereqs = safePrerequisites.filter((_, i) => i !== index);
                setFormData(prev => ({ ...prev, prerequisites: newPrereqs }));
              }}
              className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData(prev => ({ 
            ...prev, 
            prerequisites: [...safePrerequisites, ""] 
          }))}
          className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          + Add Prerequisite
        </button>
      </div>

      {/* Course Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Course Settings</h3>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              name="certificateIncluded"
              checked={formData.certificateIncluded || false}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                certificateIncluded: e.target.checked 
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Include certificate upon completion</span>
          </label>

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

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured || false}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                isFeatured: e.target.checked 
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Feature this course</span>
          </label>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Course Summary</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Title:</strong> {formData.title || "Not set"}</p>
            <p><strong>Code:</strong> {formData.code || "Not set"}</p>
            <p><strong>Duration:</strong> {formData.duration.totalDays || 0} days ({formData.duration.totalHours || 0} hours)</p>
            <p><strong>Level:</strong> {formData.level}</p>
            <p><strong>Price:</strong> ₹{formData.baseFees}</p>
            <p><strong>Syllabus Days:</strong> {formData.syllabus?.length || 0}</p>
            <p><strong>Video Collections:</strong> {formData.videoCollections?.length || 0}</p>
            <p><strong>Equipment Items:</strong> {formData.equipmentUsed?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}