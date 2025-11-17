// app/courses/[slug]/demo/page.js
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  const courseTitles = {
    'basic-plc-programming': 'Basic PLC Programming',
    'advanced-plc-programming': 'Advanced PLC Programming',
    'basic-robotics-programming': 'Basic Robotics Programming',
    'advanced-robotics-programming': 'Advanced Robotics Programming',
    'kids-robotics': 'Kids Robotics Course'
  };

  const courseTitle = courseTitles[slug] || 'Course';

  return {
    title: `${courseTitle} - Demo Videos | Suma Automation`,
    description: `Watch free demo videos and preview lessons from ${courseTitle}. See what you'll learn in this professional course.`,
  };
}

export default async function DemoPage({ params }) {
  const { slug } = await params;
  
  const courseData = {
    'basic-plc-programming': {
      title: 'Basic PLC Programming',
      videos: [
        {
          title: "Course Introduction & Overview",
          description: "Get a complete overview of what you'll learn in this PLC programming course and see real-world applications.",
          duration: "5:30",
          thumbnail: "/images/video-thumbnail.jpg"
        },
        {
          title: "Ladder Logic Programming Basics",
          description: "Watch how we teach fundamental ladder logic programming with practical examples and exercises.",
          duration: "8:15", 
          thumbnail: "/images/video-thumbnail.jpg"
        },
        {
          title: "Real Industrial Application Demo",
          description: "See a real PLC controlling an industrial process - exactly the type of projects you'll work on.",
          duration: "6:45",
          thumbnail: "/images/video-thumbnail.jpg"
        }
      ]
    },
    'advanced-plc-programming': {
      title: 'Advanced PLC Programming',
      videos: [
        {
          title: "SCADA System Integration Demo",
          description: "See how we integrate PLC systems with SCADA for advanced monitoring and control.",
          duration: "7:20",
          thumbnail: "/images/video-thumbnail.jpg"
        },
        {
          title: "Advanced Programming Techniques",
          description: "Preview of structured text programming and advanced automation logic.",
          duration: "9:10",
          thumbnail: "/images/video-thumbnail.jpg"
        }
      ]
    },
    // Add other courses...
  };

  const course = courseData[slug] || {
    title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    videos: [
      {
        title: "Course Introduction",
        description: "Get an overview of what you'll learn in this course",
        duration: "5:30",
        thumbnail: "/images/video-thumbnail.jpg"
      },
      {
        title: "Sample Lesson Preview", 
        description: "See how our expert instructors teach complex concepts",
        duration: "8:15",
        thumbnail: "/images/video-thumbnail.jpg"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation Breadcrumb */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center space-x-2 text-sm overflow-x-auto">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Courses
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/courses/${slug}`} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              {course.title}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Demo Videos</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Course Demo Videos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch free previews and see what you'll learn in {course.title}
          </p>
        </div>

        {/* Demo Videos Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {course.videos.map((video, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              {/* Video Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {video.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {video.description}
                </p>
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Free Preview
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Video Features */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What You Get in Full Course
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="font-semibold text-gray-900 mb-2">HD Video Lessons</h3>
              <p className="text-gray-600 text-sm">
                High-quality video content with clear explanations and demonstrations
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Lifetime Access</h3>
              <p className="text-gray-600 text-sm">
                Access course materials anytime, anywhere on any device
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">
                Get help from industry expert instructors throughout your learning journey
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            href={`/courses/${slug}/register`}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg text-lg"
          >
            Enroll Now for Full Course Access
          </Link>
          <p className="text-gray-600 mt-4">
            Get instant access to all video content, projects, and expert support
          </p>
        </div>
      </div>
    </div>
  );
}