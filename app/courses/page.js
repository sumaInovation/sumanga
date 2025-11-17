
// app/courses/page.js
import Link from 'next/link';
import Image from 'next/image';
import { getAllCourses } from '@/lib/courses-data';

export const metadata = {
  title: 'Professional PLC & Robotics Courses | Suma Automation',
  description: 'Learn PLC programming, robotics, and automation with expert-led courses. Basic to advanced levels with hands-on projects.',
};

export default async function CoursesPage() {
  const courses = await getAllCourses();

  // If no courses from database, use sample data
  const displayCourses = courses.length > 0 ? courses : [
    {
      _id: '1',
      title: "Basic PLC Programming",
      slug: "basic-plc-programming",
      category: "PLC Programming",
      level: "Basic",
      description: "Learn the fundamentals of PLC programming from scratch. Perfect for beginners in industrial automation.",
      shortDescription: "Start your PLC programming journey with hands-on exercises",
      price: 15000,
      originalPrice: 20000,
      duration: "6 Weeks",
      delivery: "Online Live Classes",
      enrollmentCount: 25,
      rating: { average: 4.5, count: 12 },
      thumbnail: null
    },
    {
      _id: '2',
      title: "Advanced PLC Programming",
      slug: "advanced-plc-programming",
      category: "PLC Programming", 
      level: "Advanced",
      description: "Master advanced PLC programming techniques including SCADA integration and complex automation systems.",
      shortDescription: "Take your PLC skills to expert level",
      price: 25000,
      originalPrice: 30000,
      duration: "8 Weeks",
      delivery: "Online Live Classes",
      enrollmentCount: 18,
      rating: { average: 4.8, count: 8 },
      thumbnail: null
    },
    {
      _id: '3',
      title: "Basic Robotics Programming",
      slug: "basic-robotics-programming",
      category: "Robotics Programming",
      level: "Basic",
      description: "Introduction to robotics programming and automation systems for beginners.",
      shortDescription: "Start your robotics programming journey",
      price: 18000,
      originalPrice: 22000,
      duration: "6 Weeks", 
      delivery: "Online Live Classes",
      enrollmentCount: 15,
      rating: { average: 4.6, count: 10 },
      thumbnail: null
    },
    {
      _id: '4',
      title: "Advanced Robotics Programming",
      slug: "advanced-robotics-programming",
      category: "Robotics Programming",
      level: "Advanced",
      description: "Advanced robotics programming techniques and complex automation systems.",
      shortDescription: "Master advanced robotics programming",
      price: 28000,
      originalPrice: 35000,
      duration: "8 Weeks",
      delivery: "Online Live Classes", 
      enrollmentCount: 12,
      rating: { average: 4.9, count: 6 },
      thumbnail: null
    },
    {
      _id: '5',
      title: "Kids Robotics Course",
      slug: "kids-robotics",
      category: "Kids Robotics",
      level: "Basic",
      description: "Fun and educational robotics programming course designed for children.",
      shortDescription: "Robotics for young innovators",
      price: 8000,
      originalPrice: 12000,
      duration: "4 Weeks",
      delivery: "Online Live Classes",
      enrollmentCount: 30,
      rating: { average: 4.7, count: 15 },
      thumbnail: null
    }
  ];

  const categories = [
    {
      title: 'PLC Programming',
      description: 'Industrial automation and control systems',
      icon: '⚡',
      courses: displayCourses.filter(c => c.category === 'PLC Programming')
    },
    {
      title: 'Robotics Programming', 
      description: 'Robot programming and automation',
      icon: '🤖',
      courses: displayCourses.filter(c => c.category === 'Robotics Programming')
    },
    {
      title: 'Kids Robotics',
      description: 'Fun and educational robotics for children',
      icon: '👦',
      courses: displayCourses.filter(c => c.category === 'Kids Robotics')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold mb-6">
            Master Automation & Robotics
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Professional training in PLC Programming, Robotics, and Industrial Automation. 
            Learn from industry experts with hands-on projects.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Live Online Classes</span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Project-Based Learning</span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Certificate of Completion</span>
            <span className="bg-white/20 px-4 py-2 rounded-full text-sm">Expert Instructors</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select from our specialized course categories designed for different skill levels and interests
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <div className="text-sm text-gray-500">
                  {category.courses.length} courses available
                </div>
              </div>
            ))}
          </div>

          {/* All Courses Grid */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              All Professional Courses
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Start Your Automation Journey?
            </h3>
            <p className="text-lg mb-6 text-green-100">
              Join hundreds of students who have transformed their careers with our expert-led courses
            </p>
            <Link 
              href="/contact"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Course Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CourseCard({ course }) {
  const isDiscounted = course.originalPrice && course.originalPrice > course.price;
  const discountPercentage = isDiscounted 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Course Image/Icon */}
      <div className="aspect-video relative bg-gray-200">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-4xl">
              {course.category === 'PLC Programming' ? '⚡' : 
               course.category === 'Robotics Programming' ? '🤖' : '👦'}
            </span>
          </div>
        )}
        
        {/* Level Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold text-white ${
          course.level === 'Basic' ? 'bg-green-500' : 'bg-orange-500'
        }`}>
          {course.level}
        </div>

        {/* Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500">{course.category}</span>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-500">{course.duration}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.shortDescription || course.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-semibold text-gray-900">
              {course.rating?.average || 0}
            </span>
            <span className="text-sm text-gray-500">
              ({course.rating?.count || 0} reviews)
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {course.enrollmentCount} enrolled
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              LKR {course.price?.toLocaleString()}
            </span>
            {isDiscounted && (
              <span className="text-sm text-gray-500 line-through">
                LKR {course.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
            {course.delivery}
          </span>
        </div>

        {/* 🚀 REGISTRATION BUTTON ADDED HERE */}
        <div className="space-y-3">
          <Link 
            href={`/courses/${course.slug}/register`}
            className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Enroll Now
          </Link>
          
          <Link 
            href={`/courses/${course.slug}`}
            className="block w-full border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}