// lib/auth-utils.js
import { useSession } from "next-auth/react";

// Hook to check user role
export function useRole() {
  const { data: session } = useSession();
  
  return {
    isAdmin: session?.user?.role === "admin",
    isStaff: session?.user?.role === "staff" || session?.user?.role === "admin",
    isUser: session?.user?.role === "user",
    role: session?.user?.role || "user",
    hasRole: (requiredRole) => {
      const roles = { user: 1, staff: 2, admin: 3 };
      const userRole = session?.user?.role || "user";
      return roles[userRole] >= roles[requiredRole];
    }
  };
}

// Server-side role check
export function checkRole(role, requiredRole) {
  const roles = { user: 1, staff: 2, admin: 3 };
  return roles[role] >= roles[requiredRole];
}