import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (product) => {
    setSaving(true);
    setError(null);
    try {
      await createProduct(product);
      navigate("/products");
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <section>
      <h1>Add Product</h1>
      {error && <p role="alert" className="field-error">Could not save: {error}</p>}
      <ProductForm onSubmit={handleSubmit} submitLabel="Add Product" submitting={saving} />
    </section>
  );
}
