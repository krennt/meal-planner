import { Ingredient } from './meals';

// Types for grocery management
export type GroceryItem = Ingredient & { 
  inShoppingList?: boolean;
};

// Local storage keys
const STORAGE_KEYS = {
  GROCERY_LIBRARY: 'meal-planner-grocery-library',
  GROCERY_SHOPPING_LIST: 'meal-planner-grocery-shopping-list',
};

// Save the grocery library to localStorage
export const saveGroceryLibrary = (items: GroceryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GROCERY_LIBRARY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save grocery library:', error);
  }
};

// Load the grocery library from localStorage
export const loadGroceryLibrary = (): GroceryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GROCERY_LIBRARY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load grocery library:', error);
    return [];
  }
};

// Save the shopping list to localStorage
export const saveShoppingList = (items: GroceryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.GROCERY_SHOPPING_LIST, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save shopping list:', error);
  }
};

// Load the shopping list from localStorage
export const loadShoppingList = (): GroceryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GROCERY_SHOPPING_LIST);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load shopping list:', error);
    return [];
  }
};

// Add an item to the grocery library
export const addToGroceryLibrary = (item: GroceryItem): GroceryItem[] => {
  const library = loadGroceryLibrary();
  
  // Check if a similar item already exists
  const existingItemIndex = library.findIndex(
    existingItem => existingItem.name.toLowerCase() === item.name.toLowerCase() && 
                    existingItem.category === item.category
  );

  if (existingItemIndex !== -1) {
    // Update existing item
    library[existingItemIndex] = {
      ...library[existingItemIndex],
      quantity: item.quantity, // Update with new quantity
      count: item.count || library[existingItemIndex].count || 1 // Keep or update count
    };
  } else {
    // Add new item
    library.push({
      ...item,
      inShoppingList: false
    });
  }
  
  saveGroceryLibrary(library);
  return library;
};

// Add an item to the shopping list
export const addToShoppingList = (item: GroceryItem): GroceryItem[] => {
  // First make sure item is in library
  const library = loadGroceryLibrary();
  let itemInLibrary = library.find(libItem => libItem.id === item.id);
  
  if (!itemInLibrary) {
    // Add to library first if it doesn't exist
    const updatedLibrary = addToGroceryLibrary(item);
    itemInLibrary = updatedLibrary.find(libItem => libItem.id === item.id) || item;
  }
  
  // Now add to shopping list
  const shoppingList = loadShoppingList();
  
  // Check if already in shopping list
  const existingItemIndex = shoppingList.findIndex(
    listItem => listItem.id === item.id
  );
  
  if (existingItemIndex !== -1) {
    // Update existing item in shopping list
    shoppingList[existingItemIndex] = {
      ...shoppingList[existingItemIndex],
      ...item,
      inShoppingList: true
    };
  } else {
    // Add to shopping list
    shoppingList.push({
      ...item,
      inShoppingList: true
    });
  }
  
  saveShoppingList(shoppingList);
  return shoppingList;
};

// Remove from shopping list
export const removeFromShoppingList = (itemId: string): GroceryItem[] => {
  const shoppingList = loadShoppingList();
  const updatedList = shoppingList.filter(item => item.id !== itemId);
  saveShoppingList(updatedList);
  return updatedList;
};

// Update an item in both library and shopping list if it exists in both
export const updateGroceryItem = (item: GroceryItem): { library: GroceryItem[], shoppingList: GroceryItem[] } => {
  // Update in library
  const library = loadGroceryLibrary();
  const updatedLibrary = library.map(libItem => 
    libItem.id === item.id ? { ...item, inShoppingList: libItem.inShoppingList } : libItem
  );
  saveGroceryLibrary(updatedLibrary);
  
  // Update in shopping list if present
  const shoppingList = loadShoppingList();
  const itemInShoppingList = shoppingList.some(listItem => listItem.id === item.id);
  
  let updatedShoppingList = shoppingList;
  if (itemInShoppingList) {
    updatedShoppingList = shoppingList.map(listItem => 
      listItem.id === item.id ? { ...item, inShoppingList: true } : listItem
    );
    saveShoppingList(updatedShoppingList);
  }
  
  return {
    library: updatedLibrary,
    shoppingList: updatedShoppingList
  };
};

// Delete an item from both library and shopping list
export const deleteGroceryItem = (itemId: string): { library: GroceryItem[], shoppingList: GroceryItem[] } => {
  // Remove from library
  const library = loadGroceryLibrary();
  const updatedLibrary = library.filter(item => item.id !== itemId);
  saveGroceryLibrary(updatedLibrary);
  
  // Remove from shopping list
  const shoppingList = loadShoppingList();
  const updatedShoppingList = shoppingList.filter(item => item.id !== itemId);
  saveShoppingList(updatedShoppingList);
  
  return {
    library: updatedLibrary,
    shoppingList: updatedShoppingList
  };
};

// Generate shopping list from meal plan ingredients
export const generateShoppingList = (mealPlanIngredients: Ingredient[]): GroceryItem[] => {
  // First, update the library with any new ingredients
  let library = loadGroceryLibrary();
  
  mealPlanIngredients.forEach(ingredient => {
    // Check if ingredient exists in library
    const existingIndex = library.findIndex(
      item => item.name.toLowerCase() === ingredient.name.toLowerCase() && 
              item.category === ingredient.category
    );
    
    if (existingIndex === -1) {
      // Add to library if it doesn't exist
      library.push({
        ...ingredient,
        id: ingredient.id || `grocery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        inShoppingList: true
      });
    }
  });
  
  saveGroceryLibrary(library);
  
  // Create shopping list from meal plan ingredients
  const shoppingList = mealPlanIngredients.map(ingredient => {
    // Find in library to get the correct ID if it exists
    const libraryItem = library.find(
      item => item.name.toLowerCase() === ingredient.name.toLowerCase() && 
              item.category === ingredient.category
    );
    
    return {
      ...(libraryItem || ingredient),
      id: libraryItem?.id || ingredient.id || `grocery-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      inShoppingList: true
    };
  });
  
  saveShoppingList(shoppingList);
  return shoppingList;
};
