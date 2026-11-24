import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="card">
      <img src={product.image} alt={product.name} />
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="category">{product.category}</p>
        <p className="price">${Number(product.price).toFixed(2)}</p>
        <Link className="btn" to={`/products/${product.id}`}>View</Link>
      </div>
    </article>
  );
}
