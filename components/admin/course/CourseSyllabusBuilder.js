
// components/CourseSyllabusBuilder.js
"use client";

import { useState } from "react";

export default function CourseSyllabusBuilder({ syllabus, onSyllabusChange }) {
  const [currentDay, setCurrentDay] = useState({
    dayNumber: syllabus.length + 1,
    dayTitle: "",
    items: [{ title: "", duration: 0, type: "theory" }]
  });

  const addDayToSyllabus = () => {
    if (currentDay.dayTitle && currentDay.items[0].title) {
      const newSyllabus = [...syllabus, { ...currentDay }];
      onSyllabusChange(newSyllabus);
      setCurrentDay({
        dayNumber: currentDay.dayNumber + 1,
        dayTitle: "",
        items: [{ title: "", duration: 0, type: "theory" }]
      });
    } else {
      alert("Please add at least one topic and provide a day title");
    }
  };

  const addItemToCurrentDay = () => {
    setCurrentDay(prev => ({
      ...prev,
      items: [...prev.items, { title: "", duration: 0, type: "theory" }]
    }));
  };

  const updateCurrentDayItem = (index, field, value) => {
    setCurrentDay(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeDay = (dayIndex) => {
    const newSyllabus = syllabus.filter((_, index) => index !== dayIndex);
    // Re-number days
    const renumberedSyllabus = newSyllabus.map((day, index) => ({
      ...day,
      dayNumber: index + 1
    }));
    onSyllabusChange(renumberedSyllabus);
  };

  const removeItemFromCurrentDay = (itemIndex) => {
    setCurrentDay(prev => ({
      ...prev,
      items: prev.items.filter((_, index) => index !== itemIndex)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Syllabus Builder</h2>
      
      {/* Current Day Builder */}
      <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add Day {currentDay.dayNumber}</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Day Title</label>
          <input
            type="text"
            value={currentDay.dayTitle}
            onChange={(e) => setCurrentDay(prev => ({ ...prev, dayTitle: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Introduction to PLC Programming"
          />
        </div>

        {/* Items for Current Day */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Topics & Practicals</label>
          {currentDay.items.map((item, index) => (
            <div key={index} className="flex gap-3 mb-3 p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateCurrentDayItem(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                  placeholder="e.g., Introduction to Digital vs Analog"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={item.duration}
                    onChange={(e) => updateCurrentDayItem(index, 'duration', parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Minutes"
                  />
                  <select
                    value={item.type}
                    onChange={(e) => updateCurrentDayItem(index, 'type', e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                    <option value="project">Project</option>
                    <option value="demo">Demo</option>
                    <option value="assessment">Assessment</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeItemFromCurrentDay(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addItemToCurrentDay}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
          >
            + Add Topic/Practical
          </button>
        </div>

        <button
          type="button"
          onClick={addDayToSyllabus}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add Day to Syllabus
        </button>
      </div>

      {/* Syllabus Preview */}
      {syllabus.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Syllabus Preview ({syllabus.length} days)</h3>
          <div className="space-y-4">
            {syllabus.map((day, dayIndex) => (
              <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-blue-600">
                    Day {day.dayNumber}: {day.dayTitle}
                  </h4>
                  <button
                    onClick={() => removeDay(dayIndex)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Remove Day
                  </button>
                </div>
                <ul className="space-y-2">
                  {day.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-3 text-sm">
                      <span className={`w-20 px-2 py-1 rounded text-xs font-medium ${
                        item.type === 'theory' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'practical' ? 'bg-green-100 text-green-800' :
                        item.type === 'project' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.type}
                      </span>
                      <span>{item.title}</span>
                      <span className="text-gray-500">({item.duration}min)</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 text-xs text-gray-500">
                  Total: {day.items.reduce((total, item) => total + item.duration, 0)} minutes
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}