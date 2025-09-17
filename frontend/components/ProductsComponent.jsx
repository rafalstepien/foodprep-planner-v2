import { useState, useEffect } from "react";

export default function ProductsComponent() {
  const emptyProduct = {
    product: "",
    protein: "",
    carbohydrates: "",
    fat: "",
    kcal: "",
  };

  const [product, setProduct] = useState(emptyProduct);
  const [refresh, setRefresh] = useState(0);
  const [productsData, setProductsData] = useState([]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  async function sendNewProductToBackend(products) {
    try {
      const response = await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to save the product", error);
    }
  }

  async function sendDeleteRequestToBackend(productId) {
    try {
      const response = await fetch("http://localhost:8000/products", {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      name: product.product,
      protein: Number(product.protein),
      carbohydrates: Number(product.carbohydrates),
      fat: Number(product.fat),
      kcal: Number(product.kcal),
    };
    const products = { products: [newProduct] };
    sendNewProductToBackend(products);
    setProduct(emptyProduct);
    setRefresh((prev) => prev + 1);
  };

  async function fetchMeals() {
    try {
      const response = await fetch("http://localhost:8000/products");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setProductsData(data);
    } catch (error) {
      console.error(error);
    }
  }

  function DeleteButton({ productId }) {
    return (
      <button
        type="button"
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        onClick={() => sendDeleteRequestToBackend(productId)}
      >
        Delete
      </button>
    );
  }

  useEffect(() => {
    fetchMeals();
  }, [refresh]);

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
