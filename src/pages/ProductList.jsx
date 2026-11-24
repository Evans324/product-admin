import { useState } from "react";
import useFetch from "../hooks/useFetch";
import useDebounce from "../hooks/useDebounce";
import { API_URL } from "../api";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const { data: products, loading, error } = useFetch(API_URL);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p role="alert">Could not load products: {error}</p>;

  const term = debouncedQuery.trim().toLowerCase();
  const filtered = (products || []).filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(term)
  );

  return (
    <section>
      <h1>Products</h1>
      <SearchBar value={query} onChange={setQuery} />
      {filtered.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
