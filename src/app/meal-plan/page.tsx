'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Meal, getAllMeals } from '@/lib/data/meals';
import { getMealOptions } from '@/lib/data/mealService';
import { generateGroceryList, MealPlanState } from '@/lib/data/mealPlanService';
import { saveMealPlan, loadMealPlan, saveGroceryList } from '@/lib/data/storageService';
import NavLayout from '@/components/navigation/NavLayout';

export default function MealPlanPage() {
  const { user, logout } = useAuth();
  const [isDemoMode] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [availableMeals, setAvailableMeals] = useState<Meal[]>([]);
  const [mealOptions, setMealOptions] = useState<Array<{ value: string, label: string }>>([]);
  
  // Load meals when component mounts
  useEffect(() => {
    const loadMeals = async () => {
      const meals = getAllMeals();
      setAvailableMeals(meals);
      
      const options = await getMealOptions();
      setMealOptions(options);
    };
    
    loadMeals();
  }, []);
  
  // Load meal plan data with fallback to default
  const [mealData, setMealData] = useState<MealPlanState>(() => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const savedPlan = loadMealPlan();
      if (savedPlan) return savedPlan;
    }
    
    // Fallback to default meal plan
    return {
      Monday: { dinner: 'meal-1' },
      Tuesday: { dinner: 'meal-2' },
      Wednesday: { dinner: 'meal-3' },
      Thursday: { dinner: 'meal-4' },
      Friday: { dinner: 'meal-5' },
      Saturday: { dinner: 'meal-6' },
      Sunday: { dinner: 'meal-7' }
    };
  });
  
  // Save meal plan whenever it changes
  useEffect(() => {
    saveMealPlan(mealData);
  }, [mealData]);

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['dinner'];

  // Format date for display
  const formatWeekRange = (date) => {
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    endOfWeek.setDate(date.getDate() - date.getDay() + 7);
    
    const startMonth = startOfWeek.toLocaleString('default', { month: 'short' });
    const endMonth = endOfWeek.toLocaleString('default', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    } else {
      return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    }
  };

  // Navigate to previous week
  const previousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  // Navigate to next week
  const nextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  // Update meal in the state
  const updateMeal = (day, mealType, mealId) => {
    setMealData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: mealId
      }
    }));
  };

  return (
    <ProtectedRoute>
      <NavLayout>
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Meal Plan</h2>
          <div className="flex space-x-4">
            <button 
              onClick={() => {
                // Generate grocery list will now automatically update the grocery list storage
                const groceryItems = generateGroceryList(mealData);
                alert(`Generated grocery list with ${groceryItems.length} items from your meal plan!`);
                window.location.href = '/grocery-list';
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
            >
              Generate Grocery List
            </button>
          </div>
        </div>

        {/* Week Navigator */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
          <button 
            onClick={previousWeek}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-xl font-medium text-gray-900">
            {formatWeekRange(currentWeek)}
          </h3>
          <button 
            onClick={nextWeek}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Meal Plan Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  {mealTypes.map((type) => (
                    <th key={type} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {weekdays.map((day) => (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {day}
                    </td>
                    {mealTypes.map((type) => (
                      <td key={`${day}-${type}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="relative group">
                          <p className="cursor-pointer group-hover:hidden">
                            {mealData[day] && mealData[day][type] ? 
                              availableMeals.find(meal => meal.id === mealData[day][type])?.name || '—' 
                              : '—'}
                          </p>
                          <div className="hidden group-hover:block">
                            <select
                              value={mealData[day]?.[type] || ''}
                              onChange={(e) => updateMeal(day, type, e.target.value)}
                              className="border-b border-primary-300 focus:border-primary-500 block w-full focus:outline-none bg-transparent"
                            >
                              <option value="">Select a meal...</option>
                              {mealOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </main>
      </NavLayout>
    </ProtectedRoute>
  );
}