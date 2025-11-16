
// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Use environment variable for base URL
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "sumaautomation - Arduino, PLC, HMI & Electronics in Sri Lanka",
    template: "%s | sumaautomation"
  },
  description: "Sri Lanka's top Arduino, PLC & electronics supplier. Genuine boards, sensors, microcontrollers. Best prices, fast delivery & expert support.",
  keywords: "arduino, plc, hmi, microcontroller, sensors, automation, electronics, sri lanka, industrial automation, robotics, components",
  
  // Open Graph
  openGraph: {
    title: "sumaautomation - Arduino, PLC & Automation Components in Sri Lanka",
    description: "Your trusted partner for Arduino, PLC systems, HMI panels and industrial automation components in Sri Lanka.",
    url: baseUrl,
    siteName: "sumaautomation",
    images: [
      {
        url: `${baseUrl}/title.jpg`,
        width: 1200,
        height: 630,
        alt: "sumaautomation - Arduino, PLC & Electronics in Sri Lanka",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "sumaautomation - Arduino, PLC & Electronic Components in Sri Lanka",
    description: "Quality Arduino boards, PLC systems, HMI panels and automation components in Sri Lanka.",
    images: [`${baseUrl}/title.jpg`],
  },
  
  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification
  other: {
    'msvalidate.01': '2E5D63B8F0683F41631830141F3AF7C0',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Viewport for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}