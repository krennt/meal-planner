import { Ingredient } from '../meals';
import { initialGroceryLibrary } from './groceryLibrary';

// Storage keys
const STORAGE_KEYS = {
  GROCERY_LIBRARY: 'meal-planner-grocery-library',
  GROCERY_LIST: 'meal-planner-grocery-list',
  GROCERY_CHECKED: 'meal-planner-grocery-checked'
};

// Types
export type GroceryItem = Ingredient & {
  isInCart?: boolean;
};

// Save grocery library to localStorage
export const saveGroceryLibrary = (groceryLibrary: Ingredient[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GROCERY_LIBRARY, JSON.stringify(groceryLibrary));
  } catch (error) {
    console.error('Failed to save grocery library to localStorage:', error);
  }
};

// Load grocery library from localStorage
export const loadGroceryLibrary = (): Ingredient[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GROCERY_LIBRARY);
    // If there's no stored library, use the initial library and save it
    if (!stored) {
      saveGroceryLibrary(initialGroceryLibrary);
      return initialGroceryLibrary;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load grocery library from localStorage:', error);
    return initialGroceryLibrary;
  }
};

// Save grocery list to localStorage
export const saveGroceryList = (groceryList: GroceryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GROCERY_LIST, JSON.stringify(groceryList));
  } catch (error) {
    console.error('Failed to save grocery list to localStorage:', error);
  }
};

// Load grocery list from localStorage
export const loadGroceryList = (): GroceryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GROCERY_LIST);
    // Ensure each item has a default count of at least 1
    const groceryList = stored ? JSON.parse(stored) : [];
    return groceryList.map(item => ({
      ...item,
      count: item.count || 1
    }));
  } catch (error) {
    console.error('Failed to load grocery list from localStorage:', error);
    return [];
  }
};

// Add an item to the grocery list
export const addToGroceryList = (item: Ingredient): void => {
  try {
    const currentList = loadGroceryList();
    
    // Check if the item already exists in the list
    const existingItemIndex = currentList.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      // If the item exists, increment its count
      const count = currentList[existingItemIndex].count || 1;
      currentList[existingItemIndex].count = count + 1;
    } else {
      // Otherwise, add it to the list
      currentList.push({ ...item, count: 1 });
    }
    
    saveGroceryList(currentList);
  } catch (error) {
    console.error('Failed to add item to grocery list:', error);
  }
};

// Remove an item from the grocery list
export const removeFromGroceryList = (itemId: string): void => {
  try {
    let currentList = loadGroceryList();
    currentList = currentList.filter(item => item.id !== itemId);
    saveGroceryList(currentList);
  } catch (error) {
    console.error('Failed to remove item from grocery list:', error);
  }
};

// Add an item to the grocery library
export const addToGroceryLibrary = (item: Ingredient): Ingredient => {
  try {
    const currentLibrary = loadGroceryLibrary();
    
    // Create a new item with a library ID
    const newItem = { 
      ...item, 
      id: `lib-${item.category.toLowerCase()}-${Date.now()}`
    };
    
    // Add to library
    currentLibrary.push(newItem);
    saveGroceryLibrary(currentLibrary);
    
    return newItem;
  } catch (error) {
    console.error('Failed to add item to grocery library:', error);
    return item;
  }
};

// Update an item in both library and list if it exists
export const updateGroceryItem = (item: Ingredient): void => {
  try {
    // Update in library
    const currentLibrary = loadGroceryLibrary();
    const libraryIndex = currentLibrary.findIndex(i => i.id === item.id);
    
    if (libraryIndex >= 0) {
      currentLibrary[libraryIndex] = { ...item };
      saveGroceryLibrary(currentLibrary);
    }
    
    // Update in list if it exists there
    const currentList = loadGroceryList();
    const listIndex = currentList.findIndex(i => i.id === item.id);
    
    if (listIndex >= 0) {
      // Preserve the count
      const count = currentList[listIndex].count || 1;
      currentList[listIndex] = { ...item, count };
      saveGroceryList(currentList);
    }
  } catch (error) {
    console.error('Failed to update grocery item:', error);
  }
};

// Remove an item from the grocery library
export const removeFromGroceryLibrary = (itemId: string): void => {
  try {
    let currentLibrary = loadGroceryLibrary();
    currentLibrary = currentLibrary.filter(item => item.id !== itemId);
    saveGroceryLibrary(currentLibrary);
    
    // Also remove from list if it exists there
    removeFromGroceryList(itemId);
  } catch (error) {
    console.error('Failed to remove item from grocery library:', error);
  }
};

// Mark an item as in the cart (checked)
export const markItemInCart = (itemId: string, inCart: boolean): void => {
  try {
    const currentList = loadGroceryList();
    const itemIndex = currentList.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      currentList[itemIndex] = {
        ...currentList[itemIndex],
        isInCart: inCart
      };
      
      saveGroceryList(currentList);
    }
  } catch (error) {
    console.error('Failed to mark item as in cart:', error);
  }
};

// Clear all items marked as in cart from the grocery list
export const clearItemsInCart = (): void => {
  try {
    let currentList = loadGroceryList();
    currentList = currentList.filter(item => !item.isInCart);
    saveGroceryList(currentList);
  } catch (error) {
    console.error('Failed to clear items in cart:', error);
  }
};

// Update the quantity of an item in the grocery list
export const updateItemQuantity = (itemId: string, newCount: number): void => {
  try {
    const currentList = loadGroceryList();
    const itemIndex = currentList.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      // Ensure count is at least 1
      const count = Math.max(1, newCount);
      
      currentList[itemIndex] = {
        ...currentList[itemIndex],
        count
      };
      
      saveGroceryList(currentList);
    }
  } catch (error) {
    console.error('Failed to update item quantity:', error);
  }
};

// Generate grocery list from meal plan ingredients
export const generateGroceryListFromMeals = (ingredients: Ingredient[]): void => {
  try {
    // Load current grocery list
    let currentList = loadGroceryList();
    
    // Add new ingredients
    ingredients.forEach(ingredient => {
      const existingItemIndex = currentList.findIndex(item => item.id === ingredient.id);
      
      if (existingItemIndex >= 0) {
        // Update count
        const count = currentList[existingItemIndex].count || 1;
        currentList[existingItemIndex].count = count + 1;
      } else {
        // Add new item
        currentList.push({ ...ingredient, count: 1 });
      }
    });
    
    // Save the updated list
    saveGroceryList(currentList);
  } catch (error) {
    console.error('Failed to generate grocery list from meals:', error);
  }
};
