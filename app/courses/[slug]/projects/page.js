
// app/courses/[slug]/projects/page.js
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
    title: `${courseTitle} - Hands-on Projects | Suma Automation`,
    description: `Real-world projects and exercises for ${courseTitle}. Practice with hands-on coding exercises and build your portfolio.`,
  };
}

export default async function ProjectsPage({ params }) {
  const { slug } = await params;
  
  const courseData = {
    'basic-plc-programming': {
      title: 'Basic PLC Programming',
      projects: [
        {
          title: "Basic PLC Ladder Logic Program",
          description: "Create your first PLC program with ladder logic for industrial automation. Learn fundamental concepts while building a real control system.",
          difficulty: "Beginner",
          skills: ["Ladder Logic", "I/O Configuration", "Basic Automation"],
          duration: "2-3 hours"
        },
        {
          title: "Industrial Process Control System",
          description: "Build a complete process control system with multiple sensors and actuators. Implement timers, counters, and basic control logic.",
          difficulty: "Intermediate", 
          skills: ["Process Control", "Timer/Counter Logic", "System Integration"],
          duration: "4-6 hours"
        },
        {
          title: "Conveyor System Automation",
          description: "Program a complete conveyor system with multiple stations, sensors, and safety interlocks. Learn industrial automation principles.",
          difficulty: "Advanced",
          skills: ["System Design", "Safety Logic", "Multi-station Control"],
          duration: "8-10 hours"
        }
      ]
    },
    'advanced-plc-programming': {
      title: 'Advanced PLC Programming',
      projects: [
        {
          title: "SCADA System Integration",
          description: "Integrate PLC with SCADA system for advanced monitoring and control. Create HMI interfaces and data logging systems.",
          difficulty: "Advanced",
          skills: ["SCADA Integration", "HMI Design", "Data Logging"],
          duration: "10-12 hours"
        },
        {
          title: "Multi-station Control System",
          description: "Design and program a complex multi-station automation system with coordinated operations and error handling.",
          difficulty: "Advanced",
          skills: ["System Architecture", "Coordination Logic", "Error Handling"],
          duration: "15-20 hours"
        }
      ]
    },
    // Add other courses...
  };

  const course = courseData[slug] || {
    title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    projects: [
      {
        title: "Basic Programming Project",
        description: "Start with fundamental programming concepts and build your first automation project.",
        difficulty: "Beginner",
        skills: ["Basic Programming", "System Setup", "Testing"],
        duration: "3-4 hours"
      },
      {
        title: "Intermediate Application",
        description: "Build a more complex application with advanced features and real-world scenarios.",
        difficulty: "Intermediate",
        skills: ["Advanced Logic", "System Integration", "Troubleshooting"],
        duration: "6-8 hours"
      },
      {
        title: "Advanced System Design",
        description: "Design and implement a complete automation system from scratch with all features.",
        difficulty: "Advanced", 
        skills: ["System Design", "Advanced Programming", "Documentation"],
        duration: "12-15 hours"
      }
    ]
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <span className="text-gray-900 font-semibold">Projects</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Hands-on Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice with real-world projects and build your portfolio
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {course.projects.map((project, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-4">
                    {project.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {project.description}
                </p>

                {/* Project Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium text-gray-900">{project.duration}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm mb-2">Skills You'll Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Resources */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Complete source code provided</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Step-by-step documentation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Video tutorial available</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                    View Project Details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    💻 Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project-based Learning Benefits */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Learn by Building Real Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="font-semibold text-gray-900 mb-2">Portfolio Building</h3>
              <p className="text-gray-600 text-sm">
                Build professional projects for your portfolio and career advancement
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="font-semibold text-gray-900 mb-2">Practical Skills</h3>
              <p className="text-gray-600 text-sm">
                Develop real-world problem-solving skills employers are looking for
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">👨‍💼</div>
              <h3 className="font-semibold text-gray-900 mb-2">Industry Relevant</h3>
              <p className="text-gray-600 text-sm">
                Projects based on actual industry requirements and scenarios
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-900 mb-2">Career Ready</h3>
              <p className="text-gray-600 text-sm">
                Prepare for job interviews and career advancement with real experience
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
            Enroll Now to Access All Projects
          </Link>
          <p className="text-gray-600 mt-4">
            Get hands-on experience with {course.projects.length}+ real-world projects and expert guidance
          </p>
        </div>
      </div>
    </div>
  );
}