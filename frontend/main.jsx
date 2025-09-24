import { createRoot } from "react-dom/client";
import Navbar from "./components/Navbar.tsx";
import ProductsSection from "./components/ProductsSection.tsx";
import MealsSection from "./components/MealsSection.tsx";
import PlanWeekSection from "./components/PlanWeekSection.tsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <>
    <Navbar />
    <div className="w-6/12 mx-auto flex flex-col items-center mt-10 mb-10 gap-10">
      <ProductsSection />
      <MealsSection />
      <PlanWeekSection />
    </div>
  </>,
);
