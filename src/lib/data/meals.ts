export type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  category: string;
  count?: number; // Number of this item
  details?: string; // Additional free-form details about the item
};

export type Meal = {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  cuisine: string;
  imageUrl?: string;
};

// Mock meals database with ingredients
export const meals: Meal[] = [
  {
    id: "meal-1",
    name: "Spaghetti Bolognese",
    description: "Classic Italian pasta dish with a rich meat sauce",
    cuisine: "Italian",
    ingredients: [
      { id: "ing-1-1", name: "Ground Beef", quantity: "1 lb", category: "Meat" },
      { id: "ing-1-2", name: "Spaghetti", quantity: "1 package", category: "Grains" },
      { id: "ing-1-3", name: "Onion", quantity: "1 medium", category: "Produce" },
      { id: "ing-1-4", name: "Garlic", quantity: "3 cloves", category: "Produce" },
      { id: "ing-1-5", name: "Canned Tomatoes", quantity: "28 oz", category: "Pantry" },
      { id: "ing-1-6", name: "Tomato Paste", quantity: "2 tbsp", category: "Pantry" },
      { id: "ing-1-7", name: "Olive Oil", quantity: "2 tbsp", category: "Pantry" }
    ]
  },
  {
    id: "meal-2",
    name: "Grilled Salmon",
    description: "Tender salmon fillets with a lemon butter sauce",
    cuisine: "American",
    ingredients: [
      { id: "ing-2-1", name: "Salmon Fillet", quantity: "1.5 lb", category: "Seafood" },
      { id: "ing-2-2", name: "Lemon", quantity: "2", category: "Produce" },
      { id: "ing-2-3", name: "Butter", quantity: "4 tbsp", category: "Dairy" },
      { id: "ing-2-4", name: "Garlic", quantity: "2 cloves", category: "Produce" },
      { id: "ing-2-5", name: "Fresh Dill", quantity: "2 tbsp", category: "Produce" },
      { id: "ing-2-6", name: "Olive Oil", quantity: "1 tbsp", category: "Pantry" }
    ]
  },
  {
    id: "meal-3",
    name: "Vegetable Stir Fry",
    description: "Quick and healthy vegetable stir fry with a savory sauce",
    cuisine: "Asian",
    ingredients: [
      { id: "ing-3-1", name: "Broccoli", quantity: "1 head", category: "Produce" },
      { id: "ing-3-2", name: "Bell Peppers", quantity: "2", category: "Produce" },
      { id: "ing-3-3", name: "Carrots", quantity: "2", category: "Produce" },
      { id: "ing-3-4", name: "Snow Peas", quantity: "1 cup", category: "Produce" },
      { id: "ing-3-5", name: "Soy Sauce", quantity: "3 tbsp", category: "Pantry" },
      { id: "ing-3-6", name: "Sesame Oil", quantity: "1 tbsp", category: "Pantry" },
      { id: "ing-3-7", name: "Ginger", quantity: "1 inch", category: "Produce" },
      { id: "ing-3-8", name: "Garlic", quantity: "2 cloves", category: "Produce" }
    ]
  },
  {
    id: "meal-4",
    name: "Baked Chicken",
    description: "Juicy baked chicken with herbs and roasted vegetables",
    cuisine: "American",
    ingredients: [
      { id: "ing-4-1", name: "Chicken Breast", quantity: "2 lb", category: "Meat" },
      { id: "ing-4-2", name: "Potatoes", quantity: "1.5 lb", category: "Produce" },
      { id: "ing-4-3", name: "Carrots", quantity: "3", category: "Produce" },
      { id: "ing-4-4", name: "Onion", quantity: "1", category: "Produce" },
      { id: "ing-4-5", name: "Rosemary", quantity: "2 sprigs", category: "Produce" },
      { id: "ing-4-6", name: "Thyme", quantity: "2 sprigs", category: "Produce" },
      { id: "ing-4-7", name: "Olive Oil", quantity: "3 tbsp", category: "Pantry" },
      { id: "ing-4-8", name: "Garlic Powder", quantity: "1 tsp", category: "Pantry" }
    ]
  },
  {
    id: "meal-5",
    name: "Homemade Pizza",
    description: "Delicious pizza with customizable toppings",
    cuisine: "Italian",
    ingredients: [
      { id: "ing-5-1", name: "Pizza Dough", quantity: "1 lb", category: "Bakery" },
      { id: "ing-5-2", name: "Mozzarella Cheese", quantity: "8 oz", category: "Dairy" },
      { id: "ing-5-3", name: "Tomato Sauce", quantity: "1 cup", category: "Pantry" },
      { id: "ing-5-4", name: "Pepperoni", quantity: "4 oz", category: "Meat" },
      { id: "ing-5-5", name: "Bell Peppers", quantity: "1", category: "Produce" },
      { id: "ing-5-6", name: "Mushrooms", quantity: "8 oz", category: "Produce" },
      { id: "ing-5-7", name: "Onion", quantity: "1/2", category: "Produce" },
      { id: "ing-5-8", name: "Olive Oil", quantity: "1 tbsp", category: "Pantry" }
    ]
  },
  {
    id: "meal-6",
    name: "Tacos",
    description: "Classic beef tacos with all the fixings",
    cuisine: "Mexican",
    ingredients: [
      { id: "ing-6-1", name: "Ground Beef", quantity: "1 lb", category: "Meat" },
      { id: "ing-6-2", name: "Taco Shells", quantity: "12", category: "Pantry" },
      { id: "ing-6-3", name: "Taco Seasoning", quantity: "1 packet", category: "Pantry" },
      { id: "ing-6-4", name: "Cheddar Cheese", quantity: "8 oz", category: "Dairy" },
      { id: "ing-6-5", name: "Lettuce", quantity: "1 head", category: "Produce" },
      { id: "ing-6-6", name: "Tomatoes", quantity: "2", category: "Produce" },
      { id: "ing-6-7", name: "Avocado", quantity: "2", category: "Produce" },
      { id: "ing-6-8", name: "Sour Cream", quantity: "8 oz", category: "Dairy" }
    ]
  },
  {
    id: "meal-7",
    name: "Roast Beef",
    description: "Tender roast beef with gravy and vegetables",
    cuisine: "British",
    ingredients: [
      { id: "ing-7-1", name: "Beef Roast", quantity: "3 lb", category: "Meat" },
      { id: "ing-7-2", name: "Potatoes", quantity: "2 lb", category: "Produce" },
      { id: "ing-7-3", name: "Carrots", quantity: "6", category: "Produce" },
      { id: "ing-7-4", name: "Onions", quantity: "2", category: "Produce" },
      { id: "ing-7-5", name: "Beef Broth", quantity: "2 cups", category: "Pantry" },
      { id: "ing-7-6", name: "Rosemary", quantity: "3 sprigs", category: "Produce" },
      { id: "ing-7-7", name: "Thyme", quantity: "3 sprigs", category: "Produce" },
      { id: "ing-7-8", name: "Garlic", quantity: "4 cloves", category: "Produce" }
    ]
  },
  {
    id: "meal-8",
    name: "Chicken Curry",
    description: "Aromatic curry with tender chicken pieces",
    cuisine: "Indian",
    ingredients: [
      { id: "ing-8-1", name: "Chicken Thighs", quantity: "2 lb", category: "Meat" },
      { id: "ing-8-2", name: "Onions", quantity: "2", category: "Produce" },
      { id: "ing-8-3", name: "Garlic", quantity: "4 cloves", category: "Produce" },
      { id: "ing-8-4", name: "Ginger", quantity: "2 inch piece", category: "Produce" },
      { id: "ing-8-5", name: "Curry Powder", quantity: "2 tbsp", category: "Pantry" },
      { id: "ing-8-6", name: "Coconut Milk", quantity: "1 can", category: "Pantry" },
      { id: "ing-8-7", name: "Tomatoes", quantity: "2", category: "Produce" },
      { id: "ing-8-8", name: "Cilantro", quantity: "1 bunch", category: "Produce" }
    ]
  },
  {
    id: "meal-9",
    name: "Beef Stir Fry",
    description: "Quick and flavorful beef stir fry with vegetables",
    cuisine: "Asian",
    ingredients: [
      { id: "ing-9-1", name: "Beef Sirloin", quantity: "1.5 lb", category: "Meat" },
      { id: "ing-9-2", name: "Bell Peppers", quantity: "2", category: "Produce" },
      { id: "ing-9-3", name: "Broccoli", quantity: "1 head", category: "Produce" },
      { id: "ing-9-4", name: "Carrots", quantity: "2", category: "Produce" },
      { id: "ing-9-5", name: "Soy Sauce", quantity: "1/4 cup", category: "Pantry" },
      { id: "ing-9-6", name: "Sesame Oil", quantity: "2 tbsp", category: "Pantry" },
      { id: "ing-9-7", name: "Garlic", quantity: "3 cloves", category: "Produce" },
      { id: "ing-9-8", name: "Ginger", quantity: "1 inch piece", category: "Produce" }
    ]
  },
  {
    id: "meal-10",
    name: "Veggie Burger",
    description: "Hearty and flavorful vegetarian burger",
    cuisine: "American",
    ingredients: [
      { id: "ing-10-1", name: "Black Beans", quantity: "2 cans", category: "Pantry" },
      { id: "ing-10-2", name: "Quinoa", quantity: "1 cup", category: "Grains" },
      { id: "ing-10-3", name: "Bell Pepper", quantity: "1", category: "Produce" },
      { id: "ing-10-4", name: "Onion", quantity: "1", category: "Produce" },
      { id: "ing-10-5", name: "Burger Buns", quantity: "6", category: "Bakery" },
      { id: "ing-10-6", name: "Lettuce", quantity: "1/2 head", category: "Produce" },
      { id: "ing-10-7", name: "Tomato", quantity: "2", category: "Produce" },
      { id: "ing-10-8", name: "Avocado", quantity: "1", category: "Produce" }
    ]
  }
];

// Function to get a meal by id
export const getMealById = (id: string): Meal | undefined => {
  return meals.find(meal => meal.id === id);
};

// Function to get all meals
export const getAllMeals = (): Meal[] => {
  return meals;
};
