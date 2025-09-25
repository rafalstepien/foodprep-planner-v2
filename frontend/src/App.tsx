import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import ProductsSection from "../components/ProductsSection.tsx";
import MealsSection from "../components/MealsSection.tsx";
import PlanSection from "../components/PlanSection.tsx";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-5xl">
        <Routes>
          <Route path="/" element={<ProductsSection />} />
          <Route path="/products" element={<ProductsSection />} />
          <Route path="/meals" element={<MealsSection />} />
          <Route path="/plan" element={<PlanSection />} />
        </Routes>
      </div>
    </>
  );
}

// TODOS:
// - paste link / recipe -> AI infers products and suggest calories and microelements -> bulk add products
