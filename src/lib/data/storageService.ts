import { MealPlanState } from './mealPlanService';
import { loadGroceryList as loadList, saveGroceryList as saveList } from './grocery/groceryService';

// Storage keys
const STORAGE_KEYS = {
  MEAL_PLAN: 'meal-planner-meal-plan'
};

// Save meal plan to localStorage
export const saveMealPlan = (mealPlan: MealPlanState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(mealPlan));
  } catch (error) {
    console.error('Failed to save meal plan to localStorage:', error);
  }
};

// Load meal plan from localStorage
export const loadMealPlan = (): MealPlanState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load meal plan from localStorage:', error);
    return null;
  }
};

// Save grocery list to localStorage (using new service)
export const saveGroceryList = (groceryList: any[]): void => {
  saveList(groceryList);
};

// Load grocery list from localStorage (using new service)
export const loadGroceryList = (): any[] => {
  return loadList();
};

// Clear all stored data (for logout, etc.)
export const clearStoredData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MEAL_PLAN);
    localStorage.removeItem('meal-planner-grocery-list');
    localStorage.removeItem('meal-planner-grocery-library');
    localStorage.removeItem('meal-planner-grocery-checked');
  } catch (error) {
    console.error('Failed to clear stored data:', error);
  }
};
