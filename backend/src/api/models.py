from pydantic import BaseModel

# --------------- OPERATIONS ON PRODUCTS ---------------
class CreateProductData(BaseModel):
    name: str
    protein: float
    carbohydrates: float
    fat: float
    kcal: float


class InputProducts(BaseModel):
    products: list[CreateProductData]
    
    
class ProductsToDelete(BaseModel):
    ids: list[int]

# ---------------------------------------------------
# --------------- OPERATIONS ON MEALS ---------------
class CreateMealData(BaseModel):
    name: str


class InputMeals(BaseModel):
    meals: list[CreateMealData]


class MealsToDelete(BaseModel):
    ids: list[int]
    
# ------------------------------------------------------------------
# --------------- OPERATIONS ON PRODUCTS UNDER MEALS ---------------

class ProductWithAmount(BaseModel):
    product_id: int
    product_amount: int


class AddProductsToMealData(BaseModel):
    meal_id: int
    products: list[ProductWithAmount]
    

class InputMealProducts(BaseModel):
    meals: list[AddProductsToMealData]


class ProductsToDeleteFromMeal(BaseModel):
    meal_id: int
    product_ids: list[int]


class InputMealsProductsToDelete(BaseModel):
    meals: list[ProductsToDeleteFromMeal]

# ------------------------------------------------------------------


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
