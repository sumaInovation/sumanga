export default function OverviewTab({ stats }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-green-900">Total Courses</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalCourses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-purple-900">Active Students</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.activeStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-orange-900">Instructors</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.instructorsCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a 
          href="/admin/courses/create"
          className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-left block"
        >
          <div className="text-2xl mb-2">➕</div>
          <h3 className="font-semibold">Create Course</h3>
          <p className="text-sm opacity-90">Add new technical course</p>
        </a>
        
        <a 
          href="/admin/courses"
          className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-left block"
        >
          <div className="text-2xl mb-2">📚</div>
          <h3 className="font-semibold">Manage Courses</h3>
          <p className="text-sm opacity-90">View all courses</p>
        </a>
        
        <a 
          href="/admin/users"
          className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-left block"
        >
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold">User Management</h3>
          <p className="text-sm opacity-90">Manage users & roles</p>
        </a>

        <a 
          href="/admin/analytics"
          className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors text-left block"
        >
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm opacity-90">View detailed reports</p>
        </a>
      </div>
    </div>
  );
}