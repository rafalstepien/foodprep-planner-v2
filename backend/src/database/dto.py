from dataclasses import dataclass


@dataclass(frozen=True)
class ProductDto:
    name: str
    protein: float
    carbohydrates: float
    fat: float
    kcal: float


@dataclass(frozen=True)
class MealDto:
    name: str


@dataclass(frozen=True)
class AddProductsToMealDto:
    meal_id: int
    product_id: int


@dataclass(frozen=True)
class DeleteProductFromMealDto:
    meal_id: int
    product_id: int
