import { useState, useEffect } from "react";

function AddProductForm() {
    const [product, setProduct] = useState({
        product: "",
        protein: "",
        carbohydrates: "",
        fat: "",
        kcal: "",
    });

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // convert numeric fields to numbers
        const newProduct = {
            ...product,
            protein: Number(product.protein),
            carbohydrates: Number(product.carbohydrates),
            fat: Number(product.fat),
            kcal: Number(product.kcal),
        };
        onAdd(newProduct);
        setProduct({ product: "", protein: "", carbohydrates: "", fat: "", kcal: "" });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-6/12 p-6 bg-white rounded-2xl shadow-md flex flex-col gap-4"
        >
            <h2 className="text-lg font-bold">Add Product</h2>
            <div className="text-sm">Protein, carbs, fat and calories per 100g of product</div>
            <div class="grid gap-3 mb-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
                <div>
                    {/* <label for="product_name" className="block mb-2 text-sm font-medium text-gray-900"></label> */}
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
                    {/* <label for="protein" className="block mb-2 text-sm font-medium text-gray-900"></label> */}
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
                    {/* <label for="carbohydrates" className="block mb-2 text-sm font-medium text-gray-900"></label> */}
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
                    {/* <label for="fat" className="block mb-2 text-sm font-medium text-gray-900"></label> */}
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
                    {/* <label for="kcal" className="block mb-2 text-sm font-medium text-gray-900"></label> */}
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
    )
}


export default function ProductsTable() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMeals() {
            try {
                const response = await fetch("http://localhost:8000/products"); // your API endpoint
                if (!response.ok) throw new Error("Failed to fetch");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchMeals();
    }, []); // empty deps = run once on mount

    async function handleAddProduct(newProduct) {
        await fetch("http://localhost:8000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newProduct),
        });
        fetchProducts(); // refresh table
    }




    if (loading) return <p>Loading...</p>;

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
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((meal, i) => (
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
                <AddProductForm onAdd={handleAddProduct} />
            </div>
        </>
    );
}