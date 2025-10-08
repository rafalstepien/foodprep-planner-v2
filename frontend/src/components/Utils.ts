import type { Totals, ProductData, ProductAmount } from "./Types.tsx"


type CalculateTotalsProps = {
  productMap: Record<number, ProductData>;
  productAmounts: ProductAmount
}

export function calculateTotals (props: CalculateTotalsProps) {
    const totals: Totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    for (const [id, amount] of Object.entries(props.productAmounts)) {
      const product = props.productMap[id];
      if (!product || amount <= 0) continue;
  
      totals.kcal += ((product.kcal ?? 0) * amount) / 100;
      totals.protein += ((product.protein ?? 0) * amount) / 100;
      totals.carbs += ((product.carbohydrates ?? 0) * amount) / 100;
      totals.fat += ((product.fat ?? 0) * amount) / 100;
    }

    return totals
}