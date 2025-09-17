import { createRoot } from "react-dom/client";
import Header from "./components/Header.jsx";
import MealsTable from "./components/ProductsComponent.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <>
    <Header />
    <MealsTable />
  </>,
);
