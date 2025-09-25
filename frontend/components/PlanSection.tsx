import { useState, useEffect } from "react";
import { mealsService } from "../src/services/MealsService.ts";
import AddMealInput from "./Plan/AddMealInput.tsx";
import WeekSetup from "./Plan/WeekSetup.tsx";
import SelectedMeals from "./Plan/SelectedMeals.tsx";

interface Option {
  value: number;
  label: string;
}

type ProductData = {
  id: number;
  product: string;
  protein: number;
  carbohydrates: number;
  fat: number;
  kcal: number;
};

type MealData = {
  id: number;
  name: string;
  products: ProductData[];
};

type Targets = {
  kcal: number;
  meals: number;
};

function Todos() {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <h2>TODOS</h2>
      <ul>
        <li>
          {" "}
          - User input: target calories, target number of meals, if too much
          calories planned then highlight red
        </li>
        <li> - Persist planned meals for the week</li>
        <li> - Show plot of % of microelements</li>
        <li>
          {" "}
          - Build shopping list, allow for custom ordering by drag and drop
        </li>
        <li> - Download shopping list</li>
      </ul>
    </div>
  );
}

export default function PlanSection() {
  const [currentKcal, setCurrentKcal] = useState<number>(2000);
  const [currentMeals, setCurrentMeals] = useState<number>(5);
  const [currentDays, setCurrentDays] = useState<number>(5);

  const [allMealsFromDb, setAllMealsFromDb] = useState<MealData[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<Option[]>([]);
  const [selectOptions, setSelectOptions] = useState<Option[]>([]); // TODO: select options musi słuchać na eventy dodania meal i się aktualizować
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      const meals = await mealsService.getAll();
      setAllMealsFromDb(meals);
      setSelectOptions(
        meals.map((meal: MealData) => ({
          value: meal.id,
          label: meal.name,
        })),
      );
    };
    fetchMeals();
  }, []);

  const addMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      setSelectedMeals((prev) => [...prev, selectedOption]);
      setSelectedOption(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-10 mt-10">
        <WeekSetup
          setCurrentKcal={setCurrentKcal}
          setCurrentMeals={setCurrentMeals}
          setCurrentDays={setCurrentDays}
          currentKcal={currentKcal}
          currentMeals={currentMeals}
          currentDays={currentDays}
        />

        <SelectedMeals
          selectedMeals={selectedMeals}
          allMealsFromDb={allMealsFromDb}
        />

        <AddMealInput
          selectOptions={selectOptions}
          setSelectedOption={setSelectedOption}
          addMeal={addMeal}
        />

        <Todos />
      </div>
    </>
  );
}
