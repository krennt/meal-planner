import { initializeSharedGroceryLibrary } from '../services/groceryLibrary';

/**
 * Check if the shared grocery library exists and initialize it if needed
 */
export const checkAndInitializeGroceryLibrary = async (): Promise<boolean> => {
  try {
    console.log('STARTING SHARED GROCERY LIBRARY INITIALIZATION CHECK...');
    // Initialize the shared grocery library if needed
    const initialized = await initializeSharedGroceryLibrary();
    
    if (initialized) {
      console.log('SHARED GROCERY LIBRARY HAS BEEN INITIALIZED');
    } else {
      console.log('SHARED GROCERY LIBRARY ALREADY EXISTS - NO INITIALIZATION NEEDED');
    }
    
    return initialized;
  } catch (error) {
    console.error('Error checking or initializing grocery library:', error);
    throw error;
  }
};
