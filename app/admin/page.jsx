"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OverviewTab from "@/components/admin/OverviewTab";
import UserManagementTab from "@/components/admin/user/UserManagementTab";
import CourseManagementTab from "@/components/admin/course/CourseManagementTab";
import ProductManagementTab from "@/components/admin/product/ProductManagementTab";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    activeStudents: 0,
    instructorsCount: 0,
  });

  // Authentication check
  useEffect(() => {
    if (status === "loading") return;
    
    const isAdmin = session?.user?.role === "admin";
    if (!session || !isAdmin) {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, router]);

  // Fetch stats only for overview tab
  useEffect(() => {
    if (activeTab === "overview") {
      const fetchStats = async () => {
        try {
          const response = await fetch("/api/admin/stats");
          const data = await response.json();
          if (data.success) setStats(data);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      };
      fetchStats();
    }
  }, [activeTab]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session?.user?.role !== "admin") {
    return null;
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "users", name: "User Management", icon: "👥" },
    { id: "courses", name: "Course Management", icon: "📚" },
    { id: "products", name: "Product Management", icon: "🛒" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your educational platform</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Welcome, {session.user.name}</div>
              <div className="text-xs text-gray-400">{session.user.email}</div>
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

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "overview" && <OverviewTab stats={stats} />}
          {activeTab === "users" && <UserManagementTab />}
          {activeTab === "courses" && <CourseManagementTab />}
          {activeTab === "products" && <ProductManagementTab />}
        </div>
      </div>
    </div>
  );
}