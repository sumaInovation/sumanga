
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
    default: "Sumanga - Electronics & Arduino Components",
    template: "%s | Sumanga"
  },
  description: "Buy quality Arduino boards, PLC systems, and electronic components at best prices in Sri Lanka. Fast delivery and expert support.",
  keywords: "arduino, electronics, plc, sensors, sri lanka, components, robotics",
  
  // Open Graph
  openGraph: {
    title: "Sumanga - Electronics & Arduino Components",
    description: "Buy quality Arduino boards, PLC systems, and electronic components at best prices in Sri Lanka.",
    url: baseUrl,
    siteName: "Sumanga",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`, // Create this image in public folder
        width: 1200,
        height: 630,
        alt: "Sumanga Electronics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Sumanga - Electronics & Arduino Components",
    description: "Buy quality Arduino boards, PLC systems, and electronic components at best prices in Sri Lanka.",
    images: [`${baseUrl}/og-image.jpg`],
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
  
  // Verification (Add your codes here after deployment)
  other: {
    // Bing Verification (get from Bing Webmaster Tools)
    'msvalidate.01': '2E5D63B8F0683F41631830141F3AF7C0',
    
    // Google Verification (optional)
    // 'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
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