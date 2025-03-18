import { Ingredient } from '../meals';

// Initial starter set of grocery items
export const initialGroceryLibrary: Ingredient[] = [
  // Produce
  { id: "lib-prod-1", name: "Onion", quantity: "1 medium", category: "Produce" },
  { id: "lib-prod-2", name: "Garlic", quantity: "1 bulb", category: "Produce" },
  { id: "lib-prod-3", name: "Tomatoes", quantity: "1 lb", category: "Produce" },
  { id: "lib-prod-4", name: "Lettuce", quantity: "1 head", category: "Produce" },
  { id: "lib-prod-5", name: "Carrots", quantity: "1 lb", category: "Produce" },
  { id: "lib-prod-6", name: "Bell Peppers", quantity: "1", category: "Produce" },
  { id: "lib-prod-7", name: "Potatoes", quantity: "1 lb", category: "Produce" },
  { id: "lib-prod-8", name: "Broccoli", quantity: "1 head", category: "Produce" },
  { id: "lib-prod-9", name: "Mushrooms", quantity: "8 oz", category: "Produce" },
  { id: "lib-prod-10", name: "Avocado", quantity: "1", category: "Produce" },
  { id: "lib-prod-11", name: "Lemon", quantity: "1", category: "Produce" },
  { id: "lib-prod-12", name: "Lime", quantity: "1", category: "Produce" },
  { id: "lib-prod-13", name: "Ginger", quantity: "1 inch piece", category: "Produce" },
  { id: "lib-prod-14", name: "Cilantro", quantity: "1 bunch", category: "Produce" },
  { id: "lib-prod-15", name: "Fresh Dill", quantity: "1 bunch", category: "Produce" },
  { id: "lib-prod-16", name: "Rosemary", quantity: "1 sprig", category: "Produce" },
  { id: "lib-prod-17", name: "Thyme", quantity: "1 sprig", category: "Produce" },
  { id: "lib-prod-18", name: "Basil", quantity: "1 bunch", category: "Produce" },
  
  // Meat
  { id: "lib-meat-1", name: "Ground Beef", quantity: "1 lb", category: "Meat" },
  { id: "lib-meat-2", name: "Chicken Breast", quantity: "1 lb", category: "Meat" },
  { id: "lib-meat-3", name: "Chicken Thighs", quantity: "1 lb", category: "Meat" },
  { id: "lib-meat-4", name: "Pork Chops", quantity: "1 lb", category: "Meat" },
  { id: "lib-meat-5", name: "Bacon", quantity: "1 package", category: "Meat" },
  { id: "lib-meat-6", name: "Beef Roast", quantity: "3 lb", category: "Meat" },
  { id: "lib-meat-7", name: "Beef Sirloin", quantity: "1 lb", category: "Meat" },
  { id: "lib-meat-8", name: "Pepperoni", quantity: "4 oz", category: "Meat" },
  
  // Seafood
  { id: "lib-seafood-1", name: "Salmon Fillet", quantity: "1 lb", category: "Seafood" },
  { id: "lib-seafood-2", name: "Shrimp", quantity: "1 lb", category: "Seafood" },
  { id: "lib-seafood-3", name: "Cod Fillet", quantity: "1 lb", category: "Seafood" },
  { id: "lib-seafood-4", name: "Tuna Steak", quantity: "1 lb", category: "Seafood" },
  
  // Dairy
  { id: "lib-dairy-1", name: "Milk", quantity: "1 gallon", category: "Dairy" },
  { id: "lib-dairy-2", name: "Eggs", quantity: "1 dozen", category: "Dairy" },
  { id: "lib-dairy-3", name: "Butter", quantity: "1 lb", category: "Dairy" },
  { id: "lib-dairy-4", name: "Cheddar Cheese", quantity: "8 oz", category: "Dairy" },
  { id: "lib-dairy-5", name: "Mozzarella Cheese", quantity: "8 oz", category: "Dairy" },
  { id: "lib-dairy-6", name: "Parmesan Cheese", quantity: "4 oz", category: "Dairy" },
  { id: "lib-dairy-7", name: "Greek Yogurt", quantity: "16 oz", category: "Dairy" },
  { id: "lib-dairy-8", name: "Sour Cream", quantity: "8 oz", category: "Dairy" },
  
  // Bakery
  { id: "lib-bakery-1", name: "Bread", quantity: "1 loaf", category: "Bakery" },
  { id: "lib-bakery-2", name: "Burger Buns", quantity: "8 pack", category: "Bakery" },
  { id: "lib-bakery-3", name: "Hot Dog Buns", quantity: "8 pack", category: "Bakery" },
  { id: "lib-bakery-4", name: "Pizza Dough", quantity: "1 lb", category: "Bakery" },
  { id: "lib-bakery-5", name: "Tortillas", quantity: "10 pack", category: "Bakery" },
  
  // Grains
  { id: "lib-grains-1", name: "Rice", quantity: "1 lb", category: "Grains" },
  { id: "lib-grains-2", name: "Pasta", quantity: "1 lb", category: "Grains" },
  { id: "lib-grains-3", name: "Spaghetti", quantity: "1 lb", category: "Grains" },
  { id: "lib-grains-4", name: "Quinoa", quantity: "1 lb", category: "Grains" },
  { id: "lib-grains-5", name: "Oats", quantity: "1 lb", category: "Grains" },
  
  // Pantry
  { id: "lib-pantry-1", name: "Olive Oil", quantity: "16 oz", category: "Pantry" },
  { id: "lib-pantry-2", name: "Vegetable Oil", quantity: "32 oz", category: "Pantry" },
  { id: "lib-pantry-3", name: "Soy Sauce", quantity: "10 oz", category: "Pantry" },
  { id: "lib-pantry-4", name: "Salt", quantity: "26 oz", category: "Pantry" },
  { id: "lib-pantry-5", name: "Black Pepper", quantity: "4 oz", category: "Pantry" },
  { id: "lib-pantry-6", name: "Sugar", quantity: "4 lb", category: "Pantry" },
  { id: "lib-pantry-7", name: "Flour", quantity: "5 lb", category: "Pantry" },
  { id: "lib-pantry-8", name: "Canned Tomatoes", quantity: "28 oz", category: "Pantry" },
  { id: "lib-pantry-9", name: "Tomato Paste", quantity: "6 oz", category: "Pantry" },
  { id: "lib-pantry-10", name: "Chicken Broth", quantity: "32 oz", category: "Pantry" },
  { id: "lib-pantry-11", name: "Beef Broth", quantity: "32 oz", category: "Pantry" },
  { id: "lib-pantry-12", name: "Black Beans", quantity: "15 oz", category: "Pantry" },
  { id: "lib-pantry-13", name: "Kidney Beans", quantity: "15 oz", category: "Pantry" },
  { id: "lib-pantry-14", name: "Taco Shells", quantity: "12 pack", category: "Pantry" },
  { id: "lib-pantry-15", name: "Taco Seasoning", quantity: "1 packet", category: "Pantry" },
  { id: "lib-pantry-16", name: "Curry Powder", quantity: "2 oz", category: "Pantry" },
  { id: "lib-pantry-17", name: "Coconut Milk", quantity: "13.5 oz", category: "Pantry" },
  { id: "lib-pantry-18", name: "Peanut Butter", quantity: "16 oz", category: "Pantry" },
  { id: "lib-pantry-19", name: "Honey", quantity: "12 oz", category: "Pantry" },
  { id: "lib-pantry-20", name: "Pasta Sauce", quantity: "24 oz", category: "Pantry" }
];
