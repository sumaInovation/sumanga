// app/courses/loading.js
export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-12 bg-blue-500/50 rounded-lg mb-6 mx-auto max-w-2xl animate-pulse"></div>
          <div className="h-6 bg-blue-500/50 rounded mb-8 mx-auto max-w-3xl animate-pulse"></div>
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-8 w-24 bg-blue-500/50 rounded-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section Skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-300 rounded-lg mb-4 mx-auto max-w-md animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded mb-4 mx-auto max-w-2xl animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="h-12 w-12 bg-gray-300 rounded-lg mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded mb-6 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Courses Grid Skeleton */}
          <div className="mb-12">
            <div className="h-8 bg-gray-300 rounded mb-8 mx-auto max-w-xs animate-pulse"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="aspect-video bg-gray-300 animate-pulse"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 animate-pulse"></div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                      </div>
                      <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}