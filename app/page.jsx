
// app/page.js
export default function HomePage() {
  return (
    <>
      {/* Hero Section with H1 */}
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Industrial Automation & 
            <span className="text-blue-600"> Electronic Components</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Your trusted partner for quality Arduino boards, PLC systems, microcontrollers, 
            and electronic components in Sri Lanka. Best prices with expert technical support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/products" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 text-center transition-colors"
            >
              Browse Products
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
            Why Choose Sumanga?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Products</h3>
              <p className="text-gray-600">Genuine components from trusted brands worldwide</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Support</h3>
              <p className="text-gray-600">Technical assistance and project guidance</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-600">Islandwide shipping across Sri Lanka</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <a href="/products?category=arduino" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🔌</div>
              <h3 className="font-semibold text-gray-900">Arduino</h3>
            </a>
            <a href="/products?category=plc" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="font-semibold text-gray-900">PLC Systems</h3>
            </a>
            <a href="/products?category=sensors" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📡</div>
              <h3 className="font-semibold text-gray-900">Sensors</h3>
            </a>
            <a href="/products?category=components" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-semibold text-gray-900">Components</h3>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// Add specific metadata for homepage to override layout defaults
export const metadata = {
  title: "Sumanga - Electronics & Arduino Components in Sri Lanka",
  description: "Buy quality Arduino boards, PLC systems, microcontrollers, and electronic components at best prices in Sri Lanka. Fast delivery and expert technical support.",
  keywords: "arduino, electronics, plc, sensors, sri lanka, components, robotics, automation",
  
  openGraph: {
    title: "Sumanga - Electronics & Arduino Components in Sri Lanka",
    description: "Your trusted partner for quality Arduino boards, PLC systems, and electronic components in Sri Lanka.",
    url: "https://sumaautomation.lk",
    siteName: "Sumanga",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sumanga Electronics - Sri Lanka",
      },
    ],
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Sumanga - Electronics & Arduino Components in Sri Lanka",
    description: "Quality Arduino boards, PLC systems, and electronic components in Sri Lanka.",
  },
  
  robots: {
    index: true,
    follow: true,
  }
};