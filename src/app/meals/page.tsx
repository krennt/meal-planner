'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Meal, Ingredient, getAllMeals } from '@/lib/data/meals';
import { createMeal, updateMeal, deleteMeal } from '@/lib/data/mealService';
import NavLayout from '@/components/navigation/NavLayout';

export default function MealsPage() {
  const { user, logout } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('All');
  
  // Form state
  const [formData, setFormData] = useState<Partial<Meal>>({
    name: '',
    description: '',
    cuisine: '',
    ingredients: []
  });
  
  // New ingredient form state
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: '',
    quantity: '',
    category: 'Produce'
  });

  // Load meals on component mount
  useEffect(() => {
    const loadMeals = async () => {
      const allMeals = getAllMeals();
      setMeals(allMeals);
    };
    
    loadMeals();
  }, []);

  // Filtered meals based on search and cuisine filter
  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = cuisineFilter === 'All' || meal.cuisine === cuisineFilter;
    
    return matchesSearch && matchesCuisine;
  });

  // Get unique cuisine types for filter
  const cuisineTypes = ['All', ...new Set(meals.map(meal => meal.cuisine))];

  // Handle selecting a meal for view/edit
  const handleSelectMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setFormData({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      cuisine: meal.cuisine,
      ingredients: [...meal.ingredients],
      imageUrl: meal.imageUrl
    });
    setIsEditing(false);
    setIsCreating(false);
  };

  // Start creating a new meal
  const handleCreateNew = () => {
    setSelectedMeal(null);
    setFormData({
      name: '',
      description: '',
      cuisine: '',
      ingredients: []
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  // Start editing the selected meal
  const handleEditMeal = () => {
    setIsEditing(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding a new ingredient
  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity) {
      alert('Please enter both a name and quantity for the ingredient');
      return;
    }

    const ingredient: Ingredient = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: newIngredient.name as string,
      quantity: newIngredient.quantity as string,
      category: newIngredient.category as string
    };

    setFormData(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), ingredient]
    }));

    // Reset new ingredient form
    setNewIngredient({
      name: '',
      quantity: '',
      category: 'Produce'
    });
  };

  // Handle removing an ingredient
  const handleRemoveIngredient = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter(ing => ing.id !== id) || []
    }));
  };

  // Handle save (create or update)
  const handleSaveMeal = async () => {
    // Validate form data
    if (!formData.name || !formData.description || !formData.cuisine || !formData.ingredients?.length) {
      alert('Please fill in all required fields and add at least one ingredient');
      return;
    }

    try {
      if (isCreating) {
        // Create new meal
        const newMeal = await createMeal({
          name: formData.name,
          description: formData.description,
          cuisine: formData.cuisine,
          ingredients: formData.ingredients || [],
          imageUrl: formData.imageUrl
        });
        
        setMeals(prev => [...prev, newMeal]);
        setSelectedMeal(newMeal);
      } else {
        // Update existing meal
        const updatedMeal = await updateMeal(formData as Meal);
        setMeals(prev => prev.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal));
        setSelectedMeal(updatedMeal);
      }
      
      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to save meal:', error);
      alert('Failed to save meal. Please try again.');
    }
  };

  // Handle delete meal
  const handleDeleteMeal = async () => {
    if (!selectedMeal) return;
    
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await deleteMeal(selectedMeal.id);
        setMeals(prev => prev.filter(meal => meal.id !== selectedMeal.id));
        setSelectedMeal(null);
        setIsEditing(false);
        setIsCreating(false);
      } catch (error) {
        console.error('Failed to delete meal:', error);
        alert('Failed to delete meal. Please try again.');
      }
    }
  };

  // Handle new ingredient form changes
  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ProtectedRoute>
      <NavLayout>
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Meal Management</h2>
            <button
              onClick={handleCreateNew}
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
            >
              Create New Meal
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Meal List */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Meals</h3>
                  
                  {/* Search */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search meals..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Cuisine Filter */}
                  <div>
                    <label htmlFor="cuisineFilter" className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Cuisine
                    </label>
                    <select
                      id="cuisineFilter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={cuisineFilter}
                      onChange={(e) => setCuisineFilter(e.target.value)}
                    >
                      {cuisineTypes.map(cuisine => (
                        <option key={cuisine} value={cuisine}>{cuisine}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {filteredMeals.length > 0 ? (
                    filteredMeals.map(meal => (
                      <li 
                        key={meal.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedMeal?.id === meal.id ? 'bg-primary-50' : ''}`}
                        onClick={() => handleSelectMeal(meal)}
                      >
                        <div className="flex items-center space-x-4">
                          {meal.imageUrl ? (
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                              <img src={meal.imageUrl} alt={meal.name} className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-800 font-medium">{meal.name.charAt(0)}</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{meal.name}</p>
                            <p className="text-sm text-gray-500">{meal.cuisine}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="p-4 text-center text-gray-500">
                      No meals found matching your filters.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Meal Details / Edit / Create */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              {selectedMeal || isCreating ? (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {isCreating ? 'Create New Meal' : isEditing ? 'Edit Meal' : 'Meal Details'}
                    </h3>
                    <div className="space-x-2">
                      {(isEditing || isCreating) ? (
                        <>
                          <button
                            onClick={handleSaveMeal}
                            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setIsCreating(false);
                              if (selectedMeal) {
                                handleSelectMeal(selectedMeal);
                              }
                            }}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleEditMeal}
                            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={handleDeleteMeal}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Meal Form */}
                  {(isEditing || isCreating) ? (
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Meal Name*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter meal name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description*
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter meal description"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-1">
                          Cuisine*
                        </label>
                        <input
                          type="text"
                          id="cuisine"
                          name="cuisine"
                          value={formData.cuisine}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter cuisine type"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL (optional)
                        </label>
                        <input
                          type="text"
                          id="imageUrl"
                          name="imageUrl"
                          value={formData.imageUrl || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter image URL"
                        />
                      </div>
                      
                      {/* Ingredients */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-md font-medium text-gray-900">Ingredients*</h4>
                        </div>
                        
                        {/* Ingredients List */}
                        <div className="mb-4 max-h-[30vh] overflow-y-auto">
                          {formData.ingredients && formData.ingredients.length > 0 ? (
                            <ul className="space-y-2">
                              {formData.ingredients.map(ingredient => (
                                <li key={ingredient.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                  <div>
                                    <p className="font-medium">{ingredient.name}</p>
                                    <p className="text-sm text-gray-500">{ingredient.quantity} ({ingredient.category})</p>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveIngredient(ingredient.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 text-center py-4">No ingredients added yet.</p>
                          )}
                        </div>
                        
                        {/* Add Ingredient Form */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <h5 className="text-sm font-medium text-gray-700 mb-3">Add New Ingredient</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <input
                                type="text"
                                name="name"
                                value={newIngredient.name}
                                onChange={handleIngredientChange}
                                placeholder="Ingredient name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                name="quantity"
                                value={newIngredient.quantity}
                                onChange={handleIngredientChange}
                                placeholder="Quantity (e.g., 2 tbsp)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <select
                                name="category"
                                value={newIngredient.category}
                                onChange={handleIngredientChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="Produce">Produce</option>
                                <option value="Meat">Meat</option>
                                <option value="Seafood">Seafood</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Bakery">Bakery</option>
                                <option value="Grains">Grains</option>
                                <option value="Pantry">Pantry</option>
                              </select>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={handleAddIngredient}
                              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                            >
                              Add Ingredient
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Meal Details View */
                    <div className="space-y-6">
                      {selectedMeal?.imageUrl && (
                        <div className="w-full max-h-64 overflow-hidden rounded-lg">
                          <img 
                            src={selectedMeal.imageUrl} 
                            alt={selectedMeal.name} 
                            className="w-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{selectedMeal?.name}</h4>
                        <p className="text-sm text-primary-600 mt-1">{selectedMeal?.cuisine}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-md font-medium text-gray-700 mb-2">Description</h5>
                        <p className="text-gray-600">{selectedMeal?.description}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-md font-medium text-gray-700 mb-2">Ingredients</h5>
                        <ul className="space-y-2">
                          {selectedMeal?.ingredients.map(ingredient => (
                            <li key={ingredient.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                              <div>
                                <p className="font-medium">{ingredient.name}</p>
                                <p className="text-sm text-gray-500">{ingredient.quantity}</p>
                              </div>
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                                {ingredient.category}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* No meal selected */
                <div className="p-8 text-center">
                  <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Meal Selected</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Select a meal from the list to view its details, or create a new meal to add to your collection.
                  </p>
                  <button
                    onClick={handleCreateNew}
                    className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                  >
                    Create New Meal
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </NavLayout>
    </ProtectedRoute>
  );
}