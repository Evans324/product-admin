import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import ProductForm from "../components/ProductForm";
import { API_URL, updateProduct, deleteProduct } from "../api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error, setData } = useFetch(`${API_URL}/${id}`);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState(null);

  if (loading) return <p>Loading product...</p>;
  if (error) {
    return (
      <section>
        <p role="alert">Could not load product: {error}</p>
        <Link to="/products">Back to products</Link>
      </section>
    );
  }

  const handleUpdate = async (changes) => {
    setSaving(true);
    setActionError(null);
    try {
      const updated = await updateProduct(id, changes);
      setData(updated);
      setEditing(false);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct(id);
      navigate("/products");
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <section>
      <Link to="/products">&larr; Back to products</Link>
      {actionError && (
        <p role="alert" className="field-error">Action failed: {actionError}</p>
      )}

      {editing ? (
        <>
          <h1>Edit {product.name}</h1>
          <ProductForm
            initialValues={product}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
            submitting={saving}
          />
          <button className="btn btn-secondary" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        <div className="detail">
          <img src={product.image} alt={product.name} />
          <div>
            <h1>{product.name}</h1>
            <p className="category">{product.category}</p>
            <p className="price">${Number(product.price).toFixed(2)}</p>
            <p>{product.description}</p>
            <p>In stock: {product.stock}</p>
            <div className="actions">
              <button className="btn" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
