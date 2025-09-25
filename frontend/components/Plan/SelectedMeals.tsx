import { useState } from "react";

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

function TableHeader(meal: MealData) {
  return (
    <div className="w-full items-left flex flex-row gap-4">
      <h2 className="text-lg font-bold text-gray-800 text-left">{meal.name}</h2>
    </div>
  );
}

function TableContent(meal: MealData) {
  const [multipliers, setMultipliers] = useState<Record<number, number>>({});

  const handleMultiplierChange = (id: number, value: number) => {
    setMultipliers((prev) => ({ ...prev, [id]: value }));
  };

  const getMultiplier = (id: number) => multipliers[id] || 1;

  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow gap-4 table-fixed">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 w-6/12">Product</th>
            <th className="px-4 py-2 w-2/12">Amount [g]</th>
            <th className="px-4 py-2 w-1/12">Protein</th>
            <th className="px-4 py-2 w-1/12">Carbs</th>
            <th className="px-4 py-2 w-1/12">Fat</th>
            <th className="px-4 py-2 w-1/12">Kcal</th>
          </tr>
        </thead>
        <tbody>
          {meal.products.map((product: ProductData) => {
            const multiplier = getMultiplier(product.id);

            return (
              <tr
                key={product.id}
                className={product.id % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 font-medium">{product.product}</td>
                <td className="px-4 py-2 font-medium">
                  <input
                    type="number"
                    value={multiplier}
                    min={0}
                    className="w-full border border-gray-300 px-4 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    onChange={(e) =>
                      handleMultiplierChange(product.id, Number(e.target.value))
                    }
                  />
                </td>
                <td className="px-4 py-2 font-medium">
                  {((product.protein * multiplier) / 100).toFixed(1)}
                </td>
                <td className="px-4 py-2 font-medium">
                  {((product.carbohydrates * multiplier) / 100).toFixed(1)}
                </td>
                <td className="px-4 py-2 font-medium">
                  {((product.fat * multiplier) / 100).toFixed(1)}
                </td>
                <td className="px-4 py-2 font-medium">
                  {((product.kcal * multiplier) / 100).toFixed(1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type MealAdjustmentTableProps = {
  i: number;
  mealData: MealData;
};

function MealAdjustmentTable(props: MealAdjustmentTableProps) {
  return (
    <div
      key={props.i}
      className="w-full p-6 bg-white rounded-2xl shadow-md flex flex-col gap-10"
    >
      <TableHeader {...props.mealData} />
      <TableContent {...props.mealData} />
      <div className="grid gap-3 mb-1 md:grid-cols-4">
        <div>1</div>
        <div>1</div>
      </div>
    </div>
  );
}

type SelectedMealsProps = {
  selectedMeals: Option[];
  allMealsFromDb: MealData[];
};

export default function SelectedMeals(props: SelectedMealsProps) {
  return props.selectedMeals.map((meal: Option, i) => {
    const mealData = props.allMealsFromDb.find(
      (dbMeal: MealData) => dbMeal.name === meal.label,
    );
    if (!mealData) {
      return null;
    }
    return <MealAdjustmentTable mealData={mealData} i={i} />;
  });
}
