import { createRoot } from "react-dom/client"
import Header from "./components/Header.jsx"
import MealsTable from "./components/ProductsTable.jsx"

const root = createRoot(document.getElementById("root"))


root.render(
    <>
        <Header />
        <MealsTable />
    </>
)