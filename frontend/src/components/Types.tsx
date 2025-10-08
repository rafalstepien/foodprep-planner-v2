export interface Option {
  value: number;
  label: string;
}

export type ProductData = {
  id: number;
  product: string;
  protein: number;
  carbohydrates: number;
  fat: number;
  kcal: number;
};

export type MealData = {
  id: number;
  name: string;
  products: ProductData[];
};

export type Totals = {
  protein: number;
  fat: number;
  carbs: number;
  kcal: number;
};

export type SetupData = {
  numberOfKcal: number;
  numberOfMeals: number;
  numberOfDays: number;
};

export type ProductAmount = {
  [key: number]: number;
};
