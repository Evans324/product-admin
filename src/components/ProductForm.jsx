import { useState } from "react";

const empty = {
  name: "",
  price: "",
  category: "",
  image: "",
  description: "",
  stock: "",
};

export default function ProductForm({
  initialValues = empty,
  onSubmit,
  submitLabel = "Save",
  submitting = false,
}) {
  const [values, setValues] = useState({ ...empty, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!String(values.name).trim()) errs.name = "Name is required";
    if (values.price === "" || Number(values.price) <= 0)
      errs.price = "Price must be greater than 0";
    if (!String(values.category).trim()) errs.category = "Category is required";
    if (
      values.stock === "" ||
      !Number.isInteger(Number(values.stock)) ||
      Number(values.stock) < 0
    )
      errs.stock = "Stock must be a whole number, 0 or more";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      name: String(values.name).trim(),
      price: Number(values.price),
      category: String(values.category).trim(),
      image:
        String(values.image).trim() || "https://placehold.co/300x200?text=Product",
      description: String(values.description).trim(),
      stock: Number(values.stock),
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" value={values.name} onChange={handleChange} />
      {errors.name && <p className="field-error">{errors.name}</p>}

      <label htmlFor="price">Price</label>
      <input id="price" name="price" type="number" step="0.01" value={values.price} onChange={handleChange} />
      {errors.price && <p className="field-error">{errors.price}</p>}

      <label htmlFor="category">Category</label>
      <input id="category" name="category" value={values.category} onChange={handleChange} />
      {errors.category && <p className="field-error">{errors.category}</p>}

      <label htmlFor="stock">Stock</label>
      <input id="stock" name="stock" type="number" value={values.stock} onChange={handleChange} />
      {errors.stock && <p className="field-error">{errors.stock}</p>}

      <label htmlFor="image">Image URL</label>
      <input id="image" name="image" value={values.image} onChange={handleChange} />

      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" rows="3" value={values.description} onChange={handleChange} />

      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
