'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Ingredient } from '@/lib/data/meals';
import QuantityControl from '@/components/grocery/QuantityControl';
import NavLayout from '@/components/navigation/NavLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  loadGroceryList,
  saveGroceryList,
  addToGroceryLibrary,
  addToGroceryList,
  removeFromGroceryList,
  updateItemQuantity,
  GroceryItem
} from '@/lib/data/grocery/groceryService';

export default function GroceryListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // State for grocery list items
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  
  // Categories for items
  const categories = ['Produce', 'Meat', 'Seafood', 'Dairy', 'Bakery', 'Grains', 'Pantry'];
  
  // Load grocery list on initial load if user is authenticated
  useEffect(() => {
    if (user) {
      setGroceryList(loadGroceryList());
    }
  }, [user]);
  
  // Delete an item from grocery list
  const deleteItem = (id: string) => {
    removeFromGroceryList(id);
    setGroceryList(loadGroceryList());
  };

  // Create a new item and add to both library and list
  const createNewItem = (item: Ingredient) => {
    // Add to library first to get a library ID
    const newLibraryItem = addToGroceryLibrary(item);
    
    // Then add to list
    addToGroceryList(newLibraryItem);
    
    // Reload data
    setGroceryList(loadGroceryList());
  };
  
  // Protect the route
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <NavLayout>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Grocery List</h2>
          <button
            onClick={() => router.push('/meal-plan')}
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors flex items-center"
          >
            Back to Meal Plan
          </button>
        </div>
        
        {/* Grocery List */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Shopping List ({groceryList.length})</h3>
            </div>
          </div>

          {groceryList.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {groceryList.map(item => {
                // Ensure count is always a number and at least 1
                const itemCount = item.count || 1;
                
                return (
                  <li key={item.id} className="p-4 flex items-start hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item.name}
                        {itemCount > 1 && (
                          <span className="ml-2 text-sm bg-primary-100 text-primary-800 py-0.5 px-2 rounded">
                            x{itemCount}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{item.quantity}</div>
                      {item.details && (
                        <div className="text-xs text-gray-500 mt-1 italic">{item.details}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">Category: {item.category}</div>
                    </div>
                    
                    {/* Quantity controls */}
                    <QuantityControl
                      quantity={itemCount}
                      onDecrease={() => {
                        const newCount = Math.max(1, itemCount - 1);
                        updateItemQuantity(item.id, newCount);
                        setGroceryList(loadGroceryList());
                      }}
                      onIncrease={() => {
                        updateItemQuantity(item.id, itemCount + 1);
                        setGroceryList(loadGroceryList());
                      }}
                      className="mr-4"
                    />
                    
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              Your shopping list is empty. Add items using the form below.
            </div>
          )}
        </div>

        {/* Add Item Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Item</h3>
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              
              // Get form inputs
              const itemNameInput = document.getElementById('itemName') as HTMLInputElement;
              const quantityInput = document.getElementById('quantity') as HTMLInputElement;
              const categorySelect = document.getElementById('category') as HTMLSelectElement;
              const detailsInput = document.getElementById('details') as HTMLTextAreaElement;
              const initialCount = parseInt(document.getElementById('initialCount')?.getAttribute('data-count') || '1', 10);
              
              const name = itemNameInput.value.trim();
              const quantity = quantityInput.value.trim();
              const category = categorySelect.value;
              const details = detailsInput.value.trim();
              
              // Validate inputs
              if (!name || !quantity) {
                alert('Please fill in both item name and quantity');
                return;
              }
              
              // Create new item with temporary ID
              const newItem: Ingredient = {
                id: `temp-${Date.now()}`,
                name,
                quantity,
                category,
                count: initialCount,
                details: details !== '' ? details : undefined
              };
              
              // Add to both library and list
              createNewItem(newItem);
              
              // Reset form
              itemNameInput.value = '';
              quantityInput.value = '';
              detailsInput.value = '';
              
              // Reset the quantity control to 1
              const countEl = document.getElementById('initialCount');
              if (countEl) {
                countEl.setAttribute('data-count', '1');
                const countSpan = countEl.querySelector('span');
                if (countSpan) countSpan.textContent = '1';
              }
            }}
          >
            <div className="md:col-span-2">
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name*
              </label>
              <input
                type="text"
                id="itemName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity*
              </label>
              <input
                type="text"
                id="quantity"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 2 lb, 1 bottle"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="initialCount" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Count
              </label>
              <div id="initialCount" data-count="1">
                <QuantityControl
                  quantity={1}
                  onIncrease={() => {
                    const countEl = document.getElementById('initialCount');
                    if (countEl) {
                      const currentCount = parseInt(countEl.getAttribute('data-count') || '1', 10);
                      const newCount = currentCount + 1;
                      countEl.setAttribute('data-count', newCount.toString());
                      countEl.querySelector('span')!.textContent = newCount.toString();
                    }
                  }}
                  onDecrease={() => {
                    const countEl = document.getElementById('initialCount');
                    if (countEl) {
                      const currentCount = parseInt(countEl.getAttribute('data-count') || '1', 10);
                      const newCount = Math.max(1, currentCount - 1);
                      countEl.setAttribute('data-count', newCount.toString());
                      countEl.querySelector('span')!.textContent = newCount.toString();
                    }
                  }}
                />
              </div>
            </div>
            <div className="md:col-span-4 mb-4">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                Details (optional)
              </label>
              <textarea
                id="details"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brand, preferences, alternatives, etc."
              />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      </main>
      </NavLayout>
    </ProtectedRoute>
  );
}