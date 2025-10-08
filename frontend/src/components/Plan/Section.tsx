import { useState, useEffect } from "react";
import { mealsService } from "../../services/MealsService.ts";
import { productService } from "../../services/ProductsService.ts";
import AddMealInput from "./AddMealInput.tsx";
import WeekSetup from "./WeekSetup.tsx";
import { MealTable } from "./MealTable.tsx";
import type {
  Option,
  MealData,
  SetupData,
  ProductAmount,
  ProductData,
} from "../Types.tsx";
import { calculateTotals } from "../Utils.ts";

function Todos() {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <h2>TODOS</h2>
      <ul>
        <li>1. Wygenerować listę zakupów, pomnożyć o ilość posiłków</li>
        <li>2. Zapisać plan w bazie</li>
        <li>
          3. Zrobić limity na ilość posiłków według tego co ustawione, zaznaczyć
          na czerwono jak za dużo kcal
        </li>
        <li>4. Zrobić wykres procentowy makro</li>
      </ul>
    </div>
  );
}

type ShoppingListProps = {
  selectedMeals: Option[];
  allMealsFromDb: MealData[];
};

function ShoppingList(props: ShoppingListProps) {
  return <></>;
}

type AllMealsSummaryProps = {
  productAmounts: ProductAmount;
  allProductsFromDb: ProductData[];
};

function AllMealsSummary(props: AllMealsSummaryProps) {
  const baseClassNameNumber = "text-6xl font-inter font-bold";
  const baseClassNameLabel = "flex items-center justify-center";

  const colorProtein = "text-[#FFACAC]";
  const colorCarbs = "text-[#E45A92]";
  const colorFat = "text-[#5D2F77]";
  const colorKcal = "text-[#3E1E68]";
  

    const productMap = Object.fromEntries(
      props.allProductsFromDb.map((p) => [p.id, p]),
    );

    const totals = calculateTotals({productMap: productMap, productAmounts: props.productAmounts})

  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow gap-2 flex justify-center items-center">
      <div className="w-1/3 flex rounded items-center justify-center py-10 gap-30">
        <div>
          <div className={`${baseClassNameNumber} ${colorProtein}`}>
            {totals.protein.toFixed(1)}
          </div>
          <div className={`${baseClassNameLabel} ${colorProtein}`}>Protein</div>
        </div>
        <div>
          <div className={`${baseClassNameNumber} ${colorCarbs}`}>
            {totals.carbs.toFixed(1)}
          </div>
          <div className={`${baseClassNameLabel} ${colorCarbs}`}>Carbs</div>
        </div>
        <div>
          <div className={`${baseClassNameNumber} ${colorFat}`}>
            {totals.fat.toFixed(1)}
          </div>
          <div className={`${baseClassNameLabel} ${colorFat}`}>Fat</div>
        </div>
        <div>
          <div className={`${baseClassNameNumber} ${colorKcal}`}>
            {totals.kcal.toFixed(1)}
          </div>
          <div className={`${baseClassNameLabel} ${colorKcal}`}>Calories</div>
        </div>
      </div>
    </div>
  );
}

export default function PlanSection() {
  const defaultSetupData = {
    numberOfKcal: 2500,
    numberOfMeals: 3,
    numberOfDays: 5,
  };

  const [setupData, setSetupData] = useState<SetupData>(defaultSetupData);
  const [allMealsFromDb, setAllMealsFromDb] = useState<MealData[]>([]);
  const [allProductsFromDb, setAllproductsFromDb] = useState<ProductData[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<Option[]>([]);

  const [selectOptions, setSelectOptions] = useState<Option[]>([]); // TODO: select options musi słuchać na eventy dodania meal i się aktualizować
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [productAmounts, setProductAmounts] = useState<ProductAmount>({});

  const updateProductAmounts = (productId: number, productAmount: number) => {
    setProductAmounts((prev) => ({ ...prev, [productId]: productAmount }));
  };

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
  }, []); // fetches all meals from db

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await productService.getAll();
      setAllproductsFromDb(products);
    };
    fetchProducts();
  }, []); // fetches all products from db

  useEffect(() => {
    const defaultProductAmounts = allProductsFromDb.reduce((acc, meal) => {
      acc[meal.id] = 0;
      return acc;
    }, {} as ProductAmount); // sets the default amount of each product

    setProductAmounts(defaultProductAmounts);
  }, [allProductsFromDb]);

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
        <WeekSetup setSetupData={setSetupData} setupData={setupData} />

        {selectedMeals.map((meal: Option, i) => {
          const mealData = allMealsFromDb.find(
            (dbMeal: MealData) => dbMeal.name === meal.label,
          );
          if (!mealData) return null;

          return (
            <MealTable
              key={i}
              mealData={mealData}
              i={i}
              updateProductAmounts={updateProductAmounts}
              productAmounts={productAmounts}
            />
          );
        })}

        {selectedMeals.length < setupData.numberOfMeals ? (
          <AddMealInput
            selectOptions={selectOptions}
            setSelectedOption={setSelectedOption}
            addMeal={addMeal}
          />
        ) : null}

        {selectedMeals.length > 0 ? (
          <AllMealsSummary productAmounts={productAmounts} allProductsFromDb={allProductsFromDb}/>
        ) : null}

        <Todos />

        <ShoppingList
          selectedMeals={selectedMeals}
          allMealsFromDb={allMealsFromDb}
        />
      </div>
    </>
  );
}
