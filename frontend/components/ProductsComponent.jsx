import { useState, useEffect } from "react";


const BACKEND_BASE_URL = "http://localhost:8000"
const PRODUCTS_ENDPOINT = BACKEND_BASE_URL + "/products"
const EMPTY_PRODUCT = {
    product: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    kcal: "",
  };


export default function ProductsComponent() {


  const [product, setProduct] = useState(EMPTY_PRODUCT);
  const [refresh, setRefresh] = useState(0);
  const [productsData, setProductsData] = useState([]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    backendGetAllProducts();
  }, [refresh]);

  async function backendAddProduct(newProduct) {
    try {
      const response = await fetch(PRODUCTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to save the product", error);
    }
  }

  async function backendDeleteProduct(productId) {
    try {
      const response = await fetch(PRODUCTS_ENDPOINT, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [productId] }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete the product", error);
    }
    setRefresh((prev) => prev + 1);
  }

  async function backendGetAllProducts() {
    try {
      const response = await fetch(PRODUCTS_ENDPOINT);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProductsData(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      products: {
        name: product.product,
        protein: Number(product.protein),
        carbohydrates: Number(product.carbohydrates),
        fat: Number(product.fat),
        kcal: Number(product.kcal),
      }
    };
    backendAddProduct(newProduct);
    setProduct(EMPTY_PRODUCT);
    setRefresh((prev) => prev + 1);
  };

  function DeleteButton({ productId }) {
    return (
      <button
        type="button"
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={() => backendDeleteProduct(productId)}
      >
        Delete
      </button>
    );
  }


  return (
    <>
      <div className="flex flex-col items-center mt-10 mb-10 gap-4">
        <div className="w-6/12 overflow-x-auto rounded-2xl shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Protein</th>
                <th className="px-4 py-2">Carbs</th>
                <th className="px-4 py-2">Fat</th>
                <th className="px-4 py-2">Kcal</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {productsData.map((product, i) => (
                <tr
                  key={product.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2">{product.product}</td>
                  <td className="px-4 py-2">{product.protein}</td>
                  <td className="px-4 py-2">{product.carbohydrates}</td>
                  <td className="px-4 py-2">{product.fat}</td>
                  <td className="px-4 py-2">{product.kcal}</td>
                  <td className="px-4 py-2">
                    <DeleteButton productId={product.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-6/12 p-6 bg-white rounded-2xl shadow-md flex flex-col gap-4"
        >
          <h2 className="text-lg font-bold">Add Product</h2>
          <div className="text-sm">
            Protein, carbs, fat and calories per 100g of product
          </div>
          <div className="grid gap-3 mb-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
            <div>
              <input
                type="text"
                id="product_name"
                name="product"
                placeholder="Product"
                value={product.product}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="protein"
                id="protein"
                placeholder="Protein (g)"
                value={product.protein}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="carbohydrates"
                id="carbohydrates"
                placeholder="Carbs (g)"
                value={product.carbohydrates}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <input
                type="number"
                name="fat"
                id="fat"
                placeholder="Fat (g)"
                value={product.fat}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <input
                type="number"
                id="kcal"
                name="kcal"
                placeholder="Calories"
                value={product.kcal}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-black text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}
