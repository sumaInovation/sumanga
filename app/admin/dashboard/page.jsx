
// app/admin/dashboard/page.jsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductManagementTab from "@/components/ProductManagementTab";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || !isAdmin) {
      router.push("/unauthorized");
    }
  }, [session, status, isAdmin, router]);

  // Fetch users for management
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      
      if (response.ok) {
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your electronics store and online courses</p>
            </div>
            <div className="text-sm text-gray-500">
              Welcome, {session?.user?.name}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: "overview", name: "Overview", icon: "📊" },
                { id: "users", name: "User Management", icon: "👥" },
                { id: "products", name: "Products", icon: "📦" }, // Added Products tab here
                { id: "electronics", name: "Electronics", icon: "📱" },
                { id: "courses", name: "Online Courses", icon: "🎓" },
                { id: "analytics", name: "Analytics", icon: "📈" }
              ].map((tab) => (
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
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "users" && (
            <UserManagementTab 
              users={users} 
              loading={loading} 
              onUpdateRole={updateUserRole} 
            />
          )}
          {activeTab === "products" && <ProductManagementTab />}
          {activeTab === "electronics" && <ElectronicsTab />}
          {activeTab === "courses" && <CoursesTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">1,234</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📱</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-green-900">Electronics Sales</h3>
              <p className="text-3xl font-bold text-green-600">$12,345</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-purple-900">Course Enrollments</h3>
              <p className="text-3xl font-bold text-purple-600">567</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-orange-900">Total Revenue</h3>
              <p className="text-3xl font-bold text-orange-600">$45,678</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold">View Sales Reports</h3>
          <p className="text-sm opacity-90">Detailed analytics and insights</p>
        </button>
        
        <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left">
          <div className="text-2xl mb-2">📦</div>
          <h3 className="font-semibold">Manage Inventory</h3>
          <p className="text-sm opacity-90">Update product stock and prices</p>
        </button>
        
        <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-left">
          <div className="text-2xl mb-2">🎬</div>
          <h3 className="font-semibold">Course Content</h3>
          <p className="text-sm opacity-90">Upload and manage course materials</p>
        </button>
      </div>
    </div>
  );
}

// User Management Tab Component
function UserManagementTab({ users, loading, onUpdateRole }) {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Add New User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.image || "/default-avatar.png"}
                      alt={user.name}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {user.provider}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={user.role}
                    onChange={(e) => onUpdateRole(user._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Electronics Management Tab Component
function ElectronicsTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Electronics Inventory</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product Cards */}
        {[
          { name: "Smartphone X1", price: "$699", stock: 45, category: "Phones" },
          { name: "Laptop Pro", price: "$1299", stock: 23, category: "Computers" },
          { name: "Wireless Earbuds", price: "$149", stock: 89, category: "Audio" },
          { name: "Smart Watch", price: "$299", stock: 34, category: "Wearables" },
          { name: "Tablet Mini", price: "$499", stock: 12, category: "Tablets" },
          { name: "Gaming Console", price: "$399", stock: 67, category: "Gaming" }
        ].map((product, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">{product.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">{product.price}</span>
              <span className={`text-sm px-2 py-1 rounded ${
                product.stock > 20 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                Stock: {product.stock}
              </span>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
                Edit
              </button>
              <button className="flex-1 bg-gray-600 text-white py-2 rounded text-sm hover:bg-gray-700">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Courses Management Tab Component
function CoursesTab() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Online Courses</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          + Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {[
          { title: "Web Development Bootcamp", students: 234, price: "$99", status: "Active" },
          { title: "Mobile App Development", students: 167, price: "$129", status: "Active" },
          { title: "Data Science Fundamentals", students: 89, price: "$149", status: "Draft" },
          { title: "UI/UX Design Masterclass", students: 312, price: "$79", status: "Active" }
        ].map((course, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">{course.title}</h3>
              <span className={`text-sm px-2 py-1 rounded ${
                course.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {course.status}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>👥 {course.students} students</span>
              <span className="font-bold text-green-600">{course.price}</span>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
                Manage Content
              </button>
              <button className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700">
                View Analytics
              </button>
              <button className="flex-1 bg-gray-600 text-white py-2 rounded text-sm hover:bg-gray-700">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Analytics Tab Component
function AnalyticsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Revenue Chart Placeholder</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {[
              { name: "Smartphone X1", sales: 234, revenue: "$12,345" },
              { name: "Laptop Pro", sales: 167, revenue: "$8,999" },
              { name: "Wireless Earbuds", sales: 456, revenue: "$4,567" },
              { name: "Smart Watch", sales: 189, revenue: "$3,456" }
            ].map((product, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{product.name}</span>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{product.sales} sales</div>
                  <div className="text-green-600 font-semibold">{product.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}