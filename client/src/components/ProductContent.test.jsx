import { render, screen } from "@testing-library/react";
import ProductContent from "./ProductContent";

describe("ProductContent", () => {
  const product = {
    brand: "Apple",
    model: "iPhone 13",
    condition: "Excellent",
    ram: "8GB",
    rom: "128GB",
    specs: {
      processor: "A15",
      display: "6.1 inch",
      battery: "3000",
      camera: "12MP",
      os: "iOS",
      network: "5G",
    },
  };

  it("renders phone description", () => {
    render(<ProductContent product={product} type="phone" />);

    expect(screen.getByText(/iphone 13/i)).toBeInTheDocument();
    expect(screen.getByText(/powerful performance/i)).toBeInTheDocument();
  });

  it("renders features section", () => {
    render(<ProductContent product={product} type="phone" />);

    expect(screen.getByText(/highlight features/i)).toBeInTheDocument();
  });
});