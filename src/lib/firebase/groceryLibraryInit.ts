import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';
import { initialGroceryLibrary } from '@/lib/data/grocery/groceryLibrary';
import { 
  createDocumentWithId
} from './firestore';

// Collection name for the shared grocery library
const COLLECTION = 'grocery_library';

/**
 * Initialize the shared grocery library with default items if it doesn't exist
 */
export const initializeSharedGroceryLibrary = async (): Promise<boolean> => {
  try {
    console.log('Checking if shared grocery library needs initialization...');
    
    // Check if the collection exists and has items
    const collectionRef = collection(db, COLLECTION);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log('Grocery library is empty, initializing with default items...');
      
      // Import the initial items
      let count = 0;
      for (const item of initialGroceryLibrary) {
        const { id, ...data } = item;
        await createDocumentWithId(COLLECTION, id, data);
        count++;
      }
      
      console.log(`Successfully initialized grocery library with ${count} items`);
      return true;
    } else {
      console.log(`Grocery library already exists with ${snapshot.size} items`);
      return false;
    }
  } catch (error) {
    console.error('Error initializing shared grocery library:', error);
    throw error;
  }
};
