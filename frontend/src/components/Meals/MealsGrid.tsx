import { useState, useEffect } from "react";
import Select from "react-select";
import { productService } from "../../services/ProductsService";

const buttonClassName =
  "w-5 h-5 flex items-center justify-center rounded-full text-white text-xl font-bold shadow bg-gray-300 hover:bg-gray-400 transition duration-400 transition-colors";

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
      className={buttonClassName}
    >
      -
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
      className={buttonClassName}
    >
      -
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
  const [selectOptions, setSelectOptions] = useState<Option[]>([]);
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
    <div className="w-full p-4 rounded-2xl shadow-md flex flex-col gap-2">
      <div className="grid gap-3 mb-1 md:grid-cols-2">
        <Select
          options={selectOptions}
          onChange={(option) => setSelectedOption(option)}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          }}
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
      <DeleteMealButton
        mealId={props.meal.id}
        callDeleteMeal={props.deleteMeal}
      />
      <h2 className="text-lg font-bold text-gray-800 text-left">
        {props.meal.name}
      </h2>
    </div>
  );
}

type TableContentProps = {
  meal: Meal;
  deleteProductFromMeal: (mealId: number, productId: number) => void;
  addProductToMeal: (data: {
    mealId: number;
    productId: number;
  }) => Promise<void>;
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
      <table className="min-w-full border-collapse table-auto table-fixed">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 w-1/16"></th>
            <th className="px-4 py-2 w-15/16"></th>
          </tr>
        </thead>
        <tbody>
          {props.meal.products.map((product: Product, i: number) => {
            return (
              <tr
                key={product.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 flex justify-center">
                  <DeleteProductFromMealButton
                    productId={product.id}
                    mealId={props.meal.id}
                    callDeleteProductFromMeal={props.deleteProductFromMeal}
                  />
                </td>
                <td className="px-4 py-2 font-medium">{product.product}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <AddProductForm
        meal={props.meal}
        addProductToMeal={props.addProductToMeal}
      />
    </div>
  );
}

export function MealsGrid({
  meal,
  deleteProductFromMeal,
  deleteMeal,
  addProductToMeal,
}) {
  return (
    <>
      <TableHeader meal={meal} deleteMeal={deleteMeal} />
      <TableContent
        meal={meal}
        deleteProductFromMeal={deleteProductFromMeal}
        addProductToMeal={addProductToMeal}
      />
    </>
  );
}
