import { collection, query, where, orderBy, Timestamp, limit, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { 
  createDocument, 
  getDocument, 
  queryDocuments,
  createDocumentWithId
} from '../firestore';
import { 
  GroceryListEvent, 
  GroceryListEventType, 
  ActiveGroceryList, 
  GroceryListItem 
} from '../models';
import { db } from '../config';

// Collection names
const EVENTS_COLLECTION = 'grocery_list_events';
const DERIVED_COLLECTION = 'active_grocery_lists';

/**
 * Create a grocery list event
 */
export const createGroceryListEvent = async (
  userId: string, 
  eventType: GroceryListEventType, 
  data: Partial<GroceryListEvent>
): Promise<GroceryListEvent> => {
  try {
    const eventId = uuidv4();
    const event: Omit<GroceryListEvent, 'id'> = {
      type: eventType,
      userId,
      timestamp: serverTimestamp() as Timestamp,
      ...data
    };
    
    const fullEventPath = `users/${userId}/${EVENTS_COLLECTION}/${eventId}`;
    const createdEvent = await createDocumentWithId(fullEventPath, eventId, event) as GroceryListEvent;
    
    // After creating an event, update the derived view
    await updateDerivedGroceryList(userId);
    
    return createdEvent;
  } catch (error) {
    console.error('Error creating grocery list event:', error);
    throw error;
  }
};

/**
 * Add an item to the grocery list
 */
export const addItemToGroceryList = async (
  userId: string,
  itemId: string | null,
  name: string,
  quantity: string,
  category: string,
  count: number = 1
): Promise<GroceryListEvent> => {
  return createGroceryListEvent(userId, GroceryListEventType.ITEM_ADDED, {
    itemId,
    name,
    quantity,
    category,
    count,
    purchased: false
  });
};

/**
 * Remove an item from the grocery list
 */
export const removeItemFromGroceryList = async (
  userId: string,
  itemId: string
): Promise<GroceryListEvent> => {
  return createGroceryListEvent(userId, GroceryListEventType.ITEM_REMOVED, {
    itemId
  });
};

/**
 * Update an item in the grocery list (e.g., change quantity or count)
 */
export const updateItemInGroceryList = async (
  userId: string,
  itemId: string,
  updates: Partial<GroceryListItem>
): Promise<GroceryListEvent> => {
  return createGroceryListEvent(userId, GroceryListEventType.ITEM_UPDATED, {
    itemId,
    ...updates
  });
};

/**
 * Mark an item as purchased or not purchased
 */
export const markItemPurchased = async (
  userId: string,
  itemId: string,
  purchased: boolean
): Promise<GroceryListEvent> => {
  const eventType = purchased 
    ? GroceryListEventType.MARKED_PURCHASED 
    : GroceryListEventType.UNMARKED_PURCHASED;
  
  return createGroceryListEvent(userId, eventType, {
    itemId,
    purchased
  });
};

/**
 * Clear the grocery list
 */
export const clearGroceryList = async (userId: string): Promise<GroceryListEvent> => {
  return createGroceryListEvent(userId, GroceryListEventType.LIST_CLEARED, {});
};

/**
 * Get grocery list events for a user
 */
export const getGroceryListEvents = async (
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<GroceryListEvent[]> => {
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
    return await queryDocuments(fullPath, constraints) as GroceryListEvent[];
  } catch (error) {
    console.error('Error getting grocery list events:', error);
    throw error;
  }
};

/**
 * Update the derived grocery list view based on events
 * This would typically be done by a Cloud Function, but we're implementing it client-side for now
 */
export const updateDerivedGroceryList = async (userId: string): Promise<ActiveGroceryList> => {
  try {
    // Get all events for this user, ordered by timestamp
    const events = await getGroceryListEvents(userId);
    
    // Map to store current grocery list items by ID
    const groceryListItemsMap = new Map<string, GroceryListItem>();
    
    // Process events in order to build the current state
    for (const event of events) {
      switch (event.type) {
        case GroceryListEventType.ITEM_ADDED:
          if (event.itemId) {
            const existingItem = groceryListItemsMap.get(event.itemId);
            
            if (existingItem) {
              // If item already exists, increment count
              existingItem.count = (existingItem.count || 0) + (event.count || 1);
              groceryListItemsMap.set(event.itemId, existingItem);
            } else {
              // Add new item
              groceryListItemsMap.set(event.itemId, {
                id: event.itemId,
                itemId: event.itemId,
                name: event.name || '',
                quantity: event.quantity || '',
                category: event.category || '',
                count: event.count || 1,
                purchased: event.purchased || false,
                details: event.data?.details
              });
            }
          }
          break;
          
        case GroceryListEventType.ITEM_REMOVED:
          if (event.itemId) {
            groceryListItemsMap.delete(event.itemId);
          }
          break;
          
        case GroceryListEventType.ITEM_UPDATED:
          if (event.itemId) {
            const existingItem = groceryListItemsMap.get(event.itemId);
            
            if (existingItem) {
              // Update properties
              groceryListItemsMap.set(event.itemId, {
                ...existingItem,
                quantity: event.quantity || existingItem.quantity,
                count: event.count || existingItem.count,
                purchased: event.purchased !== undefined ? event.purchased : existingItem.purchased
              });
            }
          }
          break;
          
        case GroceryListEventType.MARKED_PURCHASED:
          if (event.itemId) {
            const existingItem = groceryListItemsMap.get(event.itemId);
            
            if (existingItem) {
              existingItem.purchased = true;
              groceryListItemsMap.set(event.itemId, existingItem);
            }
          }
          break;
          
        case GroceryListEventType.UNMARKED_PURCHASED:
          if (event.itemId) {
            const existingItem = groceryListItemsMap.get(event.itemId);
            
            if (existingItem) {
              existingItem.purchased = false;
              groceryListItemsMap.set(event.itemId, existingItem);
            }
          }
          break;
          
        case GroceryListEventType.LIST_CLEARED:
          // Clear all items
          groceryListItemsMap.clear();
          break;
          
        default:
          break;
      }
    }
    
    // Create the derived view
    const activeGroceryList: ActiveGroceryList = {
      userId,
      items: Array.from(groceryListItemsMap.values()),
      lastUpdated: Timestamp.now()
    };
    
    // Save the derived view
    const fullPath = `users/${userId}/${DERIVED_COLLECTION}/current`;
    await createDocumentWithId(fullPath, 'current', activeGroceryList);
    
    return activeGroceryList;
  } catch (error) {
    console.error('Error updating derived grocery list:', error);
    throw error;
  }
};

/**
 * Get the current active grocery list
 */
export const getActiveGroceryList = async (userId: string): Promise<ActiveGroceryList> => {
  try {
    const fullPath = `users/${userId}/${DERIVED_COLLECTION}/current`;
    const groceryList = await getDocument(fullPath, 'current') as ActiveGroceryList | null;
    
    if (!groceryList) {
      // If no grocery list exists, create an empty one
      return updateDerivedGroceryList(userId);
    }
    
    return groceryList;
  } catch (error) {
    console.error('Error getting active grocery list:', error);
    throw error;
  }
};

/**
 * Generate a grocery list from a meal plan
 * This would typically be done by a Cloud Function
 */
export const generateGroceryListFromMealPlan = async (userId: string): Promise<ActiveGroceryList> => {
  try {
    // This function would get the active meal plan, then get all referenced meals,
    // extract their ingredients, and create ADD events for each ingredient
    // For now, this is a placeholder that would be implemented in a Cloud Function
    
    // Return the current grocery list
    return getActiveGroceryList(userId);
  } catch (error) {
    console.error('Error generating grocery list from meal plan:', error);
    throw error;
  }
};
