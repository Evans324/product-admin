import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  it("calls onChange when the user types", async () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText(/search products/i), "k");
    expect(onChange).toHaveBeenCalledWith("k");
  });
});
