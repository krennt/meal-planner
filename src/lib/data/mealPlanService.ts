import { Meal, Ingredient, getMealById } from './meals';
import { generateGroceryListFromMeals } from './grocery/groceryService';

// Types
export type MealPlanEntry = {
  day: string;
  mealId: string;
  mealType: string;
};

export type MealPlanState = {
  [key: string]: { [key: string]: string };
};

// Functions to convert between MealPlanEntry[] and MealPlanState
export const convertToMealPlanState = (entries: MealPlanEntry[]): MealPlanState => {
  return entries.reduce((acc: MealPlanState, entry: MealPlanEntry) => {
    if (!acc[entry.day]) {
      acc[entry.day] = {};
    }
    acc[entry.day][entry.mealType] = entry.mealId;
    return acc;
  }, {} as MealPlanState);
};

export const convertToMealPlanEntries = (state: MealPlanState): MealPlanEntry[] => {
  const entries: MealPlanEntry[] = [];
  
  Object.keys(state).forEach((day: string) => {
    Object.keys(state[day]).forEach((mealType: string) => {
      entries.push({
        day,
        mealType,
        mealId: state[day][mealType]
      });
    });
  });
  
  return entries;
};

// Function to generate grocery list from meal plan
export const generateGroceryList = (mealPlanState: MealPlanState): Ingredient[] => {
  const ingredientMap = new Map<string, Ingredient>();
  
  // Collect all ingredients from the meal plan
  Object.keys(mealPlanState).forEach((day: string) => {
    Object.keys(mealPlanState[day]).forEach((mealType: string) => {
      const mealId = mealPlanState[day][mealType];
      if (mealId) {
        const meal = getMealById(mealId);
        if (meal) {
          meal.ingredients.forEach((ingredient: Ingredient) => {
            // Use ingredient name as the key to avoid duplicates
            if (!ingredientMap.has(ingredient.name)) {
              // If it's the first occurrence, add with count 1
              ingredientMap.set(ingredient.name, { 
                ...ingredient, 
                id: `grocery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                count: 1
              });
            } else {
              // If it already exists, increment the count
              const existingIngredient = ingredientMap.get(ingredient.name)!;
              ingredientMap.set(ingredient.name, {
                ...existingIngredient,
                count: (existingIngredient.count || 1) + 1
              });
            }
          });
        }
      }
    });
  });
  
  const ingredients = Array.from(ingredientMap.values());
  
  // Also update the grocery list using our new service
  generateGroceryListFromMeals(ingredients);
  
  return ingredients;
};
