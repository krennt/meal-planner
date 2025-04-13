import { initialGroceryLibrary } from '@/lib/data/grocery/groceryLibrary';
import { getAllGroceryLibraryItems, batchImportGroceryLibraryItemsWithIds } from './groceryLibraryService';

/**
 * Check if the shared grocery library exists and initialize it if it doesn't
 * This should be called once during application startup
 */
export const initializeSharedGroceryLibrary = async (): Promise<boolean> => {
  try {
    console.log('CHECKING SHARED GROCERY LIBRARY INITIALIZATION...');
    // Check if there are any items in the grocery library collection
    const existingItems = await getAllGroceryLibraryItems();
    
    // If the collection is empty, seed it with the initial library
    if (existingItems.length === 0) {
      const count = await batchImportGroceryLibraryItemsWithIds(initialGroceryLibrary);
      console.log(`SUCCESS: Initialized shared grocery library with ${count} items`);
      return true;
    }
    
    console.log(`Shared grocery library already exists with ${existingItems.length} items. No initialization needed.`);
    return false;
  } catch (error) {
    console.error('Error initializing shared grocery library:', error);
    throw error;
  }
};
