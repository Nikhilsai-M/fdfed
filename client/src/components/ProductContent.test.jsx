import { render, screen } from "@testing-library/react";
import ProductContent from "./ProductContent";

describe("ProductContent", () => {
  const phoneProduct = {
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
    render(<ProductContent product={phoneProduct} type="phone" />);

    expect(screen.getByText(/iphone 13/i)).toBeInTheDocument();
    expect(screen.getByText(/capture stunning photos/i)).toBeInTheDocument();
  });

  it("renders features section", () => {
    render(<ProductContent product={phoneProduct} type="phone" />);

    expect(screen.getByText(/highlight features/i)).toBeInTheDocument();
  });

  it("renders phone in-box items", () => {
    render(<ProductContent product={phoneProduct} type="phone" />);

    expect(screen.getByText(/what's in the box/i)).toBeInTheDocument();
    expect(screen.getByText(/^smartphone$/i)).toBeInTheDocument();
    expect(screen.getByText(/adapter/i)).toBeInTheDocument();
  });

  it("renders laptop-specific content and warranty", () => {
    render(
      <ProductContent
        product={{
          brand: "Dell",
          series: "XPS 13",
          condition: "Good",
          processor: { name: "Intel Core i7", generation: "13th Gen" },
          memory: { ram: "16GB", storage: { type: "SSD", capacity: "512GB" } },
          display_size: 13.3,
          os: "Windows 11",
          weight: 1.2,
        }}
        type="laptop"
      />
    );

    expect(screen.getByText(/dell xps 13/i)).toBeInTheDocument();
    expect(screen.getByText(/12 Months/i)).toBeInTheDocument();
  });

  it("renders charger feature cards", () => {
    render(
      <ProductContent
        product={{
          brand: "Anker",
          title: "Nano Charger",
          condition: "New",
          wattage: "65",
          type: "USB-C",
          outputCurrent: "3A",
        }}
        type="charger"
      />
    );

    expect(screen.getByText(/short-circuit protection/i)).toBeInTheDocument();
    expect(screen.getByText(/portable design/i)).toBeInTheDocument();
  });

  it("renders mouse-specific highlights", () => {
    render(
      <ProductContent
        product={{
          brand: "Logitech",
          title: "MX Master 3",
          condition: "Excellent",
          connectivity: "Wireless",
          resolution: "4000",
          type: "Ergonomic",
        }}
        type="mouse"
      />
    );

    expect(screen.getByText(/precision tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/ergonomic shape reduces hand fatigue/i)).toBeInTheDocument();
  });

  it("renders smartwatch-specific highlights", () => {
    render(
      <ProductContent
        product={{
          brand: "Apple",
          title: "Watch Series 9",
          condition: "Excellent",
          displaySize: "45",
          displayType: "AMOLED",
          batteryRuntime: "18",
        }}
        type="smartwatch"
      />
    );

    expect(screen.getByText(/long battery life/i)).toBeInTheDocument();
    expect(screen.getByText(/track your workouts/i)).toBeInTheDocument();
  });

  it("renders earphone-specific highlights", () => {
    render(
      <ProductContent
        product={{
          brand: "Sony",
          title: "WF-1000XM4",
          condition: "Excellent",
          design: "In-ear",
          batteryLife: "8",
        }}
        type="earphone"
      />
    );

    expect(screen.getByText(/comfortable design/i)).toBeInTheDocument();
    expect(screen.getByText(/extended playback/i)).toBeInTheDocument();
  });
});
