from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Response, status

from .models import InputMealIds, InputMeals, InputProducts, InputMealIds, InputProductIds, OutputProduct, OutputMeal
from ..containers import Container
from ..database import DatabaseClient, MealDto, ProductDto, MealProductDto

router = APIRouter()

# ----------- PRODUCTS -----------
@router.get("/products")
@inject
async def get_all_products(
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
) -> list[OutputProduct]:
    products = db_client.get_all_products()
    return [OutputProduct(**p) for p in products]


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
    product_ids: InputProductIds,
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
    meal_ids: InputMealIds,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    meal_ids = [_id for _id in meal_ids.ids]
    db_client.delete_meals(meal_ids=meal_ids)
    return Response(status_code=status.HTTP_200_OK)


@router.post("/meals")
@inject
async def add_meal(
    meals: InputMeals,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    meals_dto_array = [
        MealDto(
            name=m.name,
            products=[
                MealProductDto(
                    product_id=mp.product_id,
                    product_amount=mp.product_amount,
                )
                for mp in m.products
            ]
        ) for m in meals.meals
    ]
    db_client.add_meals(meals_dto_array)
    return Response(status_code=status.HTTP_201_CREATED)
