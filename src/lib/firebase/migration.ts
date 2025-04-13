import { GroceryItem, Meal, MealIngredient, MealPlanEventType, GroceryListEventType } from './models';
import { createGroceryItem } from './services/groceryItemService';
import { createMeal } from './services/mealService';
import { createMealPlanEvent } from './services/mealPlanEventService';
import { createGroceryListEvent } from './services/groceryListEventService';

// Local storage keys (from the old implementation)
const OLD_STORAGE_KEYS = {
  GROCERY_LIBRARY: 'meal-planner-grocery-library',
  GROCERY_LIST: 'meal-planner-grocery-list',
  MEAL_PLAN: 'meal-planner-meal-plan'
};

/**
 * Migrate grocery library from localStorage to Firestore
 */
export const migrateGroceryLibrary = async (userId: string): Promise<number> => {
  try {
    // Get the local storage data
    const stored = localStorage.getItem(OLD_STORAGE_KEYS.GROCERY_LIBRARY);
    
    if (!stored) {
      console.log('No grocery library found in localStorage');
      return 0;
    }
    
    const libraryItems = JSON.parse(stored);
    let count = 0;
    
    // Create each item in Firestore
    for (const oldItem of libraryItems) {
      const newItem: Omit<GroceryItem, 'id'> = {
        name: oldItem.name,
        category: oldItem.category,
        defaultQuantity: oldItem.quantity,
        details: oldItem.details
      };
      
      await createGroceryItem(newItem);
      count++;
    }
    
    console.log(`Successfully migrated ${count} grocery library items to Firestore`);
    return count;
  } catch (error) {
    console.error('Error migrating grocery library:', error);
    throw error;
  }
};

/**
 * Migrate meals from mock data to Firestore
 */
export const migrateMeals = async (userId: string, mockMeals: any[]): Promise<number> => {
  try {
    let count = 0;
    
    // Get all grocery items from Firestore to map old ingredient IDs to new item IDs
    // This is a simplified approach - in a real migration, you'd need a more robust mapping
    const groceryItemsResponsePromise = fetch('/api/grocery-items');
    
    // Create a map of old ingredient names to new item IDs
    const ingredientMap = new Map<string, string>();
    
    // Create each meal in Firestore
    for (const oldMeal of mockMeals) {
      // Convert old ingredients to new format
      const ingredients: MealIngredient[] = oldMeal.ingredients.map((oldIngredient: any) => {
        const itemId = ingredientMap.get(oldIngredient.name) || oldIngredient.id;
        
        return {
          itemId,
          quantity: oldIngredient.quantity,
          notes: oldIngredient.details
        };
      });
      
      const newMeal: Omit<Meal, 'id'> = {
        name: oldMeal.name,
        description: oldMeal.description,
        cuisine: oldMeal.cuisine,
        imageUrl: oldMeal.imageUrl,
        ingredients
      };
      
      await createMeal(newMeal);
      count++;
    }
    
    console.log(`Successfully migrated ${count} meals to Firestore`);
    return count;
  } catch (error) {
    console.error('Error migrating meals:', error);
    throw error;
  }
};

/**
 * Migrate meal plan from localStorage to Firestore events
 */
export const migrateMealPlan = async (userId: string): Promise<number> => {
  try {
    // Get the local storage data
    const stored = localStorage.getItem(OLD_STORAGE_KEYS.MEAL_PLAN);
    
    if (!stored) {
      console.log('No meal plan found in localStorage');
      return 0;
    }
    
    const mealPlan = JSON.parse(stored);
    let count = 0;
    
    // Clear any existing meal plan
    await createMealPlanEvent(userId, MealPlanEventType.MEAL_PLAN_CLEARED, {});
    
    // Create an event for each meal in the plan
    for (const day in mealPlan) {
      for (const mealType in mealPlan[day]) {
        const mealId = mealPlan[day][mealType];
        
        if (mealId) {
          await createMealPlanEvent(userId, MealPlanEventType.MEAL_ADDED, {
            day,
            mealType,
            mealId
          });
          
          count++;
        }
      }
    }
    
    console.log(`Successfully migrated meal plan with ${count} meals to Firestore`);
    return count;
  } catch (error) {
    console.error('Error migrating meal plan:', error);
    throw error;
  }
};

/**
 * Migrate grocery list from localStorage to Firestore events
 */
export const migrateGroceryList = async (userId: string): Promise<number> => {
  try {
    // Get the local storage data
    const stored = localStorage.getItem(OLD_STORAGE_KEYS.GROCERY_LIST);
    
    if (!stored) {
      console.log('No grocery list found in localStorage');
      return 0;
    }
    
    const groceryList = JSON.parse(stored);
    let count = 0;
    
    // Clear any existing grocery list
    await createGroceryListEvent(userId, GroceryListEventType.LIST_CLEARED, {});
    
    // Create an event for each item in the list
    for (const oldItem of groceryList) {
      await createGroceryListEvent(userId, GroceryListEventType.ITEM_ADDED, {
        itemId: oldItem.id,
        name: oldItem.name,
        quantity: oldItem.quantity,
        category: oldItem.category,
        count: oldItem.count || 1,
        purchased: oldItem.isInCart || false,
        data: {
          details: oldItem.details
        }
      });
      
      count++;
    }
    
    console.log(`Successfully migrated grocery list with ${count} items to Firestore`);
    return count;
  } catch (error) {
    console.error('Error migrating grocery list:', error);
    throw error;
  }
};

/**
 * Migrate all data from localStorage to Firestore
 */
export const migrateAllData = async (userId: string, mockMeals: any[]): Promise<void> => {
  try {
    // Migrate in sequence (to avoid potential race conditions)
    await migrateGroceryLibrary(userId);
    await migrateMeals(userId, mockMeals);
    await migrateMealPlan(userId);
    await migrateGroceryList(userId);
    
    console.log('Successfully migrated all data to Firestore');
  } catch (error) {
    console.error('Error migrating all data:', error);
    throw error;
  }
};
