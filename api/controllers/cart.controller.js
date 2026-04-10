import { errorHandler } from "../utils/error.js";
import {
  buildCartSnapshot,
  clearCartByUserId,
  getOrCreateCart,
  getProductForCart,
  isSupportedCartProductType,
  refreshCart,
  serializeCart,
} from "../services/cart.service.js";

function parseQuantity(quantity) {
  const parsedQuantity = Number(quantity);
  return Number.isInteger(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : null;
}

export async function getCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.user_id);
    await refreshCart(cart);

    return res.status(200).json({
      success: true,
      cart: serializeCart(cart),
    });
  } catch (error) {
    next(error);
  }
}

export async function addCartItem(req, res, next) {
  try {
    const { productType, productId, quantity = 1 } = req.body;
    const normalizedQuantity = parseQuantity(quantity);

    if (!isSupportedCartProductType(productType) || !productId || !normalizedQuantity) {
      return next(errorHandler(400, "Valid productType, productId, and quantity are required"));
    }

    const product = await getProductForCart(productType, productId);

    if (!product) {
      return next(errorHandler(404, "Product not found"));
    }

    const freshSnapshot = buildCartSnapshot(productType, product);

    if (!freshSnapshot) {
      return next(errorHandler(400, "Unable to add product to cart"));
    }

    if (!freshSnapshot.available) {
      return next(errorHandler(400, "This product is currently out of stock"));
    }

    const cart = await getOrCreateCart(req.user.user_id);
    const existingItem = cart.items.find(
      (item) => item.productType === productType && item.productId === String(productId)
    );

    if (existingItem) {
      const nextQuantity = existingItem.quantity + normalizedQuantity;

      if (typeof freshSnapshot.stock === "number" && nextQuantity > freshSnapshot.stock) {
        return next(errorHandler(400, `Only ${freshSnapshot.stock} item(s) available in stock`));
      }

      existingItem.quantity = nextQuantity;
      existingItem.sellerId = freshSnapshot.sellerId;
      existingItem.unitPrice = freshSnapshot.unitPrice;
      existingItem.originalPrice = freshSnapshot.originalPrice;
      existingItem.discount = freshSnapshot.discount;
      existingItem.stock = freshSnapshot.stock;
      existingItem.available = freshSnapshot.available;
      existingItem.snapshot = freshSnapshot.snapshot;
    } else {
      cart.items.push({
        productType,
        productId: String(productId),
        sellerId: freshSnapshot.sellerId,
        quantity: normalizedQuantity,
        unitPrice: freshSnapshot.unitPrice,
        originalPrice: freshSnapshot.originalPrice,
        discount: freshSnapshot.discount,
        stock: freshSnapshot.stock,
        available: freshSnapshot.available,
        snapshot: freshSnapshot.snapshot,
      });
    }

    await cart.save();
    await refreshCart(cart);

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart: serializeCart(cart),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const normalizedQuantity = parseQuantity(quantity);

    if (!normalizedQuantity) {
      return next(errorHandler(400, "A valid quantity is required"));
    }

    const cart = await getOrCreateCart(req.user.user_id);
    const item = cart.items.id(itemId);

    if (!item) {
      return next(errorHandler(404, "Cart item not found"));
    }

    const product = await getProductForCart(item.productType, item.productId);

    if (!product) {
      item.deleteOne();
      await cart.save();
      return next(errorHandler(404, "Product no longer exists and was removed from the cart"));
    }

    const freshSnapshot = buildCartSnapshot(item.productType, product);

    if (!freshSnapshot.available) {
      return next(errorHandler(400, "This product is currently out of stock"));
    }

    if (typeof freshSnapshot.stock === "number" && normalizedQuantity > freshSnapshot.stock) {
      return next(errorHandler(400, `Only ${freshSnapshot.stock} item(s) available in stock`));
    }

    item.quantity = normalizedQuantity;
    item.sellerId = freshSnapshot.sellerId;
    item.unitPrice = freshSnapshot.unitPrice;
    item.originalPrice = freshSnapshot.originalPrice;
    item.discount = freshSnapshot.discount;
    item.stock = freshSnapshot.stock;
    item.available = freshSnapshot.available;
    item.snapshot = freshSnapshot.snapshot;

    await cart.save();
    await refreshCart(cart);

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart: serializeCart(cart),
    });
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req.user.user_id);
    const item = cart.items.id(itemId);

    if (!item) {
      return next(errorHandler(404, "Cart item not found"));
    }

    item.deleteOne();
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      cart: serializeCart(cart),
    });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req, res, next) {
  try {
    await clearCartByUserId(req.user.user_id);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: {
        userId: req.user.user_id,
        items: [],
        cartCount: 0,
        subtotal: 0,
      },
    });
  } catch (error) {
    next(error);
  }
}
