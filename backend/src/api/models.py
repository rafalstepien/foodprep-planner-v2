from pydantic import BaseModel


class InputProduct(BaseModel):
    name: str
    protein: float
    carbohydrates: float
    fat: float
    kcal: float
    
    
class InputProducts(BaseModel):
    products: list[InputProduct]
    
    
class InputProductIds(BaseModel):
    ids: list[int]


class InputMealProduct(BaseModel):
    product_id: int
    product_amount: int


class InputMeal(BaseModel):
    name: str
    products: list[InputMealProduct]


class InputMeals(BaseModel):
    meals: list[InputMeal]


class InputMealIds(BaseModel):
    ids: list[int]



class OutputProduct(BaseModel):
    id: int
    product: str
    protein: float
    carbohydrates: float
    fat: float
    kcal: float


class OutputMealProduct(BaseModel):
    product_id: int
    amount: int


class OutputMeal(BaseModel):
    id: int
    name: str
    products: list[OutputMealProduct]
