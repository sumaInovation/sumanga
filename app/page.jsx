
// app/page.js
// Homepage specific metadata - MUST BE EXPORTED BEFORE THE COMPONENT
export const metadata = {
  title: "sumaautomation - Arduino, PLC & Electronics in Sri Lanka",
  description: "Sri Lanka's trusted Arduino & PLC components supplier. Buy genuine boards, sensors, microcontrollers with best prices, fast islandwide delivery & expert support. PLC Programming, Robotics & Kids Robotics courses available.",
  
  alternates: {
    canonical: "https://www.sumaautomation.lk/",
  },
  
  openGraph: {
    title: "sumaautomation - Arduino, PLC & Automation Components in Sri Lanka", 
    description: "Your trusted partner for Arduino boards, PLC systems, HMI panels in Sri Lanka. Best prices & fast delivery. Learn PLC Programming & Robotics with our expert courses.",
    url: "https://www.sumaautomation.lk",
    images: [
      {
        url: "https://www.sumaautomation.lk/title.jpg",
        width: 1200,
        height: 630,
        alt: "sumaautomation - Arduino, PLC & Electronics in Sri Lanka",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "sumaautomation - Arduino, PLC & Electronic Components in Sri Lanka",
    description: "Quality Arduino boards, PLC systems & automation components in Sri Lanka. Best prices & expert support. PLC & Robotics courses available.",
  },
}

// Homepage Component - MUST BE EXPORTED DEFAULT AFTER METADATA
export default function HomePage() {
  return (
    <>
      {/* Hero Section with H1 */}
      <section className="min-h-screen bg-linear-to-br from-blue-50 to-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
             
            <span className="text-blue-600">SumaAutomation.lk</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Your trusted partner for quality Arduino boards, PLC systems, microcontrollers, 
            and electronic components in Sri Lanka. Best prices with expert technical support.
            <span className="block mt-2 font-semibold text-blue-600">
              Learn PLC Programming & Robotics with our expert courses!
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/products" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 text-center transition-colors"
            >
              Browse Products
            </a>
            <a 
              href="/courses" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 text-center transition-colors"
            >
              Our Courses
            </a>
            <a 
              href="/contact" 
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 text-center transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
             Why Choose SUMAAUTOMATION?(අපව තෝරාගන්නේ ඇයි?)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-600"> Quality Products(ගුණාත්මක භාණ්ඩ)</h3>
              <p className="text-gray-600"> Genuine components from trusted brands worldwide 
              )</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-600"> Professional Courses(වෘත්තීය පාඨමාලා)</h3>
              <p className="text-gray-600">PLC Programming, Robotics & Kids Robotics courses in Sinhala/English</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-600">Fast Delivery</h3>
              <p className="text-gray-600">Islandwide shipping across Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Popular Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <a href="/products?category=arduino" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🔌</div>
              <h3 className="font-semibold text-gray-900">Arduino Boards</h3>
            </a>
            <a href="/products?category=plc" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="font-semibold text-gray-900">PLC Systems</h3>
            </a>
            <a href="/products?category=hmi" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-gray-900">HMI Panels</h3>
            </a>
            <a href="/products?category=servo" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="font-semibold text-gray-900">Servo Motors</h3>
            </a>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Professional Courses(වෘත්තීය පාඨමාලා)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">PLC Programming Course</h3>
              <p className="text-gray-600 mb-6">
                Learn industrial automation with practical PLC programming. Suitable for beginners and professionals.
                සිංහල / ඉංග්‍රීසි මාධ්‍යෙන් ඉගෙන ගන්න.
              </p>
              <a href="/courses/plc-programming" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
                Learn More
              </a>
            </div>
            
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Robotics Course</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive robotics training with Arduino and automation systems. Build real projects.
                ප්‍රායෝගික රොබෝ විද්‍යාව ඉගෙන ගන්න.
              </p>
              <a href="/courses/robotics" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block">
                Learn More
              </a>
            </div>
            
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">👦</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Kids Robotics Course</h3>
              <p className="text-gray-600 mb-6">
                Fun and educational robotics for children. Spark creativity and logical thinking in young minds.
                ළමුන් සඳහා විනෝදජනක රොබෝ විද්‍යා පාඨමාලාව.
              </p>
              <a href="/courses/kids-robotics" className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors inline-block">
                Learn More
              </a>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="/courses" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              View All Courses
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            අදම අප හා එකතු වන්න Join Us Today
          </h2>
          <p className="text-xl mb-8">
            Whether you need electronic components or want to learn new skills, we're here to help you succeed in automation and robotics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get In Touch
            </a>
            <a 
              href="tel:+94700000000" 
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Call Now: +94 762183549
            </a>
          </div>
        </div>
      </section>
    </>
  );
}