'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Meal Plan', href: '/meal-plan' },
  { name: 'Grocery List', href: '/grocery-list' },
  { name: 'Grocery Library', href: '/grocery-library' },
  { name: 'Meals', href: '/meals' },
];

export default function MobileNav({ currentPath = '/meal-plan' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout().then(() => window.location.href = '/login');
  };

  return (
    <div className="md:hidden flex items-center">
      {/* Mobile menu button */}
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 bg-primary-600 shadow-lg">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  currentPath === item.href
                    ? 'bg-primary-700 text-white'
                    : 'text-white hover:bg-primary-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-white hover:bg-primary-500"
            >
              Logout
            </button>
          </div>
          
          {/* User info in mobile menu */}
          <div className="border-t border-primary-500 px-4 py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-800 flex items-center justify-center text-white">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">
                  {user?.displayName || user?.email?.split('@')[0]}
                </div>
                <div className="text-sm font-medium text-primary-100">
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
