from dataclasses import dataclass


@dataclass(frozen=True)
class ProductDto:
    name: str
    protein: float
    carbohydrates: float
    fat: float
    kcal: float


@dataclass(frozen=True)
class EmptyMealDto:
    name: str


@dataclass(frozen=True)
class AddProductsToMealDto:
    meal_id: int
    products: list[int]


@dataclass(frozen=True)
class MealProductsToDelete:
    meal_id: int
    product_ids: list[int]
