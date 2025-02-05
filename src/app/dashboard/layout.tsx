'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="w-[200px] flex-shrink-0">
              <Logo />
            </div>

            {/* Navigation Links - Centered */}
            <div className="flex-1 flex justify-center">
              <div className="hidden sm:flex sm:space-x-8">
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

            {/* User Button - Fixed Width */}
            <div className="w-[200px] flex-shrink-0 flex justify-end">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 