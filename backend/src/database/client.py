import json
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .models import Products


class DatabaseClient:
    def __init__(self, database_file_path: Path):
        self.database_file_path = database_file_path
        self.engine = create_engine(
            f"sqlite:///{str(self.database_file_path)}", echo=False, future=True
        )

        self._session = sessionmaker(bind=self.engine, expire_on_commit=False)
        self.session = self._session()

    def populate_products_table(self, products_json: Path):
        with open(products_json, encoding="utf-8") as f:
            data = json.load(f)

        for entry in data:
            food = Products(
                product=entry["product"],
                protein=entry["protein"],
                carbohydrates=entry["carbohydrates"],
                fat=entry["fat"],
                kcal=entry["kcal"],
            )
            self.session.merge(food)  # upsert
        self.session.commit()

    def get_all_products(self):
        return [p.as_dict() for p in self.session.query(Products).all()]


# --- CRUD Examples ---
# # Create
# new_food = Food(produkt="Nowy produkt", bialko=10, weglowodany=20, tluszcz=5, kcal=150)
# session.add(new_food)
# session.commit()

# Read


# # Update
# food.kcal = 270
# session.commit()

# # Delete
# session.delete(food)
# session.commit()
