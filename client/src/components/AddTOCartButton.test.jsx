import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddToCartButton from "./AddToCartButton";

// mocks
vi.mock("../context/CartContent", () => ({
  useCart: () => ({
    updateCart: vi.fn(),
  }),
}));

vi.mock("../services/cartApi", () => ({
  addCartItem: vi.fn(() => Promise.resolve({ items: [] })),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }) => <div>{children}</div>,
}));

describe("AddToCartButton", () => {
  const product = {
    id: "1",
    type: "phone",
    model: "iPhone",
    ram: "8GB",
    rom: "128GB",
  };

  it("renders button", () => {
    render(<AddToCartButton product={product} />);
    expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
  });

  it("adds item to cart and shows message", async () => {
    render(<AddToCartButton product={product} />);

    fireEvent.click(screen.getByText(/add to cart/i));

    await waitFor(() => {
      expect(screen.getByText(/item added to cart/i)).toBeInTheDocument();
    });
  });
});