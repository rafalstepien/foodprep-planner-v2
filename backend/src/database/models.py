from sqlalchemy import Column, Float, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Products(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    product = Column(String, unique=True, nullable=False)
    protein = Column(Float, nullable=False)
    carbohydrates = Column(Float, nullable=False)
    fat = Column(Float, nullable=False)
    kcal = Column(Float, nullable=False)

    meal_products = relationship("MealProducts", back_populates="products")

    def as_dict(self) -> dict:
        return {
            "id": self.id,
            "product": self.product,
            "protein": self.protein,
            "carbohydrates": self.carbohydrates,
            "fat": self.fat,
            "kcal": self.kcal,
        }


class Meals(Base):
    __tablename__ = "meals"
    id = Column(Integer, primary_key=True, autoincrement=True)

    name = Column(String, unique=True, nullable=False)
    
    meal_products = relationship("MealProducts", back_populates="meals", cascade="all, delete-orphan")
    
    def as_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
        }
    
    
class MealProducts(Base):
    __tablename__ = "meal_products"
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    meal_id = Column(Integer, ForeignKey("meals.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    
    meals = relationship("Meals", back_populates="meal_products")
    products = relationship("Products", back_populates="meal_products")
    
    def as_dict(self) -> dict:
        return {
            "product_id": self.product_id,
            "amount": self.amount,
        }
    
    