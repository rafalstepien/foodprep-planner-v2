import { Routes, Route, Link } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import ProductsSection from "../components/ProductsSection.tsx";
import MealsSection from "../components/MealsSection.tsx";
import PlanWeekSection from "../components/PlanWeekSection.tsx";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-4xl">
        <Routes>
          <Route path="/" element={<ProductsSection />} />
          <Route path="/products" element={<ProductsSection />} />
          <Route path="/meals" element={<MealsSection />} />
          <Route path="/plan" element={<PlanWeekSection />} />
        </Routes>
      </div>
    </>
  );
}
