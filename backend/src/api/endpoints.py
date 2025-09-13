from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends

from ..containers import Container
from ..database.client import DatabaseClient

router = APIRouter()


@router.get("/products")
@inject
async def get_all_products(
    db_client: DatabaseClient = Depends(Provide[Container.db_client]),
):
    return db_client.get_all_products()
