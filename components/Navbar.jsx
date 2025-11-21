// components/Navbar.js
"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session, status, update } = useSession();
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Role checks
  const isAdmin = session?.user?.role === "admin";
  const isStaff = session?.user?.role === "staff" || isAdmin;
  const isInstructor = session?.user?.role === "instructor" || isStaff;
  const userRole = session?.user?.role || "user";

  // Default avatar as data URL
  const defaultAvatar =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2QjcyODAiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxMiIgcj0iNSIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTYgMThDMTAgMTggNiAyMSA2IDI2SDI2QzI2IDIxIDIyIDE4IDE2IDE4WiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K";

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setIsDesktopDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setIsMobileDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  const handleRefreshSession = async () => {
    await update();
    setIsDesktopDropdownOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const getUserImage = () => {
    if (!session?.user) return defaultAvatar;
    return session.user.image || defaultAvatar;
  };

  const getUserName = () => {
    if (!session?.user) return "User";
    return session.user.name || session.user.email || "User";
  };

  // Get role badge color based on role
  const getRoleBadgeColor = () => {
    switch (userRole) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-green-100 text-green-800";
      case "instructor":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Show loading state
  if (status === "loading") {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Suma Automation
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
            >
              Suma Automation
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Home
            </Link>

            {/* Courses Link - Visible to all */}
            <Link
              href="/courses"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Courses
            </Link>

            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              Contact
            </Link>

            {/* Staff/Admin Links */}
           
            {isAdmin && (
              <Link
                href="/admin"
                className="text-red-700 hover:text-red-900 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-red-50"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="relative" ref={desktopDropdownRef}>
                <button
                  onClick={() =>
                    setIsDesktopDropdownOpen(!isDesktopDropdownOpen)
                  }
                  className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-full pl-3 pr-2 py-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-expanded={isDesktopDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                    {getUserName()}
                  </span>
                  <img
                    src={getUserImage()}
                    alt={getUserName()}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
                  />
                </button>

                {isDesktopDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getUserName()}
                      </p>
                      <p className="text-xs text-gray-500 truncate mb-2">
                        {session.user.email}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getRoleBadgeColor()}`}
                        >
                          {userRole}
                        </span>
                        <button
                          onClick={handleRefreshSession}
                          className="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                          title="Refresh session to check for role changes"
                        >
                          <span>🔄</span>
                          Refresh
                        </button>
                      </div>
                    </div>

                    

                    

                    <Link
                      href="/profile/student"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDesktopDropdownOpen(false)}
                      role="menuitem"
                    >
                      Profile
                    </Link>

                  

                    

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 border-l-2 border-red-500 ml-2 transition-colors items-center gap-2"
                        onClick={() => setIsDesktopDropdownOpen(false)}
                        role="menuitem"
                      >
                        <span>⚙️</span>
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setIsDesktopDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors items-center gap-2"
                      role="menuitem"
                    >
                      <span>🚪</span>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {session ? (
              <div className="relative" ref={mobileDropdownRef}>
                <button
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-expanded={isMobileDropdownOpen}
                  aria-label="User menu"
                >
                  <img
                    src={getUserImage()}
                    alt={getUserName()}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
                  />
                </button>

                {isMobileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getUserName()}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${getRoleBadgeColor()}`}
                        >
                          {userRole}
                        </span>
                        <button
                          onClick={handleRefreshSession}
                          className="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                        >
                          <span>🔄</span>
                          Refresh
                        </button>
                      </div>
                    </div>

                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 items-center gap-2"
                      onClick={() => setIsMobileDropdownOpen(false)}
                    >
                      🏠 Home
                    </Link>
                    <Link
                      href="/courses"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 items-center gap-2"
                      onClick={() => setIsMobileDropdownOpen(false)}
                    >
                      📚 Courses
                    </Link>
                     <Link
                      href="/products"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 items-center gap-2"
                      onClick={() => setIsMobileDropdownOpen(false)}
                    >
                      📚 Products
                    </Link>

                    <Link
                      href="/profile/student"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 items-center gap-2"
                      onClick={() => setIsMobileDropdownOpen(false)}
                    >
                      👤 Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 border-l-2 border-red-500 ml-2"
                        onClick={() => setIsMobileDropdownOpen(false)}
                      >
                        ⚙️ Admin
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setIsMobileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 items-center gap-2"
                    >
                      <span>🚪</span>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu for logged out users */}
        {isMobileMenuOpen && !session && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-gray-200 py-2 bg-white"
          >
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium rounded-lg flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>🏠</span>
                Home
              </Link>
              <Link
                href="/courses"
                className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium rounded-lg flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>📚</span>
                Courses
              </Link>
              <Link
                href="/about"
                className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium rounded-lg flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>ℹ️</span>
                About
              </Link>
              <Link
                href="/contact"
                className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium rounded-lg flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>📞</span>
                Contact
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <Link
                href="/login"
                className="px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium rounded-lg flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>🔑</span>
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium rounded-lg text-center mx-4 flex items-center justify-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>🚀</span>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
