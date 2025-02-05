'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useState } from "react";

const navigation = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Links', href: '/dashboard/links' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Team', href: '/dashboard/team' },
  { name: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {/* Left section with Logo and mobile menu */}
            <div className="flex items-center w-[200px]">
              {/* Mobile menu button */}
              <div className="sm:hidden -ml-2 mr-2">
                <button
                  type="button"
                  className="text-gray-300 hover:text-white p-2"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Logo */}
              <div className="flex-shrink-0">
                <Logo />
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden sm:flex flex-1 justify-center">
              <div className="flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      inline-flex items-center px-1 pt-1 text-sm font-medium
                      ${pathname === item.href 
                        ? 'border-b-2 border-emerald-500 text-white'
                        : 'text-gray-300 hover:text-white'}
                    `}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* User Button */}
            <div className="w-[200px] flex justify-end">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      block px-3 py-2 rounded-md text-base font-medium
                      ${pathname === item.href
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-500'}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 