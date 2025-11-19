// components/admin/course/CourseManagementTab.jsx
"use client";

import { useState, useEffect } from "react";
import CourseForm from "./CourseForm";

export default function CourseManagementTab() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingCourseId, setUpdatingCourseId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/courses");
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (courseId, updates) => {
    setUpdatingCourseId(courseId);
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        setCourses(prevCourses =>
          prevCourses.map(course =>
            course._id === courseId ? { ...course, ...updates } : course
          )
        );
      } else {
        alert(data.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course");
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
  if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
    return;
  }

  try {
    const response = await fetch(`/api/courses/${courseId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete error response:', errorText);
      throw new Error(`Failed to delete course: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
      alert('Course deleted successfully!');
    } else {
      alert(data.error || "Failed to delete course");
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    alert(error.message || "Failed to delete course");
  }
};

  const handleAddNewCourse = () => {
    setShowCreateForm(true);
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    fetchCourses(); // Refresh the course list
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
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

  // Show Course Form when user clicks "Add New Course"
  if (showCreateForm) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
          <button 
            onClick={handleCancelCreate}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            ← Back to Courses
          </button>
        </div>
        <CourseForm 
          onSuccess={handleFormSuccess}
          onCancel={handleCancelCreate}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
        <button 
          onClick={handleAddNewCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create New Course
        </button>
      </div>
      
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
                  Students
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
                        src={course.thumbnail || "/default-course-thumbnail.jpg"}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.enrolledStudents?.length || 0}
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
                    {updatingCourseId === course._id && (
                      <span className="ml-2 text-xs text-gray-500">Updating...</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <a
                        href={`/admin/courses/${course._id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </a>
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