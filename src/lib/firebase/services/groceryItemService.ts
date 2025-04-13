import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { 
  createDocument, 
  createDocumentWithId, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  getAllDocuments, 
  queryDocuments 
} from '../firestore';
import { GroceryItem } from '../models';

// Collection name
const COLLECTION = 'grocery_items';

/**
 * Create a new grocery item
 */
export const createGroceryItem = async (data: Omit<GroceryItem, 'id'>): Promise<GroceryItem> => {
  try {
    return await createDocument(COLLECTION, data) as GroceryItem;
  } catch (error) {
    console.error('Error creating grocery item:', error);
    throw error;
  }
};

/**
 * Create a grocery item with a specific ID
 */
export const createGroceryItemWithId = async (id: string, data: Omit<GroceryItem, 'id'>): Promise<GroceryItem> => {
  try {
    return await createDocumentWithId(COLLECTION, id, data) as GroceryItem;
  } catch (error) {
    console.error('Error creating grocery item with ID:', error);
    throw error;
  }
};

/**
 * Get a grocery item by ID
 */
export const getGroceryItem = async (id: string): Promise<GroceryItem | null> => {
  try {
    return await getDocument(COLLECTION, id) as GroceryItem | null;
  } catch (error) {
    console.error('Error getting grocery item:', error);
    throw error;
  }
};

/**
 * Update a grocery item
 */
export const updateGroceryItem = async (id: string, data: Partial<GroceryItem>): Promise<GroceryItem> => {
  try {
    return await updateDocument(COLLECTION, id, data) as GroceryItem;
  } catch (error) {
    console.error('Error updating grocery item:', error);
    throw error;
  }
};

/**
 * Delete a grocery item
 */
export const deleteGroceryItem = async (id: string): Promise<boolean> => {
  try {
    return await deleteDocument(COLLECTION, id);
  } catch (error) {
    console.error('Error deleting grocery item:', error);
    throw error;
  }
};

/**
 * Get all grocery items
 */
export const getAllGroceryItems = async (): Promise<GroceryItem[]> => {
  try {
    return await getAllDocuments(COLLECTION) as GroceryItem[];
  } catch (error) {
    console.error('Error getting all grocery items:', error);
    throw error;
  }
};

/**
 * Search grocery items by name
 */
export const searchGroceryItems = async (searchText: string): Promise<GroceryItem[]> => {
  try {
    // This is a simple implementation. For more advanced search capabilities, 
    // consider using Firebase extensions like Algolia or ElasticSearch
    const constraints = [
      where('name', '>=', searchText),
      where('name', '<=', searchText + '\uf8ff'),
      orderBy('name'),
      limit(20)
    ];
    
    return await queryDocuments(COLLECTION, constraints) as GroceryItem[];
  } catch (error) {
    console.error('Error searching grocery items:', error);
    throw error;
  }
};

/**
 * Get grocery items by category
 */
export const getGroceryItemsByCategory = async (category: string): Promise<GroceryItem[]> => {
  try {
    const constraints = [
      where('category', '==', category),
      orderBy('name')
    ];
    
    return await queryDocuments(COLLECTION, constraints) as GroceryItem[];
  } catch (error) {
    console.error('Error getting grocery items by category:', error);
    throw error;
  }
};

/**
 * Batch import grocery items (for initializing the library)
 */
export const batchImportGroceryItems = async (items: Omit<GroceryItem, 'id'>[]): Promise<number> => {
  try {
    // For large batch operations, you might want to use batched writes
    // This is a simplified version that creates items one by one
    let count = 0;
    for (const item of items) {
      await createDocument(COLLECTION, item);
      count++;
    }
    return count;
  } catch (error) {
    console.error('Error batch importing grocery items:', error);
    throw error;
  }
};
