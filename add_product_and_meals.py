"""
1. Iterate over products.json and add all products
2. Iterate over meals.json and add all meals

Via API calls
"""
from pathlib import Path
import json
import requests


BASE_BACKEND_URL = "http://localhost:8000"
PRODUCTS_ENDPOINT = "/products"

PRODUCTS_JSON_PATH = Path(__file__).parent / "database_data" / "products.json"


with open(PRODUCTS_JSON_PATH, "r") as f:
    data = json.load(f)


r = requests.post(BASE_BACKEND_URL + PRODUCTS_ENDPOINT, json={"products": data})
print(r)