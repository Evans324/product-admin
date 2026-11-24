export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="search"
      className="search"
      aria-label="Search products"
      placeholder="Search by name or category..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
