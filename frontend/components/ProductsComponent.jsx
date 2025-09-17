import { useState, useEffect } from "react";

function ProductsTable({ productsData }) {
  return (
    <div className="w-6/12 overflow-x-auto rounded-2xl shadow">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Protein</th>
            <th className="px-4 py-2">Carbs</th>
            <th className="px-4 py-2">Fat</th>
            <th className="px-4 py-2">Kcal</th>
          </tr>
        </thead>
        <tbody>
          {productsData.map((meal, i) => (
            <tr
              key={meal.id}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-2">{meal.product}</td>
              <td className="px-4 py-2">{meal.protein}</td>
              <td className="px-4 py-2">{meal.carbohydrates}</td>
              <td className="px-4 py-2">{meal.fat}</td>
              <td className="px-4 py-2">{meal.kcal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = {
      name: product.product,
      protein: Number(product.protein),
      carbohydrates: Number(product.carbohydrates),
      fat: Number(product.fat),
      kcal: Number(product.kcal),
    };
    const products = {"products": [newProduct]}
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

  useEffect(() => {
    fetchMeals();
  }, [refresh]);

  return (
    <>
      <div className="flex flex-col items-center mt-10 mb-10 gap-4">
        <ProductsTable productsData={productsData} />
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
