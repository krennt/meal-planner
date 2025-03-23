'use client';

import Link from 'next/link';

const navigation = [
  { name: 'Meal Plan', href: '/meal-plan' },
  { name: 'Grocery List', href: '/grocery-list' },
  { name: 'Grocery Library', href: '/grocery-library' },
  { name: 'Meals', href: '/meals' },
];

export default function DesktopNav({ currentPath = '/meal-plan' }) {
  return (
    <nav className="hidden md:flex space-x-8">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={
            currentPath === item.href
              ? 'text-white font-medium'
              : 'text-primary-100 font-medium hover:text-white'
          }
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
