import { Timestamp } from 'firebase/firestore';

// Base types
export interface BaseModel {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Grocery item model
export interface GroceryItem extends BaseModel {
  name: string;
  category: string;
  defaultQuantity: string;
  details?: string;
}

// Ingredient in a meal
export interface MealIngredient {
  itemId: string;
  quantity: string;
  notes?: string;
}

// Meal model
export interface Meal extends BaseModel {
  name: string;
  description: string;
  cuisine: string;
  imageUrl?: string;
  ingredients: MealIngredient[];
}

// Event types
export enum MealPlanEventType {
  MEAL_ADDED = 'MEAL_ADDED',
  MEAL_REMOVED = 'MEAL_REMOVED',
  MEAL_PLAN_CREATED = 'MEAL_PLAN_CREATED',
  MEAL_PLAN_CLEARED = 'MEAL_PLAN_CLEARED',
}

export enum GroceryListEventType {
  ITEM_ADDED = 'ITEM_ADDED',
  ITEM_REMOVED = 'ITEM_REMOVED',
  ITEM_UPDATED = 'ITEM_UPDATED',
  MARKED_PURCHASED = 'MARKED_PURCHASED',
  UNMARKED_PURCHASED = 'UNMARKED_PURCHASED',
  LIST_CLEARED = 'LIST_CLEARED',
}

// Base event
export interface BaseEvent {
  id: string;
  type: string;
  timestamp: Timestamp;
  userId: string;
}

// Meal plan event
export interface MealPlanEvent extends BaseEvent {
  type: MealPlanEventType;
  day: string;
  mealType: string;
  mealId?: string;
  data?: Record<string, any>;
}

// Grocery list event
export interface GroceryListEvent extends BaseEvent {
  type: GroceryListEventType;
  itemId?: string;  // Reference to grocery item or null for custom items
  name?: string;    // Used for custom items not in the library
  quantity?: string;
  count?: number;
  category?: string;
  purchased?: boolean;
  data?: Record<string, any>;
}

// Derived view models
export interface MealPlanItem {
  day: string;
  mealType: string;
  mealId: string;
}

export interface ActiveMealPlan {
  userId: string;
  weekStartDate: Timestamp;
  items: MealPlanItem[];
  lastUpdated: Timestamp;
}

export interface GroceryListItem {
  id: string;
  itemId?: string;  // Reference to grocery item or null for custom items
  name: string;
  quantity: string;
  category: string;
  count: number;
  purchased: boolean;
  details?: string;
}

export interface ActiveGroceryList {
  userId: string;
  items: GroceryListItem[];
  lastUpdated: Timestamp;
}
