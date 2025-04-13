# Firebase Backend Implementation

This document describes the implementation of the Firebase backend for the Meal Planner application.

## Overview

The application uses Firebase services for backend functionality:

1. **Firebase Authentication** - User authentication
2. **Cloud Firestore** - Database for storing data
3. **Firebase Cloud Functions** - Serverless functions for event processing

## Data Model

### Collections Structure

The Firestore database is organized with the following collections:

```
firestore/
├── grocery_items/                  # Library of grocery items
│   └── {item_id}/
│       ├── name: string
│       ├── category: string
│       ├── defaultQuantity: string
│       └── details: string (optional)
│
├── meals/                          # Library of meals
│   └── {meal_id}/
│       ├── name: string
│       ├── description: string
│       ├── cuisine: string
│       ├── imageUrl: string (optional)
│       └── ingredients: array
│           └── {
│               ├── itemId: string (reference to grocery_item)
│               ├── quantity: string
│               └── notes: string (optional)
│             }
│
├── users/                          # User-specific data
│   └── {user_id}/
│       ├── meal_plan_events/       # Event sourcing for meal plans
│       │   └── {event_id}/
│       │       ├── type: string
│       │       ├── timestamp: timestamp
│       │       ├── day: string
│       │       ├── mealType: string
│       │       ├── mealId: string
│       │       └── data: map
│       │
│       ├── grocery_list_events/    # Event sourcing for grocery lists
│       │   └── {event_id}/
│       │       ├── type: string
│       │       ├── timestamp: timestamp
│       │       ├── itemId: string
│       │       ├── name: string
│       │       ├── quantity: string
│       │       ├── category: string
│       │       └── data: map
│       │
│       ├── active_meal_plans/      # Derived view of meal plans
│       │   └── current/
│       │       ├── userId: string
│       │       ├── weekStartDate: timestamp
│       │       ├── items: array
│       │       └── lastUpdated: timestamp
│       │
│       └── active_grocery_lists/   # Derived view of grocery lists
│           └── current/
│               ├── userId: string
│               ├── items: array
│               └── lastUpdated: timestamp
```

## Event Sourcing Model

The application uses an event sourcing pattern for meal plans and grocery lists:

1. **Events are immutable** - Each change is recorded as a new event
2. **Derived views** - Current state is calculated from the event history
3. **Temporal queries** - Can reconstruct state at any point in time

### Meal Plan Events

Event types:
- `MEAL_ADDED` - A meal was added to the plan
- `MEAL_REMOVED` - A meal was removed from the plan
- `MEAL_PLAN_CLEARED` - The entire meal plan was cleared

### Grocery List Events

Event types:
- `ITEM_ADDED` - An item was added to the list
- `ITEM_REMOVED` - An item was removed from the list
- `ITEM_UPDATED` - An item was updated (quantity, count, etc.)
- `MARKED_PURCHASED` - An item was marked as purchased
- `UNMARKED_PURCHASED` - An item was unmarked as purchased
- `LIST_CLEARED` - The entire grocery list was cleared

## Cloud Functions

Firebase Cloud Functions are used to:

1. Process events and update derived views
2. Generate grocery lists from meal plans

### Functions Implementation

The functions are defined in `src/lib/firebase/functions/index.ts` but would need to be deployed separately to Firebase Cloud Functions.

## Client Implementation

The client interacts with the Firebase backend through several service modules:

- `groceryItemService.ts` - CRUD operations for grocery items
- `mealService.ts` - CRUD operations for meals
- `mealPlanEventService.ts` - Event-based operations for meal plans
- `groceryListEventService.ts` - Event-based operations for grocery lists

All Firebase-related functionality is wrapped in a React context: `DataContext`

## Migration

A migration utility is provided to move data from the previous localStorage-based implementation to Firestore:

- `migration.ts` - Functions to migrate data
- `/api/initialize-data` - API endpoint to trigger migration

## Deployment

To fully implement this backend:

1. Configure Firebase project in the Firebase console
2. Deploy Cloud Functions to Firebase
3. Set up security rules for Firestore collections
4. Update environment variables with Firebase credentials

## Local Development

For local development:
- The Firebase Emulator Suite can be used to test Firestore and Cloud Functions
- The application can still use localStorage as a fallback when not connected to Firebase
