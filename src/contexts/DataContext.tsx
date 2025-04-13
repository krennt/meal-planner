'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  GroceryItem,
  Meal,
  ActiveMealPlan,
  ActiveGroceryList,
  MealPlanItem,
  GroceryListItem
} from '@/lib/firebase/models';
import {
  getAllGroceryItems,
  getGroceryItemsByCategory,
  createGroceryItem,
  updateGroceryItem,
  deleteGroceryItem
} from '@/lib/firebase/services/groceryItemService';
import {
  getAllMeals,
  getMealsByCuisine,
  createMeal,
  updateMeal,
  deleteMeal
} from '@/lib/firebase/services/mealService';
import {
  getActiveMealPlan,
  addMealToMealPlan,
  removeMealFromMealPlan,
  clearMealPlan
} from '@/lib/firebase/services/mealPlanEventService';
import {
  getActiveGroceryList,
  addItemToGroceryList,
  removeItemFromGroceryList,
  updateItemInGroceryList,
  markItemPurchased,
  clearGroceryList
} from '@/lib/firebase/services/groceryListEventService';
import {
  getAllGroceryLibraryItems,
  getGroceryLibraryItemsByCategory,
  createGroceryLibraryItem,
  updateGroceryLibraryItem,
  deleteGroceryLibraryItem,
  searchGroceryLibraryItems
} from '@/lib/firebase/services/groceryLibrary';
import { initializeSharedGroceryLibrary } from '@/lib/firebase/groceryLibraryInit';
import { cloudFunctions } from '@/lib/firebase/functions';
import { Ingredient } from '@/lib/data/meals';

// The data context type
type DataContextType = {
  // Grocery Items
  groceryItems: GroceryItem[];
  groceryItemsLoading: boolean;
  getGroceryItems: () => Promise<GroceryItem[]>;
  getGroceryItemsByCategory: (category: string) => Promise<GroceryItem[]>;
  addGroceryItem: (item: Omit<GroceryItem, 'id'>) => Promise<GroceryItem>;
  updateGroceryItem: (id: string, updates: Partial<GroceryItem>) => Promise<GroceryItem>;
  deleteGroceryItem: (id: string) => Promise<boolean>;
  
  // Grocery Library
  groceryLibrary: Ingredient[];
  groceryLibraryLoading: boolean;
  getGroceryLibrary: () => Promise<Ingredient[]>;
  getGroceryLibraryByCategory: (category: string) => Promise<Ingredient[]>;
  addGroceryLibraryItem: (item: Omit<Ingredient, 'id'>) => Promise<Ingredient>;
  updateGroceryLibraryItem: (id: string, updates: Partial<Ingredient>) => Promise<Ingredient>;
  deleteGroceryLibraryItem: (id: string) => Promise<boolean>;
  searchGroceryLibrary: (searchText: string) => Promise<Ingredient[]>;
  
  // Meals
  meals: Meal[];
  mealsLoading: boolean;
  getMeals: () => Promise<Meal[]>;
  getMealsByCuisine: (cuisine: string) => Promise<Meal[]>;
  addMeal: (meal: Omit<Meal, 'id'>) => Promise<Meal>;
  updateMeal: (id: string, updates: Partial<Meal>) => Promise<Meal>;
  deleteMeal: (id: string) => Promise<boolean>;
  
  // Meal Plan
  mealPlan: ActiveMealPlan | null;
  mealPlanLoading: boolean;
  getMealPlan: () => Promise<ActiveMealPlan | null>;
  addMealToMealPlan: (day: string, mealType: string, mealId: string) => Promise<void>;
  removeMealFromMealPlan: (day: string, mealType: string) => Promise<void>;
  clearMealPlan: () => Promise<void>;
  
  // Grocery List
  groceryList: ActiveGroceryList | null;
  groceryListLoading: boolean;
  getGroceryList: () => Promise<ActiveGroceryList | null>;
  addItemToGroceryList: (
    itemId: string | null,
    name: string,
    quantity: string,
    category: string,
    count?: number
  ) => Promise<void>;
  removeItemFromGroceryList: (itemId: string) => Promise<void>;
  updateItemInGroceryList: (itemId: string, updates: Partial<GroceryListItem>) => Promise<void>;
  markItemPurchased: (itemId: string, purchased: boolean) => Promise<void>;
  clearGroceryList: () => Promise<void>;
  generateGroceryListFromMealPlan: () => Promise<void>;
};

// Create the context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // State for grocery items
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [groceryItemsLoading, setGroceryItemsLoading] = useState(true);
  
  // State for grocery library
  const [groceryLibrary, setGroceryLibrary] = useState<Ingredient[]>([]);
  const [groceryLibraryLoading, setGroceryLibraryLoading] = useState(true);
  
  // State for meals
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  
  // State for meal plan
  const [mealPlan, setMealPlan] = useState<ActiveMealPlan | null>(null);
  const [mealPlanLoading, setMealPlanLoading] = useState(true);
  
  // State for grocery list
  const [groceryList, setGroceryList] = useState<ActiveGroceryList | null>(null);
  const [groceryListLoading, setGroceryListLoading] = useState(true);
  
  // Initialize the shared grocery library once during app startup
  useEffect(() => {
    console.log('Initializing shared grocery library...');
    
    // Simple approach: just try to initialize and then load
    initializeSharedGroceryLibrary()
      .then(initialized => {
        console.log(`Grocery library initialization ${initialized ? 'completed' : 'skipped - already exists'}`);
        loadGroceryLibrary();
      })
      .catch(error => {
        console.error('Error initializing shared grocery library:', error);
        loadGroceryLibrary(); // Still try to load even if initialization fails
      });
  }, []);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      
      // Load grocery items
      loadGroceryItems();
      
      // Grocery library is loaded at app startup, not user login
      
      // Load meals
      loadMeals();
      
      // Load meal plan
      loadMealPlan();
      
      // Load grocery list
      loadGroceryList();
    } else {
      // Reset state when user logs out
      setGroceryItems([]);
      setGroceryLibrary([]);
      setMeals([]);
      setMealPlan(null);
      setGroceryList(null);
    }
  }, [user]);
  
  // Grocery Items methods
  const loadGroceryItems = async () => {
    if (!user) return;
    
    setGroceryItemsLoading(true);
    try {
      const items = await getAllGroceryItems();
      setGroceryItems(items);
    } catch (error) {
      console.error('Error loading grocery items:', error);
    } finally {
      setGroceryItemsLoading(false);
    }
  };
  
  const getGroceryItems = async () => {
    await loadGroceryItems();
    return groceryItems;
  };
  
  const addGroceryItem = async (item: Omit<GroceryItem, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newItem = await createGroceryItem(item);
      
      // Update local state
      setGroceryItems(prev => [...prev, newItem]);
      
      return newItem;
    } catch (error) {
      console.error('Error adding grocery item:', error);
      throw error;
    }
  };
  
  const updateGroceryItemHandler = async (id: string, updates: Partial<GroceryItem>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const updatedItem = await updateGroceryItem(id, updates);
      
      // Update local state
      setGroceryItems(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      return updatedItem;
    } catch (error) {
      console.error('Error updating grocery item:', error);
      throw error;
    }
  };
  
  const deleteGroceryItemHandler = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await deleteGroceryItem(id);
      
      // Update local state
      if (result) {
        setGroceryItems(prev => prev.filter(item => item.id !== id));
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting grocery item:', error);
      throw error;
    }
  };
  
  // Grocery Library methods
  const loadGroceryLibrary = async () => {
    setGroceryLibraryLoading(true);
    try {
      const items = await getAllGroceryLibraryItems();
      setGroceryLibrary(items);
    } catch (error) {
      console.error('Error loading grocery library:', error);
    } finally {
      setGroceryLibraryLoading(false);
    }
  };
  
  const getGroceryLibrary = async () => {
    await loadGroceryLibrary();
    return groceryLibrary;
  };
  
  const getGroceryLibraryByCategory = async (category: string) => {
    try {
      const items = await getGroceryLibraryItemsByCategory(category);
      return items;
    } catch (error) {
      console.error('Error getting grocery library by category:', error);
      throw error;
    }
  };
  
  const addGroceryLibraryItem = async (item: Omit<Ingredient, 'id'>) => {
    try {
      const newItem = await createGroceryLibraryItem(item);
      
      // Update local state
      setGroceryLibrary(prev => [...prev, newItem]);
      
      return newItem;
    } catch (error) {
      console.error('Error adding grocery library item:', error);
      throw error;
    }
  };
  
  const updateGroceryLibraryItemHandler = async (id: string, updates: Partial<Ingredient>) => {
    try {
      const updatedItem = await updateGroceryLibraryItem(id, updates);
      
      // Update local state
      setGroceryLibrary(prev => 
        prev.map(item => item.id === id ? { ...item, ...updates } : item)
      );
      
      return updatedItem;
    } catch (error) {
      console.error('Error updating grocery library item:', error);
      throw error;
    }
  };
  
  const deleteGroceryLibraryItemHandler = async (id: string) => {
    try {
      const result = await deleteGroceryLibraryItem(id);
      
      // Update local state
      if (result) {
        setGroceryLibrary(prev => prev.filter(item => item.id !== id));
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting grocery library item:', error);
      throw error;
    }
  };
  
  const searchGroceryLibraryHandler = async (searchText: string) => {
    try {
      return await searchGroceryLibraryItems(searchText);
    } catch (error) {
      console.error('Error searching grocery library:', error);
      throw error;
    }
  };
  
  // Meals methods
  const loadMeals = async () => {
    if (!user) return;
    
    setMealsLoading(true);
    try {
      const allMeals = await getAllMeals();
      setMeals(allMeals);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setMealsLoading(false);
    }
  };
  
  const getMeals = async () => {
    await loadMeals();
    return meals;
  };
  
  const addMeal = async (meal: Omit<Meal, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const newMeal = await createMeal(meal);
      
      // Update local state
      setMeals(prev => [...prev, newMeal]);
      
      return newMeal;
    } catch (error) {
      console.error('Error adding meal:', error);
      throw error;
    }
  };
  
  const updateMealHandler = async (id: string, updates: Partial<Meal>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const updatedMeal = await updateMeal(id, updates);
      
      // Update local state
      setMeals(prev => 
        prev.map(meal => meal.id === id ? { ...meal, ...updates } : meal)
      );
      
      return updatedMeal;
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  };
  
  const deleteMealHandler = async (id: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const result = await deleteMeal(id);
      
      // Update local state
      if (result) {
        setMeals(prev => prev.filter(meal => meal.id !== id));
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  };
  
  // Meal Plan methods
  const loadMealPlan = async () => {
    if (!user) return;
    
    setMealPlanLoading(true);
    try {
      const activeMealPlan = await getActiveMealPlan(user.uid);
      setMealPlan(activeMealPlan);
    } catch (error) {
      console.error('Error loading meal plan:', error);
    } finally {
      setMealPlanLoading(false);
    }
  };
  
  const getMealPlan = async () => {
    await loadMealPlan();
    return mealPlan;
  };
  
  const addMealToMealPlanHandler = async (day: string, mealType: string, mealId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await addMealToMealPlan(user.uid, day, mealType, mealId);
      
      // Reload meal plan to get updated state
      await loadMealPlan();
    } catch (error) {
      console.error('Error adding meal to meal plan:', error);
      throw error;
    }
  };
  
  const removeMealFromMealPlanHandler = async (day: string, mealType: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await removeMealFromMealPlan(user.uid, day, mealType);
      
      // Reload meal plan to get updated state
      await loadMealPlan();
    } catch (error) {
      console.error('Error removing meal from meal plan:', error);
      throw error;
    }
  };
  
  const clearMealPlanHandler = async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await clearMealPlan(user.uid);
      
      // Reload meal plan to get updated state
      await loadMealPlan();
    } catch (error) {
      console.error('Error clearing meal plan:', error);
      throw error;
    }
  };
  
  // Grocery List methods
  const loadGroceryList = async () => {
    if (!user) return;
    
    setGroceryListLoading(true);
    try {
      const activeGroceryList = await getActiveGroceryList(user.uid);
      setGroceryList(activeGroceryList);
    } catch (error) {
      console.error('Error loading grocery list:', error);
    } finally {
      setGroceryListLoading(false);
    }
  };
  
  const getGroceryList = async () => {
    await loadGroceryList();
    return groceryList;
  };
  
  const addItemToGroceryListHandler = async (
    itemId: string | null,
    name: string,
    quantity: string,
    category: string,
    count: number = 1
  ) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await addItemToGroceryList(user.uid, itemId, name, quantity, category, count);
      
      // Reload grocery list to get updated state
      await loadGroceryList();
    } catch (error) {
      console.error('Error adding item to grocery list:', error);
      throw error;
    }
  };
  
  const removeItemFromGroceryListHandler = async (itemId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await removeItemFromGroceryList(user.uid, itemId);
      
      // Reload grocery list to get updated state
      await loadGroceryList();
    } catch (error) {
      console.error('Error removing item from grocery list:', error);
      throw error;
    }
  };
  
  const updateItemInGroceryListHandler = async (itemId: string, updates: Partial<GroceryListItem>) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await updateItemInGroceryList(user.uid, itemId, updates);
      
      // Reload grocery list to get updated state
      await loadGroceryList();
    } catch (error) {
      console.error('Error updating item in grocery list:', error);
      throw error;
    }
  };
  
  const markItemPurchasedHandler = async (itemId: string, purchased: boolean) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await markItemPurchased(user.uid, itemId, purchased);
      
      // Reload grocery list to get updated state
      await loadGroceryList();
    } catch (error) {
      console.error('Error marking item as purchased:', error);
      throw error;
    }
  };
  
  const clearGroceryListHandler = async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await clearGroceryList(user.uid);
      
      // Reload grocery list to get updated state
      await loadGroceryList();
    } catch (error) {
      console.error('Error clearing grocery list:', error);
      throw error;
    }
  };
  
  const generateGroceryListFromMealPlanHandler = async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Call the cloud function
      await cloudFunctions.generateGroceryListFromMealPlan(user.uid);
      
      // Reload grocery list to get updated state
      await loadGroceryList();
    } catch (error) {
      console.error('Error generating grocery list from meal plan:', error);
      throw error;
    }
  };
  
  // Context value
  const value: DataContextType = {
    // Grocery Items
    groceryItems,
    groceryItemsLoading,
    getGroceryItems,
    getGroceryItemsByCategory,
    addGroceryItem,
    updateGroceryItem: updateGroceryItemHandler,
    deleteGroceryItem: deleteGroceryItemHandler,
    
    // Grocery Library
    groceryLibrary,
    groceryLibraryLoading,
    getGroceryLibrary,
    getGroceryLibraryByCategory,
    addGroceryLibraryItem,
    updateGroceryLibraryItem: updateGroceryLibraryItemHandler,
    deleteGroceryLibraryItem: deleteGroceryLibraryItemHandler,
    searchGroceryLibrary: searchGroceryLibraryHandler,
    
    // Meals
    meals,
    mealsLoading,
    getMeals,
    getMealsByCuisine,
    addMeal,
    updateMeal: updateMealHandler,
    deleteMeal: deleteMealHandler,
    
    // Meal Plan
    mealPlan,
    mealPlanLoading,
    getMealPlan,
    addMealToMealPlan: addMealToMealPlanHandler,
    removeMealFromMealPlan: removeMealFromMealPlanHandler,
    clearMealPlan: clearMealPlanHandler,
    
    // Grocery List
    groceryList,
    groceryListLoading,
    getGroceryList,
    addItemToGroceryList: addItemToGroceryListHandler,
    removeItemFromGroceryList: removeItemFromGroceryListHandler,
    updateItemInGroceryList: updateItemInGroceryListHandler,
    markItemPurchased: markItemPurchasedHandler,
    clearGroceryList: clearGroceryListHandler,
    generateGroceryListFromMealPlan: generateGroceryListFromMealPlanHandler
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
