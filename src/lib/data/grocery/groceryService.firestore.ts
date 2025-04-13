import { Ingredient } from '../meals';
import { initialGroceryLibrary } from './groceryLibrary';
import { 
  getAllGroceryLibraryItems, 
  createGroceryLibraryItem, 
  updateGroceryLibraryItem, 
  deleteGroceryLibraryItem, 
  getGroceryLibraryItem
} from '@/lib/firebase/services/groceryLibrary';
import {
  getActiveGroceryList,
  addItemToGroceryList,
  removeItemFromGroceryList,
  updateItemInGroceryList,
  markItemPurchased,
  clearGroceryList
} from '@/lib/firebase/services/groceryListEventService';
import { getCurrentUser } from '@/lib/firebase/auth';

// Types
export type GroceryItem = Ingredient & {
  isInCart?: boolean;
};

// Load grocery library from Firestore with explicit fallback
export const loadGroceryLibrary = async (): Promise<Ingredient[]> => {
  try {
    console.log('Loading grocery library from Firestore...');
    
    try {
      // Get all items from the shared grocery library
      const items = await getAllGroceryLibraryItems();
      
      if (items && items.length > 0) {
        console.log(`Successfully loaded ${items.length} items from shared grocery library`);
        return items;
      } else {
        console.warn('No items found in Firestore grocery library, falling back to initial data');
        return initialGroceryLibrary;
      }
    } catch (firestoreError) {
      console.error('Failed to load grocery library from Firestore:', firestoreError);
      throw firestoreError;
    }
  } catch (error) {
    console.error('Overall error in loadGroceryLibrary:', error);
    console.warn('FALLING BACK to local grocery library data - this should not happen in production!');
    return initialGroceryLibrary; // Fallback to local data on error
  }
};

// Save grocery list to Firestore (handled by the event sourcing system)
export const saveGroceryList = async (groceryList: GroceryItem[]): Promise<void> => {
  // The grocery list is now managed by the event sourcing system
  // This function is kept for backward compatibility but performs no action
  console.warn('saveGroceryList is deprecated. Use addToGroceryList, removeFromGroceryList, etc. instead.');
};

// Load grocery list from Firestore
export const loadGroceryList = async (): Promise<GroceryItem[]> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.error('Cannot load grocery list: No authenticated user');
      return []; // Return empty list when no user is authenticated
    }
    
    // Get the active grocery list
    const activeList = await getActiveGroceryList(user.uid);
    
    // Map the grocery list items to the expected format
    return activeList.items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      count: item.count,
      isInCart: item.purchased
    }));
  } catch (error) {
    console.error('Failed to load grocery list from Firestore:', error);
    return []; // Return empty list on error
  }
};

// Add an item to the grocery list
export const addToGroceryList = async (item: Ingredient): Promise<GroceryItem[]> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.error('Cannot add to grocery list: No authenticated user');
      return []; // Return empty list when no user is authenticated
    }
    
    // Add the item to the grocery list
    await addItemToGroceryList(
      user.uid,
      item.id,
      item.name,
      item.quantity,
      item.category,
      item.count || 1
    );
    
    // Return the updated list
    return loadGroceryList();
  } catch (error) {
    console.error('Failed to add item to grocery list:', error);
    return [];
  }
};

// Remove an item from the grocery list
export const removeFromGroceryList = async (itemId: string): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.error('Cannot remove from grocery list: No authenticated user');
      return;
    }
    
    // Remove the item from the grocery list
    await removeItemFromGroceryList(user.uid, itemId);
  } catch (error) {
    console.error('Failed to remove item from grocery list:', error);
  }
};

// Add an item to the grocery library (now shared between all users)
export const addToGroceryLibrary = async (item: Ingredient): Promise<Ingredient> => {
  try {
    // Create a new item with a library ID if it doesn't have one
    const newItem: Ingredient = {
      ...item,
      id: item.id || `lib-${item.category.toLowerCase()}-${Date.now()}`
    };
    
    // Add to library
    const createdItem = item.id
      ? await updateGroceryLibraryItem(item.id, item)
      : await createGroceryLibraryItem(newItem);
    
    return createdItem;
  } catch (error) {
    console.error('Failed to add item to grocery library:', error);
    return item;
  }
};

// Update an item in both library and list if it exists
export const updateGroceryItem = async (item: Ingredient): Promise<void> => {
  try {
    // Update in shared library
    const libraryItem = await getGroceryLibraryItem(item.id);
    if (libraryItem) {
      await updateGroceryLibraryItem(item.id, item);
    }
    
    // Update in user's list if user is authenticated
    const user = getCurrentUser();
    if (user) {
      const groceryList = await loadGroceryList();
      const listItem = groceryList.find(i => i.id === item.id);
      
      if (listItem) {
        // Preserve the count and in-cart status
        await updateItemInGroceryList(user.uid, item.id, {
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          purchased: listItem.isInCart
        });
      }
    }
  } catch (error) {
    console.error('Failed to update grocery item:', error);
  }
};

// Remove an item from the grocery library (now shared between all users)
export const removeFromGroceryLibrary = async (itemId: string): Promise<void> => {
  try {
    // Remove from shared library
    await deleteGroceryLibraryItem(itemId);
    
    // Remove from user's list if user is authenticated
    const user = getCurrentUser();
    if (user) {
      await removeFromGroceryList(itemId);
    }
  } catch (error) {
    console.error('Failed to remove item from grocery library:', error);
  }
};

// Mark an item as in the cart (checked)
export const markItemInCart = async (itemId: string, inCart: boolean): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.error('Cannot mark item in cart: No authenticated user');
      return;
    }
    
    // Mark the item as purchased or not
    await markItemPurchased(user.uid, itemId, inCart);
  } catch (error) {
    console.error('Failed to mark item as in cart:', error);
  }
};

// Clear all items marked as in cart from the grocery list
export const clearItemsInCart = async (): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.error('Cannot clear items in cart: No authenticated user');
      return;
    }
    
    // Get the current list
    const groceryList = await loadGroceryList();
    
    // Remove all items that are in cart
    for (const item of groceryList) {
      if (item.isInCart) {
        await removeItemFromGroceryList(item.id);
      }
    }
  } catch (error) {
    console.error('Failed to clear items in cart:', error);
  }
};

// Update the quantity of an item in the grocery list
export const updateItemQuantity = async (itemId: string, newCount: number): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.error('Cannot update item quantity: No authenticated user');
      return;
    }
    
    // Ensure count is at least 1
    const count = Math.max(1, newCount);
    
    // Update the item count
    await updateItemInGroceryList(user.uid, itemId, { count });
  } catch (error) {
    console.error('Failed to update item quantity:', error);
  }
};

// Generate grocery list from meal plan ingredients
export const generateGroceryListFromMeals = async (ingredients: Ingredient[]): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.error('Cannot generate grocery list: No authenticated user');
      return;
    }
    
    // Add each ingredient to the grocery list
    for (const ingredient of ingredients) {
      await addToGroceryList(ingredient);
    }
  } catch (error) {
    console.error('Failed to generate grocery list from meals:', error);
  }
};
