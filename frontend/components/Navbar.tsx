import { Link } from "react-router-dom";

function AppLogoAndName() {
  return (
    <div className="flex-1 flex justify-center items-center space-x-2">
      <img
        className="header-img"
        src="https://cdn-icons-png.flaticon.com/512/62/62673.png"
        alt="chef logo"
      ></img>
      <span className="header-text">Week Diet Planner</span>
    </div>
  );
}

function MenuLinks() {
  const linkClassName =
    "transition delay-50 duration-500 ease-in-out hover:-translate-y-1 hover:scale-110 ...";
  return (
    <div className="flex-1 flex justify-center items-center space-x-10">
      <Link to="/products" className={linkClassName}>
        Products
      </Link>
      <Link to="/meals" className={linkClassName}>
        Meals
      </Link>
      <Link to="/plan" className={linkClassName}>
        Plan
      </Link>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="navbar flex flex-row items-center justify-between px-4 py-2 bg-gray-100 ">
      <div className="flex-1"></div>
      <AppLogoAndName />
      <MenuLinks />
    </nav>
  );
}
