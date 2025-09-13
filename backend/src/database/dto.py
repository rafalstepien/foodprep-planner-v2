from dataclasses import dataclass


@dataclass(frozen=True)
class ProductDto:
    name: str
    protein: float
    carbohydrates: float
    fat: float
    kcal: float



@dataclass(frozen=True)
class MealProductDto:
    product_id: int
    product_amount: int


@dataclass(frozen=True)
class MealDto:
    name: str
    products: list[MealProductDto]

    