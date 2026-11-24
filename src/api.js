export const API_URL = "http://localhost:3001/products";

export async function createProduct(product) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}
