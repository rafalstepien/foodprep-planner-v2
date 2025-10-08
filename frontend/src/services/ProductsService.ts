const API_BASE_URL = "http://localhost:8000";
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

type Product = {
  name: string;
  protein: number;
  carbohydrates: number;
  fat: number;
  kcal: number;
};

type ReturnProduct = {
  id: number;
  product: string;
  protein: number;
  carbohydrates: number;
  fat: number;
  kcal: number;
};

const BASE_HEADERS = { "Content-Type": "application/json" };

export const productService = {
  async getAll(): Promise<ReturnProduct[]> {
    const response = await fetch(PRODUCTS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    return response.json(); // TODO: handle sqlalchemy.exc.IntegrityError: (sqlite3.IntegrityError) UNIQUE constraint failed: products.product
  },

  async getById(productId: number): Promise<ReturnProduct> {
    const response = await fetch(PRODUCTS_ENDPOINT + `/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    return response.json();
  },

  async create(product: Product): Promise<Product> {
    const response = await fetch(PRODUCTS_ENDPOINT, {
      method: "POST",
      headers: BASE_HEADERS,
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.status}`);
    }
    return response.json();
  },

  async delete(productId: number) {
    const response = await fetch(PRODUCTS_ENDPOINT + `/${productId}`, {
      method: "DELETE",
      headers: BASE_HEADERS,
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.status}`);
    }
  },
};
