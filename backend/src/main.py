from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import meals_router, products_router
from .containers import Container
from .settings import Settings


def create_app() -> FastAPI:
    container = Container()
    settings = Settings()
    container.config.from_pydantic(settings)

    app = FastAPI()
    app.container = container
    app.include_router(products_router)
    app.include_router(meals_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # TODO: update to only accept traffic from frontend
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = create_app()
