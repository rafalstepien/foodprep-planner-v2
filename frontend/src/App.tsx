import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.tsx";
import ProductsSection from "./components/Products/Section.tsx";
import MealsSection from "./components/Meals/Section.tsx";
import PlanSection from "./components/Plan/Section.tsx";

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
