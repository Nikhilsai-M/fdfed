import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddToCartButton from "./AddToCartButton";

const mocks = vi.hoisted(() => ({
  updateCart: vi.fn(),
  navigate: vi.fn(),
  addCartItem: vi.fn(),
}));

vi.mock("../context/CartContent", () => ({
  useCart: () => ({
    updateCart: mocks.updateCart,
  }),
}));

vi.mock("../services/cartApi", () => ({
  addCartItem: mocks.addCartItem,
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("AddToCartButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.addCartItem.mockResolvedValue({ cartCount: 1, items: [] });
    mocks.updateCart.mockResolvedValue({ cartCount: 1, items: [] });
    mocks.navigate.mockReset();
    vi.stubGlobal("alert", vi.fn());
  });

  const phoneProduct = {
    id: "1",
    type: "phone",
    model: "iPhone",
    ram: "8GB",
    rom: "128GB",
  };

  it("renders button", () => {
    render(<AddToCartButton product={phoneProduct} />);
    expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
  });

  it("adds item to cart and shows message", async () => {
    render(<AddToCartButton product={phoneProduct} />);

    fireEvent.click(screen.getByText(/add to cart/i));

    await waitFor(() => {
      expect(screen.getByText(/item added to cart/i)).toBeInTheDocument();
    });

    expect(mocks.addCartItem).toHaveBeenCalledWith({
      productType: "phone",
      productId: "1",
      quantity: 1,
    });
    expect(mocks.updateCart).toHaveBeenCalled();
  });

  it("infers laptop products from the series field", async () => {
    render(
      <AddToCartButton
        product={{ id: "lap-1", brand: "Dell", series: "XPS 13" }}
      />
    );

    fireEvent.click(screen.getByText(/add to cart/i));

    await waitFor(() => {
      expect(mocks.addCartItem).toHaveBeenCalledWith({
        productType: "laptop",
        productId: "lap-1",
        quantity: 1,
      });
    });
  });

  it("infers charger products from wattage and output current", async () => {
    render(
      <AddToCartButton
        product={{ id: "chg-1", wattage: "65", outputCurrent: "3A" }}
      />
    );

    fireEvent.click(screen.getByText(/add to cart/i));

    await waitFor(() => {
      expect(mocks.addCartItem).toHaveBeenCalledWith({
        productType: "charger",
        productId: "chg-1",
        quantity: 1,
      });
    });
  });

  it("redirects to sign in on unauthorized cart errors", async () => {
    mocks.addCartItem.mockRejectedValue({ status: 401, message: "Unauthorized" });

    render(<AddToCartButton product={phoneProduct} />);
    fireEvent.click(screen.getByText(/add to cart/i));

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith("/sign-in");
    });
    expect(global.alert).not.toHaveBeenCalled();
  });

  it("shows an alert for non-auth cart failures", async () => {
    mocks.addCartItem.mockRejectedValue({ status: 500, message: "Failed to add" });

    render(<AddToCartButton product={phoneProduct} />);
    fireEvent.click(screen.getByText(/add to cart/i));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Failed to add");
    });
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it("does not call the cart API when product type cannot be inferred", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<AddToCartButton product={{ id: "unknown-1", brand: "Mystery" }} />);
    fireEvent.click(screen.getByText(/add to cart/i));

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });
    expect(mocks.addCartItem).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it("allows dismissing the success message", async () => {
    render(<AddToCartButton product={phoneProduct} />);

    fireEvent.click(screen.getByText(/add to cart/i));

    await waitFor(() => {
      expect(screen.getByText(/view cart/i)).toBeInTheDocument();
    });

    fireEvent.click(document.querySelector(".fixed button"));

    await waitFor(() => {
      expect(screen.queryByText(/item added to cart/i)).not.toBeInTheDocument();
    });
  });
});
