from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Response, status

from .models import MealsToDelete, InputMeals, InputProducts, MealsToDelete, ProductsToDelete, OutputProduct, OutputMeal, InputMealProducts, InputMealsProductsToDelete
from ..containers import Container
from ..database import DatabaseClient, EmptyMealDto, ProductDto, AddProductsToMealDto, MealProductsToDelete

router = APIRouter()

# ----------- PRODUCTS -----------
@router.get("/products")
@inject
async def get_all_products(
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
) -> list[OutputProduct]:
    products = db_client.get_all_products()
    return [OutputProduct(**p) for p in products]


@router.get("/products/{id}")
@inject
async def get_one_product_data(
    id: int,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
) -> OutputProduct:
    return db_client.get_one_product(id)


@router.post("/products")
@inject
async def add_product(
    products: InputProducts,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    products_dto_array = [
        ProductDto(
            name=p.name,
            protein=p.protein,
            carbohydrates=p.carbohydrates,
            fat=p.fat,
            kcal=p.kcal,
        )
        for p in products.products
    ]
    db_client.add_products(products_dto_array)
    return Response(status_code=status.HTTP_201_CREATED)


@router.delete("/products")
@inject
async def delete_product(
    product_ids: ProductsToDelete,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    product_ids = [_id for _id in product_ids.ids]
    db_client.delete_products(product_ids=product_ids)
    return Response(status_code=status.HTTP_200_OK)


# ----------- MEALS -----------

@router.get("/meals")
@inject
async def get_all_meals(
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
) -> list[OutputMeal]:
    meals = db_client.get_all_meals()
    return [OutputMeal(**m) for m in meals]


@router.delete("/meals")
@inject
async def delete_meals(
    meal_ids: MealsToDelete,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    meal_ids = [_id for _id in meal_ids.ids]
    db_client.delete_meals(meal_ids=meal_ids)
    return Response(status_code=status.HTTP_200_OK)


@router.post("/meals")
@inject
async def add_empty_meal(
    meals: InputMeals,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    meals_dto_array = [
        EmptyMealDto(
            name=m.name,
        ) for m in meals.meals
    ]
    db_client.add_empty_meal(meals_dto_array)
    return Response(status_code=status.HTTP_201_CREATED)


@router.put("/meals")
@inject
async def add_product_to_meal(
    meal_products: InputMealProducts,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    products_per_meal_dto_array = [
        AddProductsToMealDto(
            meal_id=meal.meal_id,
            products=[product_id for product_id in meal.products],
        )
        for meal in meal_products.meals
    ]
        
    db_client.add_products_to_meals(products_per_meal_dto_array)
    return Response(status_code=status.HTTP_201_CREATED)


@router.delete("/meals_products")
@inject
async def remove_products_from_meals(
    meals_products_ids: InputMealsProductsToDelete,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    meals_products_to_delete_dto = [
        MealProductsToDelete(
            meal_id=mp.meal_id,
            product_ids=mp.product_ids,
        )
        for mp in meals_products_ids.meals
    ]
    db_client.delete_products_from_meals(meals_products_to_delete_dto)
    return Response(status_code=status.HTTP_200_OK)
    


@router.get("/healthcheck")
async def healthcheck() -> dict:
    return {"message": "OK"}
