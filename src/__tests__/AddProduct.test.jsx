import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, describe, it, expect, afterEach } from "vitest";
import AddProduct from "../pages/AddProduct";
import { API_URL } from "../api";

afterEach(() => vi.restoreAllMocks());

const setup = () =>
  render(
    <MemoryRouter initialEntries={["/products/new"]}>
      <Routes>
        <Route path="/products/new" element={<AddProduct />} />
        <Route path="/products" element={<p>Products page</p>} />
      </Routes>
    </MemoryRouter>
  );

describe("AddProduct", () => {
  it("POSTs the new product and redirects to the list", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ id: "3" }),
    });
    setup();
    await userEvent.type(screen.getByLabelText(/^name$/i), "Webcam");
    await userEvent.type(screen.getByLabelText(/^price$/i), "45");
    await userEvent.type(screen.getByLabelText(/^category$/i), "Electronics");
    await userEvent.type(screen.getByLabelText(/^stock$/i), "10");
    await userEvent.click(screen.getByRole("button", { name: /add product/i }));

    expect(await screen.findByText("Products page")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      API_URL,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("shows an error when the request fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });
    setup();
    await userEvent.type(screen.getByLabelText(/^name$/i), "Webcam");
    await userEvent.type(screen.getByLabelText(/^price$/i), "45");
    await userEvent.type(screen.getByLabelText(/^category$/i), "Electronics");
    await userEvent.type(screen.getByLabelText(/^stock$/i), "10");
    await userEvent.click(screen.getByRole("button", { name: /add product/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/500/);
  });
});
