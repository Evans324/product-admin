import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import ProductForm from "../components/ProductForm";

describe("ProductForm", () => {
  it("shows validation errors and does not submit when empty", async () => {
    const onSubmit = vi.fn();
    render(<ProductForm onSubmit={onSubmit} submitLabel="Add" />);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Price must be greater than 0")).toBeInTheDocument();
    expect(screen.getByText("Category is required")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits cleaned values when valid", async () => {
    const onSubmit = vi.fn();
    render(<ProductForm onSubmit={onSubmit} submitLabel="Add" />);
    await userEvent.type(screen.getByLabelText(/^name$/i), "Webcam");
    await userEvent.type(screen.getByLabelText(/^price$/i), "45");
    await userEvent.type(screen.getByLabelText(/^category$/i), "Electronics");
    await userEvent.type(screen.getByLabelText(/^stock$/i), "10");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Webcam", price: 45, category: "Electronics", stock: 10 })
    );
  });
});
