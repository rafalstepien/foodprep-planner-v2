import { useState, useEffect, useCallback } from "react";

// TODO: move to env file
const API_BASE_URL = "http://localhost:8000";
const MEALS_ENDPOINT = `${API_BASE_URL}/meals`;

const mealsService = {
  async getAll() {
    const response = await fetch(MEALS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.status}`);
    }
    return response.json(); // TODO: handle sqlalchemy.exc.IntegrityError: (sqlite3.IntegrityError) UNIQUE constraint failed: products.product
  },

  async createNewMeal(newMeal) {
    const response = await fetch(MEALS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meals: [newMeal] }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create meal: ${response.status}`);
    }
  },

  async deleteProductFromMeal(meal) {
    const response = await fetch(`${API_BASE_URL}/meals_products`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meals: [meal] }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete meal: ${response.status}`);
    }
  },

  async deleteMeal(mealId) {
    const response = await fetch(`${API_BASE_URL}/meals`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [mealId] }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete meal: ${response.status}`);
    }
  },
};

function useMeals() {
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);

  const fetchMeals = useCallback(async () => {
    setError(null);
    try {
      const data = await mealsService.getAll();
      setMeals(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const addNewMeal = useCallback(
    async (meal) => {
      setError(null);
      try {
        const newMeal = {
          name: meal.name,
        };

        await mealsService.createNewMeal(newMeal);
        await fetchMeals();
      } catch (err) {
        setError(err.message);
        throw err; // Re-throw for form handling
      }
    },
    [fetchMeals],
  );

  const deleteProductFromMeal = useCallback(
    async (mealId, productId) => {
      setError(null);
      try {
        await mealsService.deleteProductFromMeal({
          meal_id: mealId,
          product_ids: [productId],
        });
      } catch (err) {
        setError(err.message);
      }
      await fetchMeals();
    },
    [fetchMeals],
  );

  const deleteMeal = useCallback(
    async (mealId) => {
      setError(null);
      try {
        await mealsService.deleteMeal(mealId);
      } catch (err) {
        setError(err.message);
      }
      await fetchMeals();
    },
    [fetchMeals],
  );

  return {
    meals,
    error,
    addNewMeal,
    fetchMeals,
    deleteProductFromMeal,
    deleteMeal,
  };
}

function DeleteProductFromMealButton({ mealId, productId, onDelete }) {
  return (
    <button
      type="button"
      onClick={() => onDelete(mealId, productId)}
      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Delete
    </button>
  );
}

function DeleteMealButton({ mealId, onDelete }) {
  return (
    <button
      type="button"
      onClick={() => onDelete(mealId)}
      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Delete
    </button>
  );
}

function MealTable({ meal, deleteProductFromMeal, deleteMeal }) {
  return (
    <>
      <div className="w-full items-left flex flex-row gap-4">
        <h2 className="text-lg font-bold text-gray-800 text-left">
          {meal.name}
        </h2>
        <DeleteMealButton mealId={meal.id} onDelete={deleteMeal} />
      </div>
      <div className="w-full overflow-x-auto rounded-2xl shadow gap-4">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Protein (g)</th>
              <th className="px-4 py-2">Carbs (g)</th>
              <th className="px-4 py-2">Fat (g)</th>
              <th className="px-4 py-2">Kcal</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meal.products.map((product, i) => {
              return (
                <tr
                  key={product.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 font-medium">{product.product}</td>
                  <td className="px-4 py-2">{product.protein}</td>
                  <td className="px-4 py-2">{product.carbohydrates}</td>
                  <td className="px-4 py-2">{product.fat}</td>
                  <td className="px-4 py-2">{product.kcal}</td>
                  <td className="px-4 py-2">
                    <DeleteProductFromMealButton
                      productId={product.id}
                      mealId={meal.id}
                      onDelete={deleteProductFromMeal}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AddMealForm({ onSubmit }) {
  const EMPTY_MEAL = {
    name: "",
    products: [],
  };
  const [meal, setMeal] = useState(EMPTY_MEAL);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(meal);
      setMeal(EMPTY_MEAL);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeal((prev) => ({ ...prev, [name]: value }));
  };

  const inputClassName =
    "w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent";

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-800">Create Meal</h2>
      <div className="grid gap-3 mb-1 md:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Meal name"
          value={meal.name}
          onChange={handleChange}
          className={inputClassName}
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding..." : "Create Meal"}
        </button>
      </div>
    </div>
  );
}

function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="w-6/12 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <span>{error}</span>
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function MealTablesAndForm({
  meals,
  addNewMeal,
  deleteProductFromMeal,
  deleteMeal,
}) {
  return (
    <>
      {meals.length == 0 ? (
        <div>Add your first meal</div>
      ) : (
        meals.map((meal, i) => (
          <MealTable
            meal={meal}
            deleteProductFromMeal={deleteProductFromMeal}
            deleteMeal={deleteMeal}
          />
        ))
      )}
      <AddMealForm onSubmit={addNewMeal} />
    </>
  );
}

function AddProductToMealForm () {
  
}

export default function MealsComponent() {
  const {
    meals,
    error,
    addNewMeal,
    fetchMeals,
    deleteProductFromMeal,
    deleteMeal,
  } = useMeals();

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleDismissError = () => {
    // In a real app, you'd have error state management here
  };

  return (
    <>
      <ErrorMessage error={error} onDismiss={handleDismissError} />
      <MealTablesAndForm
        meals={meals}
        addNewMeal={addNewMeal}
        deleteProductFromMeal={deleteProductFromMeal}
        deleteMeal={deleteMeal}
      />
    </>
  );
}
