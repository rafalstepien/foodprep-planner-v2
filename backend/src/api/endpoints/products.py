from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, Response, status

from ..models import Product, OutputProduct
from ...containers import Container
from ...database import DatabaseClient, ProductDto


router = APIRouter()


@router.get("/products")
@inject
async def get_all_products(
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
) -> list[OutputProduct]:
    products = db_client.get_all_products()
    return [OutputProduct(**p) for p in products]


@router.get("/products/{id}")
@inject
async def get_product_by_id(
    id: int,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
) -> OutputProduct:
    return db_client.get_product_by_id(id)


@router.post("/products")
@inject
async def add_product(
    product: Product,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
) -> Product:
    product_dto = ProductDto(
        name=product.name,
        protein=product.protein,
        carbohydrates=product.carbohydrates,
        fat=product.fat,
        kcal=product.kcal,
    )
    db_client.add_product(product_dto)
    return product


@router.delete("/products/{id}")
@inject
async def delete_product(
    id: int,
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    db_client.delete_product(id)
    return Response(status_code=status.HTTP_200_OK)

