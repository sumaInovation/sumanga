// app/about/page.js
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { number: '500+', label: 'Students Trained' },
    { number: '50+', label: 'Industry Projects' },
    { number: '95%', label: 'Success Rate' },
    { number: '10+', label: 'Expert Trainers' }
  ];

  const teamMembers = [
    {
      name: 'John Silva',
      role: 'Lead PLC & Automation Trainer',
      bio: '15+ years experience in industrial automation with expertise in Siemens, Allen-Bradley, and Mitsubishi PLC systems.',
      image: '/images/team/john-silva.jpg'
    },
    {
      name: 'Sarah Perera',
      role: 'Robotics & Embedded Systems Specialist',
      bio: 'Masters in Robotics with 10+ years in embedded systems design and IoT applications.',
      image: '/images/team/sarah-perera.jpg'
    },
    {
      name: 'Mike Fernando',
      role: 'Industrial IoT & SCADA Expert',
      bio: 'Specialized in SCADA systems, HMI development, and industrial communication protocols.',
      image: '/images/team/mike-fernando.jpg'
    },
    {
      name: 'Lisa Rathnayake',
      role: 'Curriculum Development Head',
      bio: '8+ years in technical education with focus on hands-on learning and industry-relevant curriculum.',
      image: '/images/team/lisa-rathnayake.jpg'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Practical Learning',
      description: 'Focus on hands-on experience with real industrial equipment and projects'
    },
    {
      icon: '🏆',
      title: 'Excellence',
      description: 'Commitment to delivering high-quality education and industry-standard training'
    },
    {
      icon: '🤝',
      title: 'Industry Partnership',
      description: 'Strong connections with local industries for relevant curriculum and placements'
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description: 'Continuous curriculum updates with latest technologies and industry trends'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About  SumaAumationlk</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Empowering the next generation of automation engineers and robotics specialists 
              with industry-relevant skills and hands-on training.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/courses" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Explore Courses
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story & Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded with a vision to bridge the gap between academia and industry in automation technology
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'mission'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Our Mission
              </button>
              <button
                onClick={() => setActiveTab('vision')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'vision'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Our Vision
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'story'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Our Story
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'mission' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To provide high-quality, industry-relevant technical education in automation, robotics, 
                  and embedded systems. We are committed to equipping students with practical skills through 
                  hands-on training, modern equipment, and real-world projects. Our mission is to create 
                  competent professionals who can immediately contribute to the growing automation industry 
                  in Sri Lanka and beyond.
                </p>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔭</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To become the leading technical training institute in South Asia for automation and 
                  robotics education. We envision a future where Sri Lankan engineers are at the forefront 
                  of industrial automation technology, driving innovation and economic growth through 
                  cutting-edge skills and expertise in PLC programming, robotics, and IoT systems.
                </p>
              </div>
            )}

            {activeTab === 'story' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">📖</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded in 2018 by a team of industry professionals who recognized the growing need for 
                  skilled automation engineers in Sri Lanka's manufacturing sector. Starting with a single 
                  PLC programming course, we have expanded our curriculum to include robotics, embedded systems, 
                  and industrial IoT. Our hands-on approach and industry partnerships have helped hundreds of 
                  students launch successful careers in automation technology.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Sumanga Institute
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry experts and passionate educators dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-6xl">👤</span>
                  {/* Replace with actual image: <Image src={member.image} alt={member.name} className="w-full h-full object-cover" /> */}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Facilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              State-of-the-art labs and equipment for hands-on learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">PLC & Automation Lab</h3>
              <p className="text-gray-600">
                Fully equipped with Siemens S7-200, S7-1200, Allen-Bradley, and Mitsubishi PLC systems
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Robotics Lab</h3>
              <p className="text-gray-600">
                Industrial robots, servo systems, stepper motors, and complete robotic workcells
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Electronics Lab</h3>
              <p className="text-gray-600">
                Modern electronics workstations with oscilloscopes, function generators, and prototyping equipment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of successful students who have transformed their careers with our industry-focused training programs.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/courses" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse Courses
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Schedule Visit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}