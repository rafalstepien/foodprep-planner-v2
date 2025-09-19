import { createRoot } from "react-dom/client";
import Header from "./components/Header.jsx";
import ProductsComponent from "./components/ProductsComponent.jsx";
import MealsComponent from "./components/MealsComponent.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <>
    <Header />
    <ProductsComponent />
    <MealsComponent />
  </>,
);
