import { beforeEach, describe, expect, it, vi } from "vitest";

const cartServiceMocks = vi.hoisted(() => ({
  buildCartSnapshot: vi.fn(),
  clearCartByUserId: vi.fn(),
  getOrCreateCart: vi.fn(),
  getProductForCart: vi.fn(),
  isSupportedCartProductType: vi.fn(),
  refreshCart: vi.fn(),
  serializeCart: vi.fn(),
}));

vi.mock("../services/cart.service.js", () => ({
  buildCartSnapshot: cartServiceMocks.buildCartSnapshot,
  clearCartByUserId: cartServiceMocks.clearCartByUserId,
  getOrCreateCart: cartServiceMocks.getOrCreateCart,
  getProductForCart: cartServiceMocks.getProductForCart,
  isSupportedCartProductType: cartServiceMocks.isSupportedCartProductType,
  refreshCart: cartServiceMocks.refreshCart,
  serializeCart: cartServiceMocks.serializeCart,
}));

import { addCartItem, updateCartItem } from "../controllers/cart.controller.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return payload;
    },
  };
}

describe("cart.controller stock limits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks adding the same single-stock product above its stock", async () => {
    const next = vi.fn();
    const save = vi.fn();
    const existingItem = {
      productType: "phone",
      productId: "101",
      quantity: 1,
    };
    const cart = {
      items: [existingItem],
      save,
    };

    cartServiceMocks.isSupportedCartProductType.mockReturnValue(true);
    cartServiceMocks.getProductForCart.mockResolvedValue({ id: 101, brand: "Apple" });
    cartServiceMocks.buildCartSnapshot.mockReturnValue({
      sellerId: null,
      originalPrice: 50000,
      discount: 10,
      unitPrice: 45000,
      stock: 1,
      available: true,
      snapshot: { title: "Apple iPhone 15" },
    });
    cartServiceMocks.getOrCreateCart.mockResolvedValue(cart);

    await addCartItem(
      {
        user: { user_id: "user-1" },
        body: {
          productType: "phone",
          productId: "101",
          quantity: 1,
        },
      },
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Only 1 item(s) available in stock",
      })
    );
    expect(save).not.toHaveBeenCalled();
    expect(cartServiceMocks.refreshCart).not.toHaveBeenCalled();
  });

  it("blocks updating a cart item above the available stock", async () => {
    const next = vi.fn();
    const save = vi.fn();
    const item = {
      productType: "laptop",
      productId: "202",
      quantity: 1,
    };
    const cart = {
      items: {
        id: vi.fn(() => item),
      },
      save,
    };

    cartServiceMocks.getOrCreateCart.mockResolvedValue(cart);
    cartServiceMocks.getProductForCart.mockResolvedValue({ id: 202, brand: "Dell" });
    cartServiceMocks.buildCartSnapshot.mockReturnValue({
      sellerId: null,
      originalPrice: 90000,
      discount: 5,
      unitPrice: 85500,
      stock: 1,
      available: true,
      snapshot: { title: "Dell XPS 13" },
    });

    await updateCartItem(
      {
        user: { user_id: "user-1" },
        params: { itemId: "item-1" },
        body: { quantity: 2 },
      },
      createResponse(),
      next
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: "Only 1 item(s) available in stock",
      })
    );
    expect(save).not.toHaveBeenCalled();
    expect(cartServiceMocks.refreshCart).not.toHaveBeenCalled();
  });
});
