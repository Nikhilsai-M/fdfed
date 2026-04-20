import { describe, expect, it } from "vitest";
import {
  buildCartSnapshot,
  isSupportedCartProductType,
  serializeCart,
} from "../services/cart.service.js";

describe("cart.service", () => {
  // ─── isSupportedCartProductType ───────────────────────────────────────────

  it("validates supported product types", () => {
    expect(isSupportedCartProductType("phone")).toBe(true);
    expect(isSupportedCartProductType(" smartwatch ")).toBe(true);
    expect(isSupportedCartProductType("tablet")).toBe(false);
  });

  it("rejects empty string as unsupported product type", () => {
    expect(isSupportedCartProductType("")).toBe(false);
  });

  // ─── buildCartSnapshot : phone ────────────────────────────────────────────

  it("builds a phone snapshot with calculated pricing", () => {
    const snapshot = buildCartSnapshot("phone", {
      brand: "Apple",
      model: "iPhone 15",
      color: "Black",
      image: "/iphone.png",
      ram: "8GB",
      rom: "128GB",
      condition: "Excellent",
      pricing: {
        basePrice: 50000,
        discount: 10,
      },
      specs: {
        processor: "A17",
        display: "6.1 OLED",
        battery: "3349mAh",
        camera: "48MP",
        os: "iOS",
        network: "5G",
        weight: "171g",
      },
    });

    expect(snapshot.unitPrice).toBe(45000);
    expect(snapshot.stock).toBe(1);
    expect(snapshot.snapshot.title).toBe("Apple iPhone 15");
    expect(snapshot.snapshot.processor).toBe("A17");
    expect(snapshot.available).toBe(true);
  });

  it("treats laptops as single-stock cart items", () => {
    const snapshot = buildCartSnapshot("laptop", {
      brand: "Dell",
      series: "XPS 13",
      image: "/laptop.png",
      pricing: {
        basePrice: 90000,
        discount: 5,
      },
      processor: {
        name: "Intel i7",
        generation: "13th Gen",
      },
      memory: {
        ram: "16GB",
        storage: {
          type: "SSD",
          capacity: "512GB",
        },
      },
      displaysize: 13.4,
      os: "Windows 11",
      weight: 1.2,
      condition: "Excellent",
    });

    expect(snapshot.stock).toBe(1);
    expect(snapshot.available).toBe(true);
    expect(snapshot.snapshot.title).toBe("Dell XPS 13");
  });

  it("builds an accessory snapshot with stock awareness", () => {
    const snapshot = buildCartSnapshot("charger", {
      title: "GaN Charger",
      brand: "Anker",
      image: "/charger.png",
      originalPrice: 2500,
      discount: 20,
      wattage: "65W",
      type: "USB-C",
      outputCurrent: "3A",
      stock: 0,
    });

    expect(snapshot.unitPrice).toBe(2000);
    expect(snapshot.available).toBe(false);
    expect(snapshot.snapshot.connectorType).toBe("USB-C");
  });

  it("builds an earphone snapshot with design and battery life fields", () => {
    const snapshot = buildCartSnapshot("earphone", {
      title: "Sony WF-1000XM4",
      brand: "Sony",
      image: "/earphone.png",
      originalPrice: 20000,
      discount: 15,
      design: "In-ear",
      batteryLife: "8 hours",
      stock: 5,
    });

    expect(snapshot.unitPrice).toBe(17000);
    expect(snapshot.available).toBe(true);
    expect(snapshot.snapshot.design).toBe("In-ear");
    expect(snapshot.snapshot.batteryLife).toBe("8 hours");
  });

  // ─── serializeCart ────────────────────────────────────────────────────────

  it("serializes cart items and totals", () => {
    const cart = {
      user_id: "user-1",
      items: [
        {
          _id: { toString: () => "item-1" },
          productType: "phone",
          productId: "101",
          sellerId: "seller-1",
          quantity: 2,
          unitPrice: 1000,
          originalPrice: 1200,
          discount: 10,
          stock: null,
          available: true,
          snapshot: { title: "Phone" },
        },
        {
          _id: { toString: () => "item-2" },
          productType: "charger",
          productId: "c-1",
          sellerId: "seller-2",
          quantity: 1,
          unitPrice: 500,
          originalPrice: 500,
          discount: 0,
          stock: 5,
          available: true,
          snapshot: { title: "Charger" },
        },
      ],
    };

    const serialized = serializeCart(cart);

    expect(serialized.cartCount).toBe(3);
    expect(serialized.subtotal).toBe(2500);
    expect(serialized.items).toHaveLength(2);
    expect(serialized.items[0].itemId).toBe("item-1");
  });

  it("returns an empty cart when called with null", () => {
    const serialized = serializeCart(null);
    expect(serialized.items).toEqual([]);
    expect(serialized.cartCount).toBe(0);
    expect(serialized.subtotal).toBe(0);
    expect(serialized.userId).toBeNull();
  });
});
