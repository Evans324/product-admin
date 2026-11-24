import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <section className="hero">
      <h1>Welcome to ProductAdmin</h1>
      <p>Manage your e-commerce catalogue: add, edit, search and remove products.</p>
      <Link className="btn" to="/products">View Products</Link>
    </section>
  );
}
