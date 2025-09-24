import { useState, useEffect, useCallback } from "react";

import { mealsService } from "../src/services/MealsService.js";
import { MealData } from "./MealDataTable.js";

type Meal = {
  id: number;
  name: string;
  products: [];
};

type AddProductToMealSchema = {
  mealId: number;
  productId: number;
};

function useMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
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
    async (mealId: number, productId: number) => {
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
    async (mealId: number) => {
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

  const addProductToMeal = useCallback(
    async (mealData: AddProductToMealSchema) => {
      setError(null);
      try {
        await mealsService.addProductToMeal(mealData);
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
    addProductToMeal,
  };
}

function CreateMealForm({ onSubmit }) {
  const EMPTY_MEAL = {
    name: "",
    products: [],
  };
  const [meal, setMeal] = useState(EMPTY_MEAL);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

function ErrorMessage({ error }) {
  if (!error) return null;

  return (
    <div className="w-6/12 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <span>{error}</span>
        <button className="text-red-500 hover:text-red-700 ml-4">✕</button>
      </div>
    </div>
  );
}

type MealsListProps = {
  meals: Meal[];
  deleteProductFromMeal: (mealId: number, productId: number) => void;
  deleteMeal: (mealId: number) => void;
  addProductToMeal: (mealData: AddProductToMealSchema) => void;
};

function MealsList(props: MealsListProps) {
  return props.meals.map((meal: Meal, i: number) => (
    <div key={i} className="w-full flex flex-col gap-2 mt-10">
      <MealData
        meal={meal}
        deleteProductFromMeal={props.deleteProductFromMeal}
        deleteMeal={props.deleteMeal}
        addProductToMeal={props.addProductToMeal}
      />
    </div>
  ));
}

export default function MealsSection() {
  const {
    meals,
    error,
    addNewMeal,
    fetchMeals,
    deleteProductFromMeal,
    deleteMeal,
    addProductToMeal,
  } = useMeals();

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return (
    <div className="flex flex-col gap-30">
      <ErrorMessage error={error} />
      <div>
        {meals.length == 0 ? (
          <div>Add your first meal</div>
        ) : (
          <MealsList
            meals={meals}
            deleteProductFromMeal={deleteProductFromMeal}
            deleteMeal={deleteMeal}
            addProductToMeal={addProductToMeal}
          />
        )}
      </div>
      <CreateMealForm onSubmit={addNewMeal} />
    </div>
  );
}
