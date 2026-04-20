import { render, screen } from "@testing-library/react";
import ProductSpecifications from "./ProductSpecifications";

describe("ProductSpecifications", () => {
  it("renders the shared heading", () => {
    render(
      <ProductSpecifications
        type="phone"
        product={{ specs: {}, ram: "8GB", rom: "128GB" }}
      />
    );

    expect(screen.getByText(/key specifications/i)).toBeInTheDocument();
  });

  it("renders phone specifications", () => {
    render(
      <ProductSpecifications
        type="phone"
        product={{
          specs: { processor: "A15", display: "6.1", battery: "3000", camera: "12MP", os: "iOS", network: "5G", weight: "171g" },
          ram: "8GB",
          rom: "128GB",
        }}
      />
    );

    expect(screen.getByText(/processor:/i)).toBeInTheDocument();
    expect(screen.getByText(/storage:/i)).toBeInTheDocument();
  });

  it("renders charger specifications", () => {
    render(
      <ProductSpecifications
        type="charger"
        product={{ wattage: "65", type: "USB-C", outputCurrent: "3A" }}
      />
    );

    expect(screen.getByText(/wattage:/i)).toBeInTheDocument();
    expect(screen.getByText(/output current:/i)).toBeInTheDocument();
  });

  it("renders mouse specifications", () => {
    render(
      <ProductSpecifications
        type="mouse"
        product={{ connectivity: "Wireless", resolution: "4000", type: "Laser" }}
      />
    );

    expect(screen.getByText(/connectivity:/i)).toBeInTheDocument();
    expect(screen.getByText(/resolution:/i)).toBeInTheDocument();
  });

  it("renders smartwatch specifications", () => {
    render(
      <ProductSpecifications
        type="smartwatch"
        product={{ displaySize: "45", displayType: "AMOLED", batteryRuntime: "18" }}
      />
    );

    expect(screen.getByText(/display size:/i)).toBeInTheDocument();
    expect(screen.getByText(/battery runtime:/i)).toBeInTheDocument();
  });

  it("renders earphone specifications", () => {
    render(
      <ProductSpecifications
        type="earphone"
        product={{ design: "In-ear", batteryLife: "8" }}
      />
    );

    expect(screen.getByText(/design:/i)).toBeInTheDocument();
    expect(screen.getByText(/battery life:/i)).toBeInTheDocument();
  });
});
