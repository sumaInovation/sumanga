// components/UserAvatar.jsx (Client Component)
"use client";

import { useState } from "react";

export function UserAvatar({ userInfo, size = "md" }) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  // Get user initials for fallback
  const getInitials = (name) => {
    if (!name) return "CU";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get color based on name for consistent avatar colors
  const getColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-red-500', 'bg-yellow-500', 'bg-indigo-500',
      'bg-pink-500', 'bg-teal-500'
    ];
    const index = name?.length % colors.length || 0;
    return colors[index];
  };

  const userName = userInfo?.name || "Customer";
  const userImage = userInfo?.image;

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {userImage && !imageError ? (
        <img
          src={userImage}
          alt={userName}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full ${getColor(userName)} flex items-center justify-center text-white font-semibold ${textSizes[size]} border-2 border-gray-200`}
        >
          {getInitials(userName)}
        </div>
      )}
    </div>
  );
}