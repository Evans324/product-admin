import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">ProductAdmin</NavLink>
      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/products" end>Products</NavLink>
        <NavLink to="/products/new">Add Product</NavLink>
      </div>
    </nav>
  );
}
