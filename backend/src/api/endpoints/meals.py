from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Response, status
from ..models import Meal, OutputMeal
from ...containers import Container
from ...database import DatabaseClient, MealDto, AddProductsToMealDto, DeleteProductFromMealDto


router = APIRouter()


@router.get("/meals")
@inject
async def get_all_meals(
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
) -> list[OutputMeal]:
    meals = db_client.get_all_meals()
    return [OutputMeal(**m) for m in meals]


@router.post("/meals")
@inject
async def add_meal(
    meal: Meal,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
) -> dict[str, str | int]:
    meal_id = db_client.add_meal(MealDto(name=meal.name))
    return {"id": str(meal_id), "name": meal.name}


@router.delete("/meals/{meal_id}")
@inject
async def delete_meal(
    meal_id: int,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    db_client.delete_meal(id=meal_id)
    return Response(status_code=status.HTTP_200_OK)


@router.put("/meals/{meal_id}/{product_id}")
@inject
async def add_product_to_meal(
    meal_id: int,
    product_id: int,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    dto = AddProductsToMealDto(
        meal_id=meal_id,
        product_id=product_id
    )
        
    db_client.add_product_to_meal(dto)
    return Response(status_code=status.HTTP_201_CREATED)


@router.delete("/meals/{meal_id}/{product_id}")
@inject
async def remove_products_from_meals(
    meal_id: int,
    product_id: int,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    dto = DeleteProductFromMealDto(
        meal_id=meal_id,
        product_id=product_id,
    )
    db_client.delete_product_from_meal(dto)
    return Response(status_code=status.HTTP_200_OK)
