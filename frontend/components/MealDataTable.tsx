import { useState, useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { productService } from "../src/ProductsService.js";

type DeleteProductFromMealButtonProps = {
  mealId: number;
  productId: number;
  callDeleteProductFromMeal: (mealId: number, productId: number) => void;
};

function DeleteProductFromMealButton(props: DeleteProductFromMealButtonProps) {
  return (
    <button
      type="button"
      onClick={() =>
        props.callDeleteProductFromMeal(props.mealId, props.productId)
      }
      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Delete
    </button>
  );
}

type DeleteMealButtonProps = {
  mealId: number;
  callDeleteMeal: (mealId: number) => void;
};

function DeleteMealButton(props: DeleteMealButtonProps) {
  return (
    <button
      type="button"
      onClick={() => props.callDeleteMeal(props.mealId)}
      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Delete
    </button>
  );
}

type Meal = {
  id: number;
  name: string;
  products: [];
};

type AddProductFormProps = {
  meal: Meal;
  addProductToMeal: (data: {
    mealId: number;
    productId: number;
  }) => Promise<void>;
};

interface Option {
  value: number;
  label: string;
}

function AddProductForm(props: AddProductFormProps) {
  const [selectOptions, setSelectOptions] = useState<Option[]>([]); // TODO: select options musi słuchać na eventy dodania produktu i się aktualizować
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const products = await productService.getAll();
        setSelectOptions(
          products.map((p: { id: number; product: string }) => ({
            value: p.id,
            label: p.product,
          })),
        );
      } catch (err) {
        console.error("Failed to load products", err);
      }
    }
    fetchOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption) {
      // TODO: verify if product is already on the products list of this specific meal
      try {
        await props.addProductToMeal({
          mealId: props.meal.id,
          productId: selectedOption.value,
        });
      } catch (error) {
        // handled by parent
      }
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md flex flex-col gap-2">
      <div className="grid gap-3 mb-1 md:grid-cols-2">
        <Select
          options={selectOptions}
          onChange={(option: SingleValue<Option>) => setSelectedOption(option)}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}

type TableHeaderProps = {
  meal: Meal;
  deleteMeal: (mealId: number) => void;
};

function TableHeader(props: TableHeaderProps) {
  return (
    <div className="w-full items-left flex flex-row gap-4">
      <h2 className="text-lg font-bold text-gray-800 text-left">
        {props.meal.name}
      </h2>
      <DeleteMealButton
        mealId={props.meal.id}
        callDeleteMeal={props.deleteMeal}
      />
    </div>
  );
}

type TableContentProps = {
  meal: Meal;
  deleteProductFromMeal: (mealId: number, productId: number) => void;
};

type Product = {
  id: number;
  product: string;
  protein: number;
  carbohydrates: number;
  fat: number;
  kcal: number;
};

function TableContent(props: TableContentProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow gap-4 table-fixed">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 w-3/4">Product</th>
            <th className="px-4 py-2 w-1/4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.meal.products.map((product: Product, i: number) => {
            return (
              <tr
                key={product.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 font-medium">{product.product}</td>
                <td className="px-4 py-2">
                  <DeleteProductFromMealButton
                    productId={product.id}
                    mealId={props.meal.id}
                    callDeleteProductFromMeal={props.deleteProductFromMeal}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function MealData({
  meal,
  deleteProductFromMeal,
  deleteMeal,
  addProductToMeal,
}) {
  return (
    <>
      <TableHeader meal={meal} deleteMeal={deleteMeal} />
      <TableContent meal={meal} deleteProductFromMeal={deleteProductFromMeal} />
      <AddProductForm meal={meal} addProductToMeal={addProductToMeal} />
    </>
  );
}
