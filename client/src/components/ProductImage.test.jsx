import { render, screen } from "@testing-library/react";

vi.mock("../utils/api", () => ({
  buildAssetUrl: vi.fn((path) => `https://cdn.test${path}`),
}));

import ProductImage from "./ProductImage";

describe("ProductImage", () => {
  it("renders the product image with alt text", () => {
    render(<ProductImage image="/phone.png" alt="Phone image" />);

    expect(screen.getByAltText("Phone image")).toHaveAttribute(
      "src",
      "https://cdn.test/phone.png"
    );
  });

  it("renders the condition badge when provided", () => {
    render(<ProductImage image="/phone.png" alt="Phone image" condition="Excellent" />);

    expect(screen.getByText(/excellent condition/i)).toBeInTheDocument();
  });

  it("omits the condition badge when not provided", () => {
    render(<ProductImage image="/phone.png" alt="Phone image" />);

    expect(screen.queryByText(/condition/i)).not.toBeInTheDocument();
  });
});
