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

  async create(product: Product) {
    const response = await fetch(PRODUCTS_ENDPOINT, {
      method: "POST",
      headers: BASE_HEADERS,
      body: JSON.stringify({ products: [product] }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.status}`);
    }
  },

  async delete(productId: number) {
    const response = await fetch(PRODUCTS_ENDPOINT, {
      method: "DELETE",
      headers: BASE_HEADERS,
      body: JSON.stringify({ ids: [productId] }), // TODO: instead of passing it in body, pass in url
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.status}`);
    }
  },
};
