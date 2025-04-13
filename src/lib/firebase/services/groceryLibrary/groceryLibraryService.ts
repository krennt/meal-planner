import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { 
  createDocument, 
  createDocumentWithId, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  getAllDocuments, 
  queryDocuments 
} from '../../firestore';
import { Ingredient } from '@/lib/data/meals';

// Collection name - now a top-level collection for all users
const COLLECTION = 'grocery_library';

/**
 * Create a new grocery library item
 */
export const createGroceryLibraryItem = async (
  item: Omit<Ingredient, 'id'>
): Promise<Ingredient> => {
  try {
    return await createDocument(COLLECTION, item) as Ingredient;
  } catch (error) {
    console.error('Error creating grocery library item:', error);
    throw error;
  }
};

/**
 * Create a grocery library item with a specific ID
 */
export const createGroceryLibraryItemWithId = async (
  id: string, 
  item: Omit<Ingredient, 'id'>
): Promise<Ingredient> => {
  try {
    return await createDocumentWithId(COLLECTION, id, item) as Ingredient;
  } catch (error) {
    console.error('Error creating grocery library item with ID:', error);
    throw error;
  }
};

/**
 * Get a grocery library item by ID
 */
export const getGroceryLibraryItem = async (
  id: string
): Promise<Ingredient | null> => {
  try {
    return await getDocument(COLLECTION, id) as Ingredient | null;
  } catch (error) {
    console.error('Error getting grocery library item:', error);
    throw error;
  }
};

/**
 * Update a grocery library item
 */
export const updateGroceryLibraryItem = async (
  id: string, 
  updates: Partial<Ingredient>
): Promise<Ingredient> => {
  try {
    return await updateDocument(COLLECTION, id, updates) as Ingredient;
  } catch (error) {
    console.error('Error updating grocery library item:', error);
    throw error;
  }
};

/**
 * Delete a grocery library item
 */
export const deleteGroceryLibraryItem = async (
  id: string
): Promise<boolean> => {
  try {
    return await deleteDocument(COLLECTION, id);
  } catch (error) {
    console.error('Error deleting grocery library item:', error);
    throw error;
  }
};

/**
 * Get all grocery library items
 */
export const getAllGroceryLibraryItems = async (): Promise<Ingredient[]> => {
  try {
    console.log('Getting all grocery library items from collection:', COLLECTION);
    const items = await getAllDocuments(COLLECTION) as Ingredient[];
    console.log(`Retrieved ${items.length} items from grocery library`);
    return items;
  } catch (error) {
    console.error('Error getting all grocery library items:', error);
    throw error;
  }
};

/**
 * Search grocery library items by name
 */
export const searchGroceryLibraryItems = async (
  searchText: string
): Promise<Ingredient[]> => {
  try {
    // This is a simple implementation. For more advanced search capabilities, 
    // consider using Firebase extensions like Algolia or ElasticSearch
    const constraints = [
      where('name', '>=', searchText),
      where('name', '<=', searchText + '\uf8ff'),
      orderBy('name'),
      limit(20)
    ];
    
    return await queryDocuments(COLLECTION, constraints) as Ingredient[];
  } catch (error) {
    console.error('Error searching grocery library items:', error);
    throw error;
  }
};

/**
 * Get grocery library items by category
 */
export const getGroceryLibraryItemsByCategory = async (
  category: string
): Promise<Ingredient[]> => {
  try {
    const constraints = [
      where('category', '==', category),
      orderBy('name')
    ];
    
    return await queryDocuments(COLLECTION, constraints) as Ingredient[];
  } catch (error) {
    console.error('Error getting grocery library items by category:', error);
    throw error;
  }
};

/**
 * Batch import grocery library items
 */
export const batchImportGroceryLibraryItems = async (
  items: Omit<Ingredient, 'id'>[]
): Promise<number> => {
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
    console.error('Error batch importing grocery library items:', error);
    throw error;
  }
};

/**
 * Batch import grocery library items with specific IDs
 */
export const batchImportGroceryLibraryItemsWithIds = async (
  items: Ingredient[]
): Promise<number> => {
  try {
    console.log(`Attempting to import ${items.length} items to shared grocery library...`);
    
    // For large batch operations, you might want to use batched writes
    // This is a simplified version that creates items one by one
    let count = 0;
    for (const item of items) {
      const { id, ...data } = item;
      console.log(`Creating item ${id}: ${data.name}`);
      await createDocumentWithId(COLLECTION, id, data);
      count++;
    }
    
    console.log(`Successfully imported ${count} items to shared grocery library`);
    return count;
  } catch (error) {
    console.error('Error batch importing grocery library items with IDs:', error);
    throw error;
  }
};
