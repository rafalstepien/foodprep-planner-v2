import json
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, joinedload

from .models import Products as DatabaseProduct
from .models import Meals as DatabaseMeal
from .models import MealProducts as DatabaseMealProducts

from .dto import ProductDto, MealDto, AddProductsToMealDto, DeleteProductFromMealDto


class DatabaseClient:
    def __init__(self, database_file_path: Path):
        self.database_file_path = database_file_path
        self.engine = create_engine(
            f"sqlite:///{str(self.database_file_path)}", echo=False, future=True
        )
        self._session = sessionmaker(bind=self.engine, expire_on_commit=False)
        self.session = self._session()
    
    def add_product(self, product: ProductDto):
        db_product = DatabaseProduct(
            product=product.name,
            protein=product.protein,
            carbohydrates=product.carbohydrates,
            fat=product.fat,
            kcal=product.kcal,
        )
        self.session.add(db_product)
        self.session.commit()
    
    def get_all_products(self) -> list[dict]:
        return [p.as_dict() for p in self.session.query(DatabaseProduct).all()]

    def get_product_by_id(self, product_id: int) -> dict:
        p = self.session.query(DatabaseProduct)\
            .filter(DatabaseProduct.id == product_id)\
            .first()
        return p.as_dict()
        
    def delete_product(self, id: int):
        product = self.session.get(DatabaseProduct, id)
        if product:
            self.session.delete(product)
        self.session.commit()
        
    def add_meal(self, dto: MealDto):
        new_meal = DatabaseMeal(name=dto.name)
        self.session.add(new_meal)
        self.session.commit()
        return new_meal.id

    def delete_meal(self, id: int):
        meal = self.session.get(DatabaseMeal, id)
        if meal:
            self.session.delete(meal)
        self.session.commit()

    def get_all_meals(self) -> list[dict]:
        meals = self.session.query(DatabaseMeal)\
            .options(joinedload(DatabaseMeal.meal_products).joinedload(DatabaseMealProducts.products))\
            .all()
            
        return [
            {
                "id": meal.id,
                "name": meal.name,
                "products": [
                    self.get_product_by_id(p.product_id)
                    for p in meal.meal_products
                ]
            } for meal in meals
        ]
    
    def add_product_to_meal(self, dto: AddProductsToMealDto):
        db_meal = self.session.query(DatabaseMeal)\
            .filter(DatabaseMeal.id == dto.meal_id)\
            .first()
        
        new_product = DatabaseMealProducts(product_id=dto.product_id) # TODO: handle case when some product don't exist
        db_meal.meal_products.append(new_product)  # TODO: handle when product already exists in this meal (sqlalchemy.exc.IntegrityError: (sqlite3.IntegrityError) UNIQUE constraint failed: meals.name)
        self.session.add(db_meal)
        self.session.commit()

    def delete_product_from_meal(self, dto: DeleteProductFromMealDto):
        db_meal = self.session.query(DatabaseMeal)\
            .filter(DatabaseMeal.id == dto.meal_id)\
            .first()
        db_meal.meal_products = [
            p for p in db_meal.meal_products
            if p.product_id != dto.product_id
        ]
        self.session.add(db_meal)
        self.session.commit()
