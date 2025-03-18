'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import NavLayout from '@/components/navigation/NavLayout';

export default function Dashboard() {
  const { user } = useAuth();
  const [isDemoMode, setIsDemoMode] = useState(false);
  // Mock data for the dashboard
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const mealPlan = {
    Monday: { dinner: 'Spaghetti Bolognese' },
    Tuesday: { dinner: 'Grilled Salmon' },
    Wednesday: { dinner: 'Stir Fry Vegetables' },
    Thursday: { dinner: 'Baked Chicken' },
    Friday: { dinner: 'Homemade Pizza' },
    Saturday: { dinner: 'Tacos' },
    Sunday: { dinner: 'Roast Beef' }
  };

  const groceryList = [
    { name: 'Chicken Breast', category: 'Meat', quantity: '2 lb', checked: false },
    { name: 'Spinach', category: 'Produce', quantity: '1 bag', checked: true },
    { name: 'Greek Yogurt', category: 'Dairy', quantity: '32 oz', checked: false },
    { name: 'Whole Wheat Bread', category: 'Bakery', quantity: '1 loaf', checked: false },
    { name: 'Tomatoes', category: 'Produce', quantity: '4', checked: true },
    { name: 'Salmon Fillet', category: 'Seafood', quantity: '1 lb', checked: false },
    { name: 'Brown Rice', category: 'Grains', quantity: '2 lb', checked: false },
    { name: 'Olive Oil', category: 'Pantry', quantity: '1 bottle', checked: true }
  ];

  const pantryItems = [
    { name: 'Pasta', quantity: '2 boxes', expiry: '2025-08-10' },
    { name: 'Canned Tomatoes', quantity: '3 cans', expiry: '2025-07-15' },
    { name: 'Rice', quantity: '5 lbs', expiry: '2025-11-20' },
    { name: 'Flour', quantity: '3 lbs', expiry: '2025-06-30' },
    { name: 'Sugar', quantity: '2 lbs', expiry: '2025-12-25' }
  ];

  return (
    <ProtectedRoute>
      <NavLayout>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.displayName || user?.email?.split('@')[0]}!</h2>
          <p className="text-gray-600">Here's an overview of your meal planning and grocery status.</p>
        </div>

        

        {/* Weekly Meal Plan */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">This Week's Meal Plan</h2>
            <Link 
              href="/meal-plan" 
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
            >
              Edit Meal Plan
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dinner
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {weekdays.map((day) => (
                    <tr key={day}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mealPlan[day]?.dinner || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Access Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Grocery List */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Grocery List</h2>
              <Link 
                href="/grocery-list" 
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                View Full List
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {groceryList.slice(0, 5).map((item, index) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={item.checked} 
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
                        readOnly
                      />
                      <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium ${item.checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">{item.quantity} • {item.category}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-6 py-3 bg-gray-50 text-center">
                <p className="text-sm text-gray-500">
                  {groceryList.length - 5} more items in your list
                </p>
              </div>
            </div>
          </div>

          {/* Pantry Inventory */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Grocery Library</h2>
              <Link 
                href="/grocery-library" 
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Manage Library
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {pantryItems.map((item, index) => (
                  <li key={index} className="px-6 py-4">
                    <div>
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(item.expiry).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>


      </main>
        </NavLayout>
      </ProtectedRoute>
  );
}