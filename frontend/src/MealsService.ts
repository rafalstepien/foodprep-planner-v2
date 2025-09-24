const API_BASE_URL = "http://localhost:8000";
const MEALS_ENDPOINT = `${API_BASE_URL}/meals`;
const COMMON_HEADERS = { "Content-Type": "application/json" }

type Meal = {
  name: string;
}

type MealToDeleteProductsFrom = {
  meal_id: number;
  product_ids: number[];
}

type AddProductToMealSchema = {
  mealId: number;
  productId: number;
}


export const mealsService = {
  async getAll() {
    const response = await fetch(MEALS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.status}`);
    }
    return response.json(); // TODO: handle sqlalchemy.exc.IntegrityError: (sqlite3.IntegrityError) UNIQUE constraint failed: products.product
  },

  async createNewMeal(meal: Meal) {
    const response = await fetch(MEALS_ENDPOINT, {
      method: "POST",
      headers: COMMON_HEADERS,
      body: JSON.stringify({ meals: [meal] }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create meal: ${response.status}`);
    }
  },

  async deleteProductFromMeal(meal: MealToDeleteProductsFrom) {
    const response = await fetch(`${API_BASE_URL}/meals_products`, {
      method: "DELETE",
      headers: COMMON_HEADERS,
      body: JSON.stringify({ meals: [meal] }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete meal: ${response.status}`);
    }
  },

  async addProductToMeal(newMeal: AddProductToMealSchema) {
    var mealJson = JSON.stringify({ meals: [{
      meal_id: newMeal.mealId,
      products: [newMeal.productId],
    }] })
    console.log("-------")
    console.log(mealJson)
    const response = await fetch(MEALS_ENDPOINT, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: mealJson,
    });
    if (!response.ok) {
      throw new Error(`Failed to create meal: ${response.status}`);
    }
  },

  async deleteMeal(mealId: number) {
    const response = await fetch(`${API_BASE_URL}/meals`, {
      method: "DELETE",
      headers: COMMON_HEADERS,
      body: JSON.stringify({ ids: [mealId] }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete meal: ${response.status}`);
    }
  },
};