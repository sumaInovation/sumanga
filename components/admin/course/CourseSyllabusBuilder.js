
// components/admin/course/CourseSyllabusBuilder.jsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function CourseSyllabusBuilder({ syllabus = [], onSyllabusChange }) {
  const [days, setDays] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize days only once when component mounts or syllabus changes
  useEffect(() => {
    if (!isInitialized && syllabus) {
      if (syllabus.length > 0) {
        setDays(syllabus);
      } else {
        setDays([{
          dayNumber: 1,
          dayTitle: 'Day 1',
          totalDuration: 0,
          items: []
        }]);
      }
      setIsInitialized(true);
    }
  }, [syllabus, isInitialized]);

  // Notify parent when days change, but only after initialization
  useEffect(() => {
    if (isInitialized) {
      onSyllabusChange(days);
    }
  }, [days, onSyllabusChange, isInitialized]);

  const addDay = () => {
    const newDayNumber = days.length > 0 ? Math.max(...days.map(d => d.dayNumber)) + 1 : 1;
    const newDay = {
      dayNumber: newDayNumber,
      dayTitle: `Day ${newDayNumber}`,
      totalDuration: 0,
      items: []
    };
    setDays(prev => [...prev, newDay]);
  };

  const removeDay = (index) => {
    if (days.length <= 1) return;
    setDays(prev => prev.filter((_, i) => i !== index));
  };

  const updateDay = (index, field, value) => {
    setDays(prev => prev.map((day, i) => 
      i === index ? { ...day, [field]: value } : day
    ));
  };

  const addItem = (dayIndex) => {
    setDays(prev => prev.map((day, i) => 
      i === dayIndex ? {
        ...day,
        items: [...day.items, {
          title: '',
          duration: 0,
          type: 'theory',
          description: ''
        }]
      } : day
    ));
  };

  const removeItem = (dayIndex, itemIndex) => {
    setDays(prev => prev.map((day, i) => 
      i === dayIndex ? {
        ...day,
        items: day.items.filter((_, j) => j !== itemIndex)
      } : day
    ));
  };

  const updateItem = (dayIndex, itemIndex, field, value) => {
    setDays(prev => prev.map((day, i) => 
      i === dayIndex ? {
        ...day,
        items: day.items.map((item, j) => 
          j === itemIndex ? { ...item, [field]: value } : item
        )
      } : day
    ));
  };

  // Calculate total duration for a day
  const calculateDayDuration = useCallback((items) => {
    return items.reduce((total, item) => total + (parseInt(item.duration) || 0), 0);
  }, []);

  // Update total duration when items change - with proper dependencies
  useEffect(() => {
    if (isInitialized) {
      setDays(prev => prev.map(day => ({
        ...day,
        totalDuration: calculateDayDuration(day.items)
      })));
    }
  }, [calculateDayDuration, isInitialized]);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Course Syllabus Builder</h2>
        <button
          type="button"
          onClick={addDay}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Day
        </button>
      </div>

      {days.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-4xl mb-4">📚</div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Syllabus Days</h4>
          <p className="text-gray-600">Add your first day to start building the course syllabus</p>
        </div>
      ) : (
        <div className="space-y-6">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="border rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day Number *
                    </label>
                    <input
                      type="number"
                      value={day.dayNumber}
                      onChange={(e) => updateDay(dayIndex, 'dayNumber', parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day Title *
                    </label>
                    <input
                      type="text"
                      value={day.dayTitle}
                      onChange={(e) => updateDay(dayIndex, 'dayTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Introduction to PLC Programming"
                      required
                    />
                  </div>
                </div>
                {days.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDay(dayIndex)}
                    className="ml-4 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove Day
                  </button>
                )}
              </div>

              <div className="mb-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Total Duration:</strong> {day.totalDuration} minutes
                </p>
              </div>

              {/* Syllabus Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-900">Syllabus Items</h4>
                  <button
                    type="button"
                    onClick={() => addItem(dayIndex)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    + Add Item
                  </button>
                </div>

                {day.items.length === 0 ? (
                  <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No items added for this day</p>
                  </div>
                ) : (
                  day.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border rounded p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Item Title *
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItem(dayIndex, itemIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Basic PLC Concepts"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes) *
                          </label>
                          <input
                            type="number"
                            value={item.duration}
                            onChange={(e) => updateItem(dayIndex, itemIndex, 'duration', parseInt(e.target.value) || 0)}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                          </label>
                          <select
                            value={item.type}
                            onChange={(e) => updateItem(dayIndex, itemIndex, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="theory">Theory</option>
                            <option value="practical">Practical</option>
                            <option value="project">Project</option>
                            <option value="demo">Demo</option>
                            <option value="assessment">Assessment</option>
                          </select>
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateItem(dayIndex, itemIndex, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Brief description of this item"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(dayIndex, itemIndex)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Syllabus Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Days:</span>
            <span className="font-medium ml-2">{days.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Total Items:</span>
            <span className="font-medium ml-2">
              {days.reduce((total, day) => total + day.items.length, 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Duration:</span>
            <span className="font-medium ml-2">
              {days.reduce((total, day) => total + day.totalDuration, 0)} minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}