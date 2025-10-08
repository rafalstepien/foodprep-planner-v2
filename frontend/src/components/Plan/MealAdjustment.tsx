import type { MealData, ProductData, ProductAmount, Totals } from "./Types";

function TableHeader(meal: MealData) {
  return (
    <div className="w-full items-left flex flex-row gap-4">
      <h2 className="text-lg font-bold text-gray-800 text-left">{meal.name}</h2>
    </div>
  );
}

type TableContentProps = {
  meal: MealData;
  multipliers: Record<number, number>;
  updateProductAmounts: (productId: number, productAmount: number) => void;
  productAmounts: ProductAmount;
};

function TableContent(props: TableContentProps) {
  return (
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
        {props.meal.products.map((product: ProductData, i: number) => {
          return (
            <tr
              key={product.id}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-2 font-medium">{product.product}</td>
              <td className="px-4 py-2 font-medium">
                <input
                  type="number"
                  value={props.productAmounts[product.id]}
                  min={0}
                  className="w-full border border-gray-300 px-4 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  onChange={(e) =>
                    props.updateProductAmounts(
                      product.id,
                      Number(e.target.value),
                    )
                  }
                />
              </td>
              <td className="px-4 py-2 font-medium">
                {(
                  (product.protein * props.productAmounts[product.id]) /
                  100
                ).toFixed(1)}
              </td>
              <td className="px-4 py-2 font-medium">
                {(
                  (product.carbohydrates * props.productAmounts[product.id]) /
                  100
                ).toFixed(1)}
              </td>
              <td className="px-4 py-2 font-medium">
                {(
                  (product.fat * props.productAmounts[product.id]) /
                  100
                ).toFixed(1)}
              </td>
              <td className="px-4 py-2 font-medium">
                {(
                  (product.kcal * props.productAmounts[product.id]) /
                  100
                ).toFixed(1)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

type MealSummaryProps = {
  mealData: MealData;
  productAmounts: ProductAmount;
};

function MealSummary(props: MealSummaryProps) {
  const idsOfProductsBelongingToMeal = props.mealData.products.map(
    (productData: ProductData) => productData.id,
  );
  const mealProductsAmounts = Object.fromEntries(
    Object.entries(props.productAmounts).filter(([key, value]) =>
      idsOfProductsBelongingToMeal.includes(Number(key)),
    ),
  );

  const productMap = Object.fromEntries(
    props.mealData.products.map((p) => [p.id, p]),
  );
  const totals: Totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  for (const [id, amount] of Object.entries(mealProductsAmounts)) {
    const product = productMap[id];
    if (!product || amount <= 0) continue;

    totals.kcal += ((product.kcal ?? 0) * amount) / 100;
    totals.protein += ((product.protein ?? 0) * amount) / 100;
    totals.carbs += ((product.carbohydrates ?? 0) * amount) / 100;
    totals.fat += ((product.fat ?? 0) * amount) / 100;
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow gap-2 table-fixed flex">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="w-6/12"></th>
            <th className="w-2/12"></th>
            <th className="w-1/12"></th>
            <th className="w-1/12"></th>
            <th className="w-1/12"></th>
            <th className="w-1/12"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-blue-50">
            <td className="px-4 py-2 font-medium">Total</td>
            <td className="px-4 py-2 font-medium"></td>
            <td className="px-4 py-2 font-medium">
              {totals.protein.toFixed(1)}
            </td>
            <td className="px-4 py-2 font-medium">{totals.carbs.toFixed(1)}</td>
            <td className="px-4 py-2 font-medium">{totals.fat.toFixed(1)}</td>
            <td className="px-4 py-2 font-medium">{totals.kcal.toFixed(1)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

type MealAdjustmentTableProps = {
  i: number;
  mealData: MealData;
  updateProductAmounts: (productId: number, productAmount: number) => void;
  productAmounts: ProductAmount;
};

export function MealAdjustmentTable(props: MealAdjustmentTableProps) {
  return (
    <div
      key={props.i}
      className="w-full p-6 bg-white rounded-2xl shadow-md flex flex-col gap-4"
    >
      <TableHeader {...props.mealData} />
      <div className="w-full overflow-x-auto rounded-2xl shadow gap-4 table-fixed flex gap-10">
        <TableContent
          meal={props.mealData}
          updateProductAmounts={props.updateProductAmounts}
          productAmounts={props.productAmounts}
        />
      </div>
      <MealSummary
        mealData={props.mealData}
        productAmounts={props.productAmounts}
      />
    </div>
  );
}
