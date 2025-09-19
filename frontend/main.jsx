import { createRoot } from "react-dom/client";
import Header from "./components/Header.jsx";
import ProductsComponent from "./components/ProductsComponent.jsx";
import MealsComponent from "./components/MealsComponent.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <>
    <Header />
    <div className="w-6/12 mx-auto flex flex-col items-center mt-10 mb-10 gap-4">
      <ProductsComponent />
      <MealsComponent />
    </div>
  </>,
);
