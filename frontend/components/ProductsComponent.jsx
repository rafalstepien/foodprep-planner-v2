import { useState, useEffect, useCallback } from "react";

// TODO: move to env file
const API_BASE_URL = 'http://localhost:8000';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

const EMPTY_PRODUCT = {
  name: "",
  protein: "",
  carbohydrates: "",
  fat: "",
  kcal: "",
};


const productService = {
  async getAll() {
    const response = await fetch(PRODUCTS_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    console.log("Result of productService.getAll()")
    console.log(response)
    return response.json();  // TODO: handle sqlalchemy.exc.IntegrityError: (sqlite3.IntegrityError) UNIQUE constraint failed: products.product
  },

  async create(product) {
    const response = await fetch(PRODUCTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: [product] }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.status}`);
    }
  },

  async delete(productId) {
    const response = await fetch(PRODUCTS_ENDPOINT, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [productId] }),
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.status}`);
    }
  }
};

// Custom Hook for Products
function useProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setError(null);
    try {
      const data = await productService.getAll();
      console.log("Inside useProducts(), result data:")
      console.log(data)
      setProducts(data);
    } catch (err) {
      console.log("error")
      console.log(err)
      setError(err.message);
    }
  }, []);

  const addProduct = useCallback(async (product) => {
    setError(null);
    try {
      const newProduct = {
        name: product.name,
        protein: Number(product.protein),
        carbohydrates: Number(product.carbohydrates),
        fat: Number(product.fat),
        kcal: Number(product.kcal),
      };
      
      await productService.create(newProduct);
      console.log("Trying to fetch products...")
      await fetchProducts();  // TODO: nie refreshuje
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw for form handling
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (productId) => {
    setError(null);
    try {
      // Optimistic update
      setProducts(prev => prev.filter(p => p.id !== productId));
      await productService.delete(productId);
    } catch (err) {
      setError(err.message);
      // Revert optimistic update on error
      await fetchProducts();
    }
  }, [fetchProducts]);

  return {
    products,
    error,
    fetchProducts,
    addProduct,
    deleteProduct,
  };
}


function DeleteButton({ productId, onDelete }) {
  return (
    <button
      type="button"
      onClick={() => onDelete(productId)}
      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Delete
    </button>
  );
}

function ProductsTable({ products, onDelete }) {
  return (
    <div className="w-6/12 overflow-x-auto rounded-2xl shadow">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Protein (g)</th>
            <th className="px-4 py-2">Carbs (g)</th>
            <th className="px-4 py-2">Fat (g)</th>
            <th className="px-4 py-2">Kcal</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                No products found. Add your first product below!
              </td>
            </tr>
          ) : (
            products.map((product, i) => (
              <tr
                key={product.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 font-medium">{product.product}</td>
                <td className="px-4 py-2">{product.protein}</td>
                <td className="px-4 py-2">{product.carbohydrates}</td>
                <td className="px-4 py-2">{product.fat}</td>
                <td className="px-4 py-2">{product.kcal}</td>
                <td className="px-4 py-2">
                  <DeleteButton 
                    productId={product.id} 
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ProductForm({ onSubmit }) {
  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(product);
      setProduct(EMPTY_PRODUCT);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent";

  return (
    <div className="w-6/12 p-6 bg-white rounded-2xl shadow-md flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-800">Add Product</h2>
      <p className="text-sm text-gray-600">
        Enter nutritional values per 100g of product
      </p>
      
      <div className="grid gap-3 mb-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={product.name}
          onChange={handleChange}
          className={inputClassName}
          required
          disabled={isSubmitting}
        />
        <input
          type="number"
          name="protein"
          placeholder="Protein (g)"
          value={product.protein}
          onChange={handleChange}
          className={inputClassName}
          min="0"
          step="0.1"
          required
          disabled={isSubmitting}
        />
        <input
          type="number"
          name="carbohydrates"
          placeholder="Carbs (g)"
          value={product.carbohydrates}
          onChange={handleChange}
          className={inputClassName}
          min="0"
          step="0.1"
          required
          disabled={isSubmitting}
        />
        <input
          type="number"
          name="fat"
          placeholder="Fat (g)"
          value={product.fat}
          onChange={handleChange}
          className={inputClassName}
          min="0"
          step="0.1"
          required
          disabled={isSubmitting}
        />
        <input
          type="number"
          name="kcal"
          placeholder="Calories"
          value={product.kcal}
          onChange={handleChange}
          className={inputClassName}
          min="0"
          step="1"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        onClick={handleSubmit}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Adding...' : 'Add Product'}
      </button>
    </div>
  );
}

function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="w-6/12 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <span>{error}</span>
        <button 
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function ProductsComponent() {
  const { products, error, fetchProducts, addProduct, deleteProduct } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDismissError = () => {
    // In a real app, you'd have error state management here
  };

  return (
    <div className="flex flex-col items-center mt-10 mb-10 gap-4">
      <ErrorMessage error={error} onDismiss={handleDismissError} />
      
      <ProductsTable 
        products={products} 
        onDelete={deleteProduct}
      />
      
      <ProductForm 
        onSubmit={addProduct}
      />
    </div>
  );
}