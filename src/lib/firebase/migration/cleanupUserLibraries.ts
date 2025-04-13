import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config';
import { initializeSharedGroceryLibrary } from '../services/groceryLibrary';

/**
 * Clean up any user-specific grocery libraries and ensure the shared library is initialized
 */
export const cleanupAndInitializeSharedLibrary = async () => {
  try {
    console.log('Starting cleanup of user-specific grocery libraries and initializing shared library...');
    
    // Get all users
    const usersRef = collection(db, 'users');
    const userSnapshot = await getDocs(usersRef);
    
    // For each user, check if they have a grocery_library collection and delete it
    let cleanupCount = 0;
    for (const userDoc of userSnapshot.docs) {
      const userId = userDoc.id;
      const userLibraryPath = `users/${userId}/grocery_library`;
      const userLibraryRef = collection(db, userLibraryPath);
      
      try {
        const librarySnapshot = await getDocs(userLibraryRef);
        
        if (librarySnapshot.docs.length > 0) {
          console.log(`Found user library for ${userId} with ${librarySnapshot.docs.length} items. Cleaning up...`);
          
          // Delete each library item
          for (const libraryDoc of librarySnapshot.docs) {
            await deleteDoc(doc(db, userLibraryPath, libraryDoc.id));
            cleanupCount++;
          }
          
          console.log(`Cleaned up library for user ${userId}`);
        }
      } catch (err) {
        console.log(`No grocery library found for user ${userId} or error accessing it:`, err);
      }
    }
    
    console.log(`Cleanup complete. Removed ${cleanupCount} items from user-specific libraries.`);
    
    // Now initialize the shared library
    const initialized = await initializeSharedGroceryLibrary();
    console.log(`Shared library initialization ${initialized ? 'performed' : 'skipped (already exists)'}`);
    
    return {
      success: true,
      cleanupCount,
      initialized
    };
  } catch (error) {
    console.error('Error in cleanup and initialization:', error);
    return {
      success: false,
      error
    };
  }
};

// Expose the function to the window object for debugging
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.cleanupAndInitialize = cleanupAndInitializeSharedLibrary;
}
