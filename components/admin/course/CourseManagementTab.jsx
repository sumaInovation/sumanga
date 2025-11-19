
// components/admin/course/CourseManagementTab.jsx
"use client";

import { useState, useEffect } from "react";
import CourseForm from "./CourseForm";

export default function CourseManagementTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingCourseId, setUpdatingCourseId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loadingCourseDetails, setLoadingCourseDetails] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Fetching courses list...");
      const response = await fetch("/api/admin/courses");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
        console.log(`✅ Loaded ${data.courses.length} courses`);
      } else {
        throw new Error(data.error || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    setLoadingCourseDetails(true);
    setError(null);
    try {
      console.log(`🔄 Fetching course details for: ${courseId}`);
      const response = await fetch(`/api/courses/${courseId}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log("✅ Full course details loaded");
        console.log("📹 Video collections:", data.course.videoCollections);
        return data.course;
      } else {
        throw new Error(data.error || "Failed to fetch course details");
      }
    } catch (error) {
      console.error("❌ Error fetching course details:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoadingCourseDetails(false);
    }
  };

  const handleUpdateCourse = async (courseId, updates) => {
    setUpdatingCourseId(courseId);
    setError(null);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update course: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCourses(prevCourses =>
          prevCourses.map(course =>
            course._id === courseId ? { ...course, ...updates } : course
          )
        );
      } else {
        throw new Error(data.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      setError(error.message);
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    setError(null);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete course: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
        alert('Course deleted successfully!');
      } else {
        throw new Error(data.error || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      setError(error.message);
    }
  };

  const handleAddNewCourse = () => {
    setShowCreateForm(true);
    setEditingCourse(null);
    setError(null);
  };

  const handleEditCourse = async (course) => {
  setError(null);
  try {
    console.log("🎯 Starting to edit course:", course);
    console.log("📋 Course ID:", course._id);
    console.log("📋 Course title:", course.title);
    
    if (!course._id) {
      throw new Error("Course ID is missing");
    }

    console.log("🔄 Fetching course details for ID:", course._id);
    
    const fullCourseData = await fetchCourseDetails(course._id);
    
    if (fullCourseData) {
      console.log("✅ Full course data received:", fullCourseData);
      console.log("📹 Video collections in received data:", fullCourseData.videoCollections);
      setEditingCourse(fullCourseData);
      setShowCreateForm(false);
    } else {
      throw new Error("No course data received from server");
    }
  } catch (error) {
    console.error("❌ Error loading course details:", error);
    setError("Failed to load course details: " + error.message);
  }
};

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setEditingCourse(null);
    setError(null);
    fetchCourses();
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setEditingCourse(null);
    setError(null);
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-green-100 text-green-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get thumbnail URL with fallback
  const getThumbnailUrl = (course) => {
    if (course.thumbnail) return course.thumbnail;
    
    // Use placeholder service
    const initials = course.title ? course.title.substring(0, 2).toUpperCase() : 'CO';
    return `https://via.placeholder.com/150/3B82F6/FFFFFF?text=${encodeURIComponent(initials)}`;
  };

  // Show loading when fetching course details
  if (loadingCourseDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Show Course Form when creating or editing
  if (showCreateForm || editingCourse) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingCourse ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button 
            onClick={handleCancelForm}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <span>←</span>
            Back to Courses
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
        
        <CourseForm 
          initialData={editingCourse}
          mode={editingCourse ? "edit" : "create"}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelForm}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading courses...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
        <button 
          onClick={handleAddNewCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span>
          Create New Course
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            Dismiss
          </button>
        </div>
      )}
      
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first technical course</p>
          <button 
            onClick={handleAddNewCourse}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={getThumbnailUrl(course)}
                        alt={course.title}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{course.shortDescription}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getLevelBadge(course.level)}`}>
                      {course.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ₹{course.baseFees}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={course.isPublished ? 'published' : 'draft'}
                      onChange={(e) => handleUpdateCourse(course._id, { 
                        isPublished: e.target.value === 'published' 
                      })}
                      disabled={updatingCourseId === course._id}
                      className={`text-xs border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      } ${updatingCourseId === course._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={updatingCourseId === course._id || loadingCourseDetails}
                      >
                        {loadingCourseDetails ? "Loading..." : "Edit"}
                      </button>
                      <a
                        href={`/courses/${course._id}`}
                        className="text-green-600 hover:text-green-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={updatingCourseId === course._id}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}