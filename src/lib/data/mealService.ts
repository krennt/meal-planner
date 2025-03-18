import { Meal, meals, getAllMeals } from './meals';

// Create a new meal
export const createMeal = async (mealData: Omit<Meal, 'id'>): Promise<Meal> => {
  // In a real app, this would be an API call
  // For now, we'll just simulate adding to our mock data
  
  // Generate a unique ID
  const id = `meal-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  
  const newMeal: Meal = {
    id,
    ...mealData
  };
  
  // Add to "database"
  meals.push(newMeal);
  
  return newMeal;
};

// Update an existing meal
export const updateMeal = async (updatedMeal: Meal): Promise<Meal> => {
  // In a real app, this would be an API call
  
  // Find the index of the meal to update
  const index = meals.findIndex(meal => meal.id === updatedMeal.id);
  
  if (index === -1) {
    throw new Error(`Meal with ID ${updatedMeal.id} not found`);
  }
  
  // Update the meal
  meals[index] = { ...updatedMeal };
  
  return updatedMeal;
};

// Delete a meal
export const deleteMeal = async (id: string): Promise<void> => {
  // In a real app, this would be an API call
  
  // Find the index of the meal to delete
  const index = meals.findIndex(meal => meal.id === id);
  
  if (index === -1) {
    throw new Error(`Meal with ID ${id} not found`);
  }
  
  // Remove the meal
  meals.splice(index, 1);
};

// Make meals selectable for meal plan
export const getMealOptions = async (): Promise<Array<{ value: string, label: string }>> => {
  const allMeals = getAllMeals();
  
  return allMeals.map(meal => ({
    value: meal.id,
    label: meal.name
  }));
};

// Add a meal to a user's favorites (placeholder for future implementation)
export const addMealToFavorites = async (mealId: string, userId: string): Promise<void> => {
  // This would store the favorite in the user's profile
  console.log(`Added meal ${mealId} to favorites for user ${userId}`);
};
