
// app/courses/[slug]/page.js
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCourseBySlug, getCourseSlugsForSitemap } from '@/lib/courses-data';

// Generate static paths for all courses
export async function generateStaticParams() {
  try {
    const courses = await getCourseSlugsForSitemap();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📄 Generating static pages for ${courses.length} courses`);
    }
    
    return courses.map((course) => ({
      slug: course.slug,
    }));
  } catch (error) {
    console.warn('Failed to generate static params:', error);
    // Return sample slugs for development
    return [
      { slug: 'basic-plc-programming' },
      { slug: 'advanced-plc-programming' },
      { slug: 'basic-robotics-programming' },
      { slug: 'advanced-robotics-programming' },
      { slug: 'kids-robotics' }
    ];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    
    // Sample course data - replace with actual database call
    const sampleCourses = {
      'basic-plc-programming': {
        title: 'Basic PLC Programming',
        description: 'Learn the fundamentals of PLC programming from scratch. Perfect for beginners in industrial automation.',
        shortDescription: 'Start your PLC programming journey with hands-on exercises and real-world examples'
      },
      'advanced-plc-programming': {
        title: 'Advanced PLC Programming',
        description: 'Master advanced PLC programming techniques including SCADA integration, HMI design, and complex automation systems.',
        shortDescription: 'Take your PLC skills to expert level with advanced programming and system integration'
      },
      'basic-robotics-programming': {
        title: 'Basic Robotics Programming',
        description: 'Introduction to robotics programming and automation systems for beginners.',
        shortDescription: 'Start your robotics programming journey with hands-on projects'
      },
      'advanced-robotics-programming': {
        title: 'Advanced Robotics Programming', 
        description: 'Advanced robotics programming techniques and complex automation systems.',
        shortDescription: 'Master advanced robotics programming with real-world applications'
      },
      'kids-robotics': {
        title: 'Kids Robotics Course',
        description: 'Fun and educational robotics programming course designed for children.',
        shortDescription: 'Robotics for young innovators - fun and educational'
      }
    };

    const course = sampleCourses[slug] || await getCourseBySlug(slug);
    
    if (!course) {
      return {
        title: "Course Not Found | Suma Automation",
        description: "Course not found. Browse our professional PLC and robotics programming courses.",
      };
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.sumaautomation.lk';

    return {
      title: `${course.title} | ${course.level || 'Professional'} Course | Suma Automation`,
      description: course.shortDescription || course.description,
      
      alternates: {
        canonical: `${baseUrl}/courses/${slug}`,
      },
      
      openGraph: {
        title: `${course.title} | Suma Automation`,
        description: course.shortDescription || course.description,
        url: `${baseUrl}/courses/${slug}`,
        images: [
          {
            url: `${baseUrl}/images/course-default.jpg`,
            width: 1200,
            height: 630,
            alt: `${course.title} - Suma Automation Sri Lanka`,
          },
        ],
        type: 'website',
        siteName: 'Suma Automation',
        locale: 'en_LK',
      },
      
      twitter: {
        card: "summary_large_image",
        title: `${course.title} | Suma Automation`,
        description: course.shortDescription || course.description,
        images: [`${baseUrl}/images/course-default.jpg`],
      },
      
      keywords: `${course.title}, PLC programming, robotics, automation, sri lanka, online course`,
      
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Course Details | Suma Automation",
      description: "Professional PLC and robotics programming courses in Sri Lanka.",
    };
  }
}

// Course Schema for rich results
function generateCourseSchema(course, slug) {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://www.sumaautomation.lk';
  
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "Suma Automation",
      "sameAs": baseUrl
    },
    "courseCode": slug,
  };

  return schema;
}

export default async function CoursePage({ params }) {
  const { slug } = await params;
  
  // Sample course data - replace with actual database call
  const sampleCourses = {
    'basic-plc-programming': {
      _id: '1',
      title: "Basic PLC Programming",
      slug: "basic-plc-programming",
      category: "PLC Programming",
      level: "Basic",
      description: "Learn the fundamentals of PLC programming from scratch. Perfect for beginners in industrial automation. This course covers everything from basic ladder logic to real-world industrial applications.",
      shortDescription: "Start your PLC programming journey with hands-on exercises and real-world examples",
      price: 15000,
      originalPrice: 20000,
      duration: "6 Weeks",
      delivery: "Online Live Classes",
      language: "English & Sinhala",
      instructor: "Suma Automation Experts",
      enrollmentCount: 25,
      rating: { average: 4.5, count: 12 },
      features: [
        "Live interactive sessions",
        "Hands-on programming exercises",
        "Real industrial examples",
        "Certificate of completion",
        "Lifetime access to materials",
        "Expert instructor support"
      ],
      learningOutcomes: [
        "Understand PLC hardware and architecture",
        "Master ladder logic programming",
        "Create basic automation programs",
        "Troubleshoot PLC systems",
        "Work with timers and counters",
        "Implement basic control systems"
      ],
      requirements: [
        "Basic computer knowledge",
        "No prior programming experience required",
        "Windows PC with internet connection",
        "Interest in industrial automation"
      ]
    },
    'advanced-plc-programming': {
      _id: '2',
      title: "Advanced PLC Programming",
      slug: "advanced-plc-programming",
      category: "PLC Programming",
      level: "Advanced",
      description: "Master advanced PLC programming techniques including SCADA integration, HMI design, and complex automation systems. Perfect for professionals looking to advance their career.",
      shortDescription: "Take your PLC skills to expert level with advanced programming and system integration",
      price: 25000,
      originalPrice: 30000,
      duration: "8 Weeks",
      delivery: "Online Live Classes",
      language: "English & Sinhala",
      instructor: "Suma Automation Experts",
      enrollmentCount: 18,
      rating: { average: 4.8, count: 8 },
      features: [
        "Advanced programming techniques",
        "SCADA system integration",
        "HMI design and development",
        "Industrial networking",
        "Project-based learning",
        "Expert mentorship"
      ],
      learningOutcomes: [
        "Master advanced PLC programming",
        "Integrate SCADA systems",
        "Design professional HMI interfaces",
        "Implement complex automation logic",
        "Troubleshoot advanced systems",
        "Lead automation projects"
      ],
      requirements: [
        "Basic PLC programming knowledge",
        "Understanding of industrial automation",
        "Computer with programming software",
        "6+ months industry experience recommended"
      ]
    },
    'basic-robotics-programming': {
      _id: '3',
      title: "Basic Robotics Programming",
      slug: "basic-robotics-programming",
      category: "Robotics Programming",
      level: "Basic",
      description: "Introduction to robotics programming and automation systems for beginners. Learn to program robots for various applications.",
      shortDescription: "Start your robotics programming journey with hands-on projects",
      price: 18000,
      originalPrice: 22000,
      duration: "6 Weeks",
      delivery: "Online Live Classes",
      language: "English & Sinhala",
      instructor: "Suma Automation Experts",
      enrollmentCount: 15,
      rating: { average: 4.6, count: 10 }
    },
    'advanced-robotics-programming': {
      _id: '4',
      title: "Advanced Robotics Programming",
      slug: "advanced-robotics-programming",
      category: "Robotics Programming",
      level: "Advanced",
      description: "Advanced robotics programming techniques and complex automation systems for experienced developers.",
      shortDescription: "Master advanced robotics programming with real-world applications",
      price: 28000,
      originalPrice: 35000,
      duration: "8 Weeks",
      delivery: "Online Live Classes",
      language: "English & Sinhala",
      instructor: "Suma Automation Experts",
      enrollmentCount: 12,
      rating: { average: 4.9, count: 6 }
    },
    'kids-robotics': {
      _id: '5',
      title: "Kids Robotics Course",
      slug: "kids-robotics",
      category: "Kids Robotics",
      level: "Basic",
      description: "Fun and educational robotics programming course designed for children. Spark interest in STEM fields through hands-on projects.",
      shortDescription: "Robotics for young innovators - fun and educational",
      price: 8000,
      originalPrice: 12000,
      duration: "4 Weeks",
      delivery: "Online Live Classes",
      language: "English & Sinhala",
      instructor: "Suma Automation Experts",
      enrollmentCount: 30,
      rating: { average: 4.7, count: 15 }
    }
  };

  const course = sampleCourses[slug] || await getCourseBySlug(slug);
  
  if (!course) {
    return notFound();
  }

  const isDiscounted = course.originalPrice && course.originalPrice > course.price;
  const discountPercentage = isDiscounted 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  const courseSchema = generateCourseSchema(course, slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      
      {/* Navigation Breadcrumb */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center space-x-2 text-sm overflow-x-auto">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
              Courses
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-[150px] sm:max-w-xs md:max-w-md">
              {course.title}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Course Details - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Course Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                {/* Course Image */}
                <div className="w-full sm:w-64 h-48 sm:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-6xl">
                  {course.category === 'PLC Programming' ? '⚡' : 
                   course.category === 'Robotics Programming' ? '🤖' : '👦'}
                </div>
                
                {/* Course Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      course.level === 'Basic' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {course.level}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {course.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                      {course.duration}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    {course.title}
                  </h1>
                  
                  <p className="text-lg text-gray-600 mb-6">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {course.delivery}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {course.language}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Instructor: {course.instructor}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Features */}
            {course.features && course.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Features</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {course.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Outcomes */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Learn</h2>
                <ul className="grid gap-3">
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                <ul className="grid gap-2">
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-600">
                      <span className="text-gray-400">•</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Navigation */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Course Content</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <Link 
                  href={`/courses/${course.slug}/curriculum`}
                  className="group p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📚</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Curriculum</h3>
                  <p className="text-sm text-gray-600">View detailed syllabus</p>
                </Link>
                
                <Link 
                  href={`/courses/${course.slug}/demo`}
                  className="group p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎥</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Demo Videos</h3>
                  <p className="text-sm text-gray-600">Watch free previews</p>
                </Link>
                
                <Link 
                  href={`/courses/${course.slug}/projects`}
                  className="group p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-center"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💻</div>
                  <h3 className="font-semibold text-gray-900 mb-1">Projects</h3>
                  <p className="text-sm text-gray-600">Hands-on exercises</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Enrollment Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-24">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    LKR {course.price?.toLocaleString()}
                  </span>
                  {isDiscounted && (
                    <span className="text-xl text-gray-500 line-through">
                      LKR {course.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                
                {isDiscounted && (
                  <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-4">
                    Save {discountPercentage}%
                  </span>
                )}
                
                <p className="text-gray-600 text-sm">
                  One-time payment • Lifetime access
                </p>
              </div>

              <Link 
                href={`/courses/${course.slug}/register`}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl block text-center mb-4"
              >
                Enroll Now
              </Link>

              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>✅</span>
                  <span>Certificate of Completion</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>🔄</span>
                  <span>Lifetime Access</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>💬</span>
                  <span>Community Support</span>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Course Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Level</span>
                  <span className={`font-semibold ${
                    course.level === 'Basic' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {course.level}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{course.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-gray-900">{course.delivery}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Language</span>
                  <span className="font-semibold text-gray-900">{course.language}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Students</span>
                  <span className="font-semibold text-gray-900">{course.enrollmentCount || 0} enrolled</span>
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  SA
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{course.instructor}</h4>
                  <p className="text-sm text-gray-600">Industry Expert</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Professional automation engineer with 10+ years of experience in industrial automation and training.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";