import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ProductDetail from "../pages/ProductDetail";

const product = {
  id: "1",
  name: "Wireless Mouse",
  price: 25,
  category: "Accessories",
  image: "https://placehold.co/300x200",
  description: "Ergonomic mouse.",
  stock: 40,
};

const mockApi = () =>
  vi.spyOn(global, "fetch").mockImplementation(async (url, opts = {}) => {
    if (opts.method === "PATCH") {
      return { ok: true, json: async () => ({ ...product, ...JSON.parse(opts.body) }) };
    }
    if (opts.method === "DELETE") {
      return { ok: true, json: async () => ({}) };
    }
    return { ok: true, json: async () => product };
  });

const setup = () =>
  render(
    <MemoryRouter initialEntries={["/products/1"]}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/products" element={<p>Products page</p>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => mockApi());
afterEach(() => vi.restoreAllMocks());

describe("ProductDetail", () => {
  it("shows the product details", async () => {
    setup();
    expect(await screen.findByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
  });

  it("edits the price with a PATCH request", async () => {
    setup();
    await userEvent.click(await screen.findByRole("button", { name: "Edit" }));
    const price = screen.getByLabelText(/^price$/i);
    await userEvent.clear(price);
    await userEvent.type(price, "30");
    await userEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(await screen.findByText("$30.00")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/products/1"),
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("deletes the product and returns to the list", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    setup();
    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));

    expect(await screen.findByText("Products page")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/products/1"),
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("does not delete when the user cancels", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    setup();
    await userEvent.click(await screen.findByRole("button", { name: "Delete" }));
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
