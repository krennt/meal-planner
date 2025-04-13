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
import { Meal } from '../models';

// Collection name
const COLLECTION = 'meals';

/**
 * Create a new meal
 */
export const createMeal = async (data: Omit<Meal, 'id'>): Promise<Meal> => {
  try {
    return await createDocument(COLLECTION, data) as Meal;
  } catch (error) {
    console.error('Error creating meal:', error);
    throw error;
  }
};

/**
 * Create a meal with a specific ID
 */
export const createMealWithId = async (id: string, data: Omit<Meal, 'id'>): Promise<Meal> => {
  try {
    return await createDocumentWithId(COLLECTION, id, data) as Meal;
  } catch (error) {
    console.error('Error creating meal with ID:', error);
    throw error;
  }
};

/**
 * Get a meal by ID
 */
export const getMeal = async (id: string): Promise<Meal | null> => {
  try {
    return await getDocument(COLLECTION, id) as Meal | null;
  } catch (error) {
    console.error('Error getting meal:', error);
    throw error;
  }
};

/**
 * Update a meal
 */
export const updateMeal = async (id: string, data: Partial<Meal>): Promise<Meal> => {
  try {
    return await updateDocument(COLLECTION, id, data) as Meal;
  } catch (error) {
    console.error('Error updating meal:', error);
    throw error;
  }
};

/**
 * Delete a meal
 */
export const deleteMeal = async (id: string): Promise<boolean> => {
  try {
    return await deleteDocument(COLLECTION, id);
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};

/**
 * Get all meals
 */
export const getAllMeals = async (): Promise<Meal[]> => {
  try {
    return await getAllDocuments(COLLECTION) as Meal[];
  } catch (error) {
    console.error('Error getting all meals:', error);
    throw error;
  }
};

/**
 * Search meals by name
 */
export const searchMeals = async (searchText: string): Promise<Meal[]> => {
  try {
    const constraints = [
      where('name', '>=', searchText),
      where('name', '<=', searchText + '\uf8ff'),
      orderBy('name'),
      limit(20)
    ];
    
    return await queryDocuments(COLLECTION, constraints) as Meal[];
  } catch (error) {
    console.error('Error searching meals:', error);
    throw error;
  }
};

/**
 * Get meals by cuisine
 */
export const getMealsByCuisine = async (cuisine: string): Promise<Meal[]> => {
  try {
    const constraints = [
      where('cuisine', '==', cuisine),
      orderBy('name')
    ];
    
    return await queryDocuments(COLLECTION, constraints) as Meal[];
  } catch (error) {
    console.error('Error getting meals by cuisine:', error);
    throw error;
  }
};

/**
 * Get meal options (for dropdown menus)
 */
export const getMealOptions = async (): Promise<Array<{ value: string, label: string }>> => {
  try {
    const meals = await getAllMeals();
    return meals.map(meal => ({
      value: meal.id,
      label: meal.name
    }));
  } catch (error) {
    console.error('Error getting meal options:', error);
    throw error;
  }
};
