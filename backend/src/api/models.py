from pydantic import BaseModel


class Product(BaseModel):
    name: str
    protein: float
    carbohydrates: float
    fat: float
    kcal: float


class Meal(BaseModel):
    name: str


class OutputProduct(BaseModel):
    id: int
    product: str
    protein: float
    carbohydrates: float
    fat: float
    kcal: float


class OutputMeal(BaseModel):
    id: int
    name: str
    products: list[OutputProduct]
