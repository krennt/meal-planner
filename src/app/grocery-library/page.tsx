'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Ingredient } from '@/lib/data/meals';
import { 
  loadGroceryLibrary,
  saveGroceryLibrary,
  addToGroceryLibrary,
  removeFromGroceryLibrary,
  addToGroceryList,
  loadGroceryList,
  GroceryItem
} from '@/lib/data/grocery/groceryService';
import NavLayout from '@/components/navigation/NavLayout';

export default function GroceryLibraryPage(): React.ReactNode {
  const { user, logout } = useAuth();
  
  // Library state
  const [groceryLibrary, setGroceryLibrary] = useState<Ingredient[]>([]);
  
  // State for grocery list to check if items are already in list
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  
  // Load grocery library and list on initial load
  useEffect(() => {
    setGroceryLibrary(loadGroceryLibrary());
    setGroceryList(loadGroceryList());
  }, []);
  
  // Category filtering
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Produce', 'Meat', 'Seafood', 'Dairy', 'Bakery', 'Grains', 'Pantry'];

  // Search filtering
  const [searchQuery, setSearchQuery] = useState('');

  // State for item being edited
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    quantity: '',
    category: '',
    details: '',
  });
  
  // Start editing an item
  const startEditing = (item: Ingredient) => {
    setEditingItem(item.id);
    setEditForm({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      details: item.details || '',
    });
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditingItem(null);
    setEditForm({
      name: '',
      quantity: '',
      category: '',
      details: '',
    });
  };
  
  // Save edited item
  const saveItem = (id: string) => {
    // Create the updated item
    const updatedItem: Ingredient = {
      id,
      name: editForm.name,
      quantity: editForm.quantity,
      category: editForm.category,
      details: editForm.details.trim() !== '' ? editForm.details : undefined,
    };
    
    // Update the library
    const updatedLibrary = groceryLibrary.map(item => 
      item.id === id ? updatedItem : item
    );
    
    // Save and update state
    saveGroceryLibrary(updatedLibrary);
    setGroceryLibrary(updatedLibrary);
    
    // Clear editing state
    setEditingItem(null);
  };
  
  // Delete an item from library
  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item from your library? This will also remove it from any grocery lists that use it.')) {
      // Remove from library
      removeFromGroceryLibrary(id);
      
      // Reload the library
      setGroceryLibrary(loadGroceryLibrary());
    }
  };

  // State for tracking added items to provide visual feedback
  const [addedItems, setAddedItems] = useState<{[key: string]: boolean}>({});
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>("");

  // Add item from library to grocery list
  const addItemToList = (item: Ingredient) => {
    // Add to grocery list
    const updatedList = addToGroceryList(item);
    
    // Update grocery list state
    setGroceryList(updatedList);
    
    // Track added items for visual feedback
    setAddedItems({...addedItems, [item.id]: true});
    setLastAddedItem(item.name);
    
    // Show feedback
    setShowFeedback(true);
    
    // Clear feedback after 2 seconds
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };
  
  // Filter library items based on category and search query
  const filteredLibraryItems = groceryLibrary
    .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Group library items by category
  const groupedLibraryItems = filteredLibraryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <ProtectedRoute>
      <NavLayout>
        {/* Feedback Toast Notification */}
        {showFeedback && (
          <div className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md">
            <div className="flex items-center">
              <div className="py-1">
                <svg className="h-6 w-6 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold">Added to Grocery List</p>
                <p className="text-sm">{lastAddedItem} was added to your grocery list.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Grocery Library</h2>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Library Items */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Library Items ({filteredLibraryItems.length})</h3>
              <div className="text-sm text-gray-500">Manage your grocery items library</div>
            </div>
          </div>

          {Object.keys(groupedLibraryItems).length > 0 ? (
            <div className="divide-y divide-gray-200">
              {Object.entries(groupedLibraryItems).map(([category, items]) => (
                <div key={category} className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map(item => (
                      <div 
                        key={item.id} 
                        className="p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                      >
                        {editingItem === item.id ? (
                          // Edit mode
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Name</label>
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                              <input
                                type="text"
                                value={editForm.quantity}
                                onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Category</label>
                              <select
                                value={editForm.category}
                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                              >
                                {categories.filter(cat => cat !== 'All').map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Details (optional)</label>
                              <textarea
                                value={editForm.details}
                                onChange={(e) => setEditForm({...editForm, details: e.target.value})}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                                rows={2}
                                placeholder="Brand, preferences, alternatives, etc."
                              />
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                              <button 
                                onClick={() => saveItem(item.id)}
                                className="text-xs bg-primary-600 text-white px-2 py-1 rounded hover:bg-primary-700 transition-colors"
                              >
                                Save
                              </button>
                              <button 
                                onClick={cancelEditing}
                                className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View mode
                          <>
                            <div className="mb-2">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500">{item.quantity}</p>
                              {item.details && (
                                <p className="text-xs text-gray-500 mt-1 italic">{item.details}</p>
                              )}
                            </div>
                            <div className="flex justify-between items-center">
                              <button
                              onClick={() => addItemToList(item)}
                              className={`text-xs px-2 py-1 rounded transition-colors flex items-center ${groceryList.some(listItem => listItem.id === item.id) ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-primary-100 text-primary-800 hover:bg-primary-200'}`}
                              >
                              {groceryList.some(listItem => listItem.id === item.id) ? (
                                <>
                                <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                In List
                                </>
                              ) : 'Add to List'}
                              </button>
                              <div className="flex space-x-1">
                                <button 
                                  onClick={() => startEditing(item)}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
                                  title="Edit item"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => deleteItem(item.id)}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-red-100 focus:outline-none"
                                  title="Delete item"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-600 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No items found matching your filters.
            </div>
          )}
        </div>

        {/* Add New Item Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Item to Library</h3>
          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              
              // Get values from form
              const itemNameInput = document.getElementById('newItemName') as HTMLInputElement;
              const quantityInput = document.getElementById('newQuantity') as HTMLInputElement;
              const categorySelect = document.getElementById('newCategory') as HTMLSelectElement;
              
              const name = itemNameInput.value.trim();
              const quantity = quantityInput.value.trim();
              const category = categorySelect.value;
              const details = (document.getElementById('newDetails') as HTMLTextAreaElement).value.trim();
              
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
                details: details !== '' ? details : undefined
              };
              
              // Add to library
              const newLibraryItem = addToGroceryLibrary(newItem);
              
              // Reload library
              setGroceryLibrary(loadGroceryLibrary());
              
              // Reset form
              itemNameInput.value = '';
              quantityInput.value = '';
            }}
          >
            <div className="md:col-span-2">
              <label htmlFor="newItemName" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                id="newItemName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label htmlFor="newQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Default Quantity
              </label>
              <input
                type="text"
                id="newQuantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 2 lb, 1 bottle"
              />
            </div>
            <div>
              <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="newCategory"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.filter(cat => cat !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1 md:col-span-4 mb-4">
              <label htmlFor="newDetails" className="block text-sm font-medium text-gray-700 mb-1">
                Details (optional)
              </label>
              <textarea
                id="newDetails"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Brand, preferences, alternatives, etc."
                rows={2}
              />
            </div>
            <div className="col-span-1 md:col-span-4 flex justify-end">
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
              >
                Add to Library
              </button>
            </div>
          </form>
        </div>
      </main>
        </NavLayout>
      </ProtectedRoute>
  );
}