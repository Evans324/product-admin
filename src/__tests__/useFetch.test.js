import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, afterEach } from "vitest";
import useFetch from "../hooks/useFetch";

afterEach(() => vi.restoreAllMocks());

describe("useFetch", () => {
  it("returns data after a successful request", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => [{ id: "1" }],
    });
    const { result } = renderHook(() => useFetch("/x"));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([{ id: "1" }]);
    expect(result.current.error).toBeNull();
  });

  it("sets an error when the request fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });
    const { result } = renderHook(() => useFetch("/x"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/500/);
  });
});
