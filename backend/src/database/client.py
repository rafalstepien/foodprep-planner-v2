import json
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, joinedload

from .models import Products as DatabaseProduct
from .models import Meals as DatabaseMeal
from .models import MealProducts as DatabaseMealProducts

from .dto import ProductDto, EmptyMealDto, AddProductsToMealDto, MealProductsToDelete


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
            food = DatabaseProduct(
                product=entry["product"],
                protein=entry["protein"],
                carbohydrates=entry["carbohydrates"],
                fat=entry["fat"],
                kcal=entry["kcal"],
            )
            self.session.merge(food)  # upsert
        self.session.commit()
    
    def get_all_products(self) -> list[dict]:
        return [p.as_dict() for p in self.session.query(DatabaseProduct).all()]
    
    def get_one_product(self, product_id: int) -> dict:
        p = self.session.query(DatabaseProduct)\
            .filter(DatabaseProduct.id == product_id)\
            .first()
        return p.as_dict()
    
    def get_all_meals(self) -> list[dict]:
        meals = self.session.query(DatabaseMeal)\
            .options(joinedload(DatabaseMeal.meal_products).joinedload(DatabaseMealProducts.products))\
            .all()
            
        return [
            {
                "id": meal.id,
                "name": meal.name,
                "products": [
                    self.get_one_product(p.product_id)
                    for p in meal.meal_products
                ]
            } for meal in meals
        ]
    
    def add_products(self, product_dto_array: list[ProductDto]):
        for pd in product_dto_array:
            new_product = DatabaseProduct(
                product=pd.name,
                protein=pd.protein,
                carbohydrates=pd.carbohydrates,
                fat=pd.fat,
                kcal=pd.kcal,
            )
            self.session.merge(new_product)
        self.session.commit()
        
    def delete_products(self, product_ids: list[int]):
        for _id in product_ids:
            product = self.session.get(DatabaseProduct, _id)
            if product:
                self.session.delete(product)
        self.session.commit()
    
    def add_products_to_meals(self, meals_dto_array: list[AddProductsToMealDto]):
        for request_meal in meals_dto_array:
            db_meal = self.session.query(DatabaseMeal)\
                .filter(DatabaseMeal.id == request_meal.meal_id)\
                .first()
                
            new_products = [
                DatabaseMealProducts(product_id=p_id) for p_id in request_meal.products  # TODO: handle case when some product don't exist
            ]
            db_meal.meal_products += new_products
            self.session.merge(db_meal)
        self.session.commit()
        # # TODO: handle sqlalchemy.exc.IntegrityError: (sqlite3.IntegrityError) UNIQUE constraint failed: meals.name

        
    def add_empty_meal(self, meals_dto_array: list[EmptyMealDto]):
        for m in meals_dto_array:
            new_meal = DatabaseMeal(name=m.name)
            self.session.merge(new_meal)
        self.session.commit()

    def delete_meals(self, meal_ids: list[int]):
        for _id in meal_ids:
            meal = self.session.get(DatabaseMeal, _id)
            if meal:
                self.session.delete(meal)
        self.session.commit()
        
    def delete_products_from_meals(self, meals_products_dto_array: list[MealProductsToDelete]):
        for request_meal in meals_products_dto_array:
            db_meal = self.session.query(DatabaseMeal)\
                .filter(DatabaseMeal.id == request_meal.meal_id)\
                .first()
            
            new_products = [
                p for p in db_meal.meal_products
                if p.product_id not in request_meal.product_ids
            ]
            
            db_meal.meal_products = new_products
            self.session.merge(db_meal)
        self.session.commit()
