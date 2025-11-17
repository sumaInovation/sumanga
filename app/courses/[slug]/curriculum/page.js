
// app/courses/[slug]/curriculum/page.js
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
    title: `${courseTitle} - Curriculum & Syllabus | Suma Automation`,
    description: `Complete curriculum and syllabus for ${courseTitle}. Learn with structured modules and hands-on projects.`,
  };
}

export default async function CurriculumPage({ params }) {
  const { slug } = await params;
  
  const courseData = {
    'basic-plc-programming': {
      title: 'Basic PLC Programming',
      modules: [
        {
          title: 'Introduction to Industrial Automation',
          duration: 'Week 1',
          topics: [
            'What is PLC and Industrial Automation?',
            'PLC Hardware Components',
            'Input/Output Devices',
            'Safety in Industrial Environments'
          ],
          resources: ['Video Lectures', 'PDF Notes', 'Quiz']
        },
        {
          title: 'Ladder Logic Fundamentals',
          duration: 'Week 2-3',
          topics: [
            'Ladder Logic Programming Basics',
            'Contacts, Coils, and Timers',
            'Basic Logic Gates Implementation',
            'Practical Programming Exercises'
          ],
          resources: ['Video Tutorials', 'Programming Exercises', 'Live Sessions']
        },
        {
          title: 'Advanced Ladder Logic',
          duration: 'Week 4-5',
          topics: [
            'Counters and Their Applications',
            'Data Comparison Instructions',
            'Math Instructions',
            'Real-world Case Studies'
          ],
          resources: ['Project Work', 'Code Examples', 'Mentor Support']
        },
        {
          title: 'Final Project & Certification',
          duration: 'Week 6',
          topics: [
            'Complete Industrial Application Project',
            'Troubleshooting Techniques',
            'Project Submission and Review',
            'Certificate of Completion'
          ],
          resources: ['Project Guidelines', 'One-on-One Support', 'Certificate']
        }
      ]
    },
    'advanced-plc-programming': {
      title: 'Advanced PLC Programming',
      modules: [
        {
          title: 'Advanced Programming Techniques',
          duration: 'Week 1-2',
          topics: [
            'Structured Text Programming',
            'Function Block Diagrams',
            'Sequential Function Charts',
            'Advanced Data Handling'
          ]
        },
        {
          title: 'SCADA System Integration',
          duration: 'Week 3-4',
          topics: [
            'SCADA Architecture and Components',
            'HMI Design Principles',
            'Alarm Management Systems',
            'Data Logging and Reporting'
          ]
        },
        {
          title: 'Industrial Networking',
          duration: 'Week 5-6',
          topics: [
            'Industrial Ethernet Protocols',
            'PROFIBUS and PROFINET',
            'DeviceNet and Modbus',
            'Network Troubleshooting'
          ]
        },
        {
          title: 'Advanced Project Implementation',
          duration: 'Week 7-8',
          topics: [
            'Complex System Design',
            'Multi-station Control Systems',
            'Project Documentation',
            'Industry Best Practices'
          ]
        }
      ]
    },
    'basic-robotics-programming': {
      title: 'Basic Robotics Programming',
      modules: [
        {
          title: 'Introduction to Robotics',
          duration: 'Week 1',
          topics: [
            'Robotics Fundamentals',
            'Types of Industrial Robots',
            'Robot Anatomy and Components',
            'Safety in Robotics'
          ]
        },
        {
          title: 'Basic Robot Programming',
          duration: 'Week 2-3',
          topics: [
            'Coordinate Systems',
            'Motion Programming',
            'Simple Pick and Place Operations',
            'Basic I/O Operations'
          ]
        },
        {
          title: 'Advanced Motion Control',
          duration: 'Week 4-5',
          topics: [
            'Path Planning',
            'Speed and Acceleration Control',
            'Complex Motion Sequences',
            'Error Handling'
          ]
        },
        {
          title: 'Final Robotics Project',
          duration: 'Week 6',
          topics: [
            'Complete Automation Cell Design',
            'Integration with Peripheral Devices',
            'Project Testing and Validation',
            'Documentation and Presentation'
          ]
        }
      ]
    },
    'kids-robotics': {
      title: 'Kids Robotics Course',
      modules: [
        {
          title: 'Introduction to Robotics for Kids',
          duration: 'Week 1',
          topics: [
            'What are Robots?',
            'Different Types of Robots',
            'Basic Robot Components',
            'Robot Safety for Kids'
          ],
          resources: ['Fun Video Lessons', 'Coloring Sheets', 'Interactive Quizzes']
        },
        {
          title: 'Building Your First Robot',
          duration: 'Week 2-3',
          topics: [
            'Simple Robot Assembly',
            'Understanding Motors and Sensors',
            'Basic Robot Movements',
            'Creative Robot Design'
          ],
          resources: ['Step-by-Step Guides', 'Building Blocks', 'Parent-Child Activities']
        },
        {
          title: 'Basic Robot Programming',
          duration: 'Week 4-5',
          topics: [
            'Drag-and-Drop Programming',
            'Making Robots Move',
            'Simple Commands and Sequences',
            'Fun Programming Challenges'
          ],
          resources: ['Visual Programming Tools', 'Game-Based Learning', 'Creative Projects']
        },
        {
          title: 'Final Project & Showcase',
          duration: 'Week 6',
          topics: [
            'Design Your Own Robot Project',
            'Project Presentation Skills',
            'Showcase Your Creation',
            'Certificate of Achievement'
          ],
          resources: ['Project Templates', 'Presentation Guide', 'Digital Certificate']
        }
      ]
    }
    // Add similar structures for other courses...
  };

  const course = courseData[slug];

  if (!course) {
    return notFound();
  }

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
            <span className="text-gray-900 font-semibold">Curriculum</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Course Curriculum
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Structured learning path for {course.title}
          </p>
        </div>

        {/* Curriculum Modules */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="divide-y divide-gray-200">
            {course.modules.map((module, index) => (
              <div key={index} className="p-6 sm:p-8 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {module.title}
                      </h3>
                      {module.duration && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          ⏱️ {module.duration}
                        </span>
                      )}
                    </div>
                    
                    {/* Topics */}
                    {module.topics && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Topics Covered:</h4>
                        <ul className="grid gap-2">
                          {module.topics.map((topic, topicIndex) => (
                            <li key={topicIndex} className="flex items-center gap-2 text-gray-600">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Resources */}
                    {module.resources && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">Learning Resources:</h4>
                        <div className="flex flex-wrap gap-2">
                          {module.resources.map((resource, resIndex) => (
                            <span
                              key={resIndex}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            href={`/courses/${slug}/register`}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            Enroll Now to Access Full Curriculum
          </Link>
          <p className="text-gray-600 mt-4 text-sm">
            Get lifetime access to all course materials, videos, and resources
          </p>
        </div>
      </div>
    </div>
  );
}