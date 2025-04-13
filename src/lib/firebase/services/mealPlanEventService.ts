import { collection, query, where, orderBy, Timestamp, limit, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { 
  createDocument, 
  getDocument, 
  queryDocuments,
  createDocumentWithId
} from '../firestore';
import { 
  MealPlanEvent, 
  MealPlanEventType, 
  ActiveMealPlan, 
  MealPlanItem 
} from '../models';
import { db } from '../config';

// Collection names
const EVENTS_COLLECTION = 'meal_plan_events';
const DERIVED_COLLECTION = 'active_meal_plans';

/**
 * Create a meal plan event
 */
export const createMealPlanEvent = async (
  userId: string, 
  eventType: MealPlanEventType, 
  data: Partial<MealPlanEvent>
): Promise<MealPlanEvent> => {
  try {
    const eventId = uuidv4();
    const event: Omit<MealPlanEvent, 'id'> = {
      type: eventType,
      userId,
      timestamp: serverTimestamp() as Timestamp,
      ...data
    };
    
    const fullEventPath = `users/${userId}/${EVENTS_COLLECTION}/${eventId}`;
    const createdEvent = await createDocumentWithId(fullEventPath, eventId, event) as MealPlanEvent;
    
    // After creating an event, update the derived view
    await updateDerivedMealPlan(userId);
    
    return createdEvent;
  } catch (error) {
    console.error('Error creating meal plan event:', error);
    throw error;
  }
};

/**
 * Add a meal to the meal plan
 */
export const addMealToMealPlan = async (
  userId: string,
  day: string,
  mealType: string,
  mealId: string
): Promise<MealPlanEvent> => {
  return createMealPlanEvent(userId, MealPlanEventType.MEAL_ADDED, {
    day,
    mealType,
    mealId
  });
};

/**
 * Remove a meal from the meal plan
 */
export const removeMealFromMealPlan = async (
  userId: string,
  day: string,
  mealType: string
): Promise<MealPlanEvent> => {
  return createMealPlanEvent(userId, MealPlanEventType.MEAL_REMOVED, {
    day,
    mealType
  });
};

/**
 * Clear the meal plan
 */
export const clearMealPlan = async (userId: string): Promise<MealPlanEvent> => {
  return createMealPlanEvent(userId, MealPlanEventType.MEAL_PLAN_CLEARED, {});
};

/**
 * Get meal plan events for a user
 */
export const getMealPlanEvents = async (
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<MealPlanEvent[]> => {
  try {
    let constraints = [
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    ];
    
    if (startDate) {
      constraints.push(where('timestamp', '>=', Timestamp.fromDate(startDate)));
    }
    
    if (endDate) {
      constraints.push(where('timestamp', '<=', Timestamp.fromDate(endDate)));
    }
    
    const fullPath = `users/${userId}/${EVENTS_COLLECTION}`;
    return await queryDocuments(fullPath, constraints) as MealPlanEvent[];
  } catch (error) {
    console.error('Error getting meal plan events:', error);
    throw error;
  }
};

/**
 * Update the derived meal plan view based on events
 * This would typically be done by a Cloud Function, but we're implementing it client-side for now
 */
export const updateDerivedMealPlan = async (userId: string): Promise<ActiveMealPlan> => {
  try {
    // Get all events for this user, ordered by timestamp
    const events = await getMealPlanEvents(userId);
    
    // Start with an empty meal plan
    const mealPlanItems: MealPlanItem[] = [];
    
    // Process events in order to build the current state
    for (const event of events) {
      switch (event.type) {
        case MealPlanEventType.MEAL_ADDED:
          // Remove any existing meal for this day/mealType
          const existingIndex = mealPlanItems.findIndex(
            item => item.day === event.day && item.mealType === event.mealType
          );
          
          if (existingIndex >= 0) {
            mealPlanItems.splice(existingIndex, 1);
          }
          
          // Add the new meal
          if (event.mealId) {
            mealPlanItems.push({
              day: event.day!,
              mealType: event.mealType!,
              mealId: event.mealId
            });
          }
          break;
          
        case MealPlanEventType.MEAL_REMOVED:
          // Remove the meal
          const index = mealPlanItems.findIndex(
            item => item.day === event.day && item.mealType === event.mealType
          );
          
          if (index >= 0) {
            mealPlanItems.splice(index, 1);
          }
          break;
          
        case MealPlanEventType.MEAL_PLAN_CLEARED:
          // Clear all meals
          mealPlanItems.length = 0;
          break;
          
        default:
          break;
      }
    }
    
    // Create the derived view
    const activeMealPlan: ActiveMealPlan = {
      userId,
      weekStartDate: Timestamp.now(), // This should be calculated based on the current week
      items: mealPlanItems,
      lastUpdated: Timestamp.now()
    };
    
    // Save the derived view
    const fullPath = `users/${userId}/${DERIVED_COLLECTION}/current`;
    await createDocumentWithId(fullPath, 'current', activeMealPlan);
    
    return activeMealPlan;
  } catch (error) {
    console.error('Error updating derived meal plan:', error);
    throw error;
  }
};

/**
 * Get the current active meal plan
 */
export const getActiveMealPlan = async (userId: string): Promise<ActiveMealPlan | null> => {
  try {
    const fullPath = `users/${userId}/${DERIVED_COLLECTION}/current`;
    const mealPlan = await getDocument(fullPath, 'current') as ActiveMealPlan | null;
    
    if (!mealPlan) {
      // If no meal plan exists, create an empty one
      return updateDerivedMealPlan(userId);
    }
    
    return mealPlan;
  } catch (error) {
    console.error('Error getting active meal plan:', error);
    throw error;
  }
};
