'use client';

import { ReactNode } from 'react';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface NavLayoutProps {
  children: ReactNode;
}

export default function NavLayout({ children }: NavLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 shadow-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Empty div to maintain flexbox spacing when title is removed */}
            <div></div>
            
            <div className="flex items-center space-x-6">
              {/* Desktop Navigation */}
              <DesktopNav currentPath={pathname} />
              
              {/* User profile - hidden on mobile, visible on tablet/desktop */}
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-white">{user?.displayName || user?.email}</span>
                <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center text-white">
                  {user?.displayName ? user.displayName.charAt(0) : user?.email?.charAt(0)}
                </div>
                <button 
                  onClick={() => logout().then(() => window.location.href = '/login')} 
                  className="text-primary-100 hover:text-white"
                >
                  Logout
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <MobileNav currentPath={pathname} />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      {children}
    </div>
  );
}