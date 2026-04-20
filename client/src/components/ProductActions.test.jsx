import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ProductActions from "./ProductActions";

describe("ProductActions", () => {
  it("renders add to cart and buy now buttons", () => {
    render(
      <ProductActions
        onAddToCart={() => {}}
        onBuyNow={() => {}}
        chargerId="c1"
      />
    );

    expect(screen.getByRole("button", { name: /add to cart/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buy now/i })).toBeInTheDocument();
  });

  it("calls onAddToCart when clicked", () => {
    const onAddToCart = vi.fn();

    render(
      <ProductActions onAddToCart={onAddToCart} onBuyNow={() => {}} chargerId="c1" />
    );

    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });

  it("calls onBuyNow when clicked", () => {
    const onBuyNow = vi.fn();

    render(
      <ProductActions onAddToCart={() => {}} onBuyNow={onBuyNow} chargerId="c1" />
    );

    fireEvent.click(screen.getByRole("button", { name: /buy now/i }));
    expect(onBuyNow).toHaveBeenCalledTimes(1);
  });
});
