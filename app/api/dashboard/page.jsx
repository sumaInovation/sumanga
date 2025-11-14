// app/staff/dashboard/page.jsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRole } from "@/lib/auth-utils";

export default function StaffDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isStaff } = useRole();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !isStaff) {
      router.push("/unauthorized");
    }
  }, [session, status, isStaff, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!isStaff) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Staff Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Today's Tasks</h3>
              <p className="text-3xl font-bold text-green-600">23</p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900">Pending Requests</h3>
              <p className="text-3xl font-bold text-orange-600">12</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Staff Actions</h2>
            <div className="flex space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Manage Content
              </button>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                Process Requests
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}