const API_BASE_URL = "http://localhost:8000";
const MEALS_ENDPOINT = `${API_BASE_URL}/meals`;
const COMMON_HEADERS = { "Content-Type": "application/json" };

type MealResponse = {
  id: number;
  name: string;
};

type MealProductData = {
  mealId: number;
  productId: number;
};

export const mealsService = {
  async getAll() {
    const response = await fetch(MEALS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.status}`);
    }
    return response.json();
  },

  async create(name: string): Promise<MealResponse> {
    const response = await fetch(MEALS_ENDPOINT, {
      method: "POST",
      headers: COMMON_HEADERS,
      body: JSON.stringify({ name: name }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create meal: ${response.status}`);
    }
    return response.json();
  },

  async deleteProductFromMeal(data: MealProductData) {
    const response = await fetch(
      `${MEALS_ENDPOINT}/${data.mealId}/${data.productId}`,
      {
        method: "DELETE",
        headers: COMMON_HEADERS,
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to delete meal: ${response.status}`);
    }
  },

  async addProductToMeal(data: MealProductData) {
    const response = await fetch(
      `${MEALS_ENDPOINT}/${data.mealId}/${data.productId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to create meal: ${response.status}`);
    }
  },

  async deleteMeal(mealId: number) {
    const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
      method: "DELETE",
      headers: COMMON_HEADERS,
    });
    if (!response.ok) {
      throw new Error(`Failed to delete meal: ${response.status}`);
    }
  },
};
