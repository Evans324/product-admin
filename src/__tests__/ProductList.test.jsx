import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ProductList from "../pages/ProductList";

const products = [
  { id: "1", name: "Wireless Mouse", price: 25, category: "Accessories", image: "https://placehold.co/300x200", description: "", stock: 4 },
  { id: "2", name: "Mechanical Keyboard", price: 80, category: "Accessories", image: "https://placehold.co/300x200", description: "", stock: 9 },
];

beforeEach(() => {
  vi.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => products });
});
afterEach(() => vi.restoreAllMocks());

const setup = () =>
  render(
    <MemoryRouter>
      <ProductList />
    </MemoryRouter>
  );

describe("ProductList", () => {
  it("shows products from the API", async () => {
    setup();
    expect(await screen.findByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
  });

  it("filters products as the user searches", async () => {
    setup();
    await screen.findByText("Wireless Mouse");
    await userEvent.type(screen.getByLabelText(/search products/i), "key");
    await waitFor(() =>
      expect(screen.queryByText("Wireless Mouse")).not.toBeInTheDocument()
    );
    expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
  });

  it("shows a message when nothing matches", async () => {
    setup();
    await screen.findByText("Wireless Mouse");
    await userEvent.type(screen.getByLabelText(/search products/i), "zzz");
    expect(await screen.findByText(/no products found/i)).toBeInTheDocument();
  });
});
