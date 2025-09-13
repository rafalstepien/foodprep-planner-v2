from pydantic import BaseModel


class Product(BaseModel):
    name: str
    protein: float
    carbohydrates: float
    fat: float
    kcal: float
    
    
class Products(BaseModel):
    products: list[Product]
    
    
class ProductIds(BaseModel):
    ids: list[int]


class MealProduct(BaseModel):
    product_id: int
    product_amount: int


class Meal(BaseModel):
    name: str
    products: list[MealProduct]


class Meals(BaseModel):
    meals: list[Meal]


class MealIds(BaseModel):
    ids: list[int]
