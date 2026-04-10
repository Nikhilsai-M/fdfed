import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  addItemToCart,
  clearCartByUserId,
  getCartByUserId,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../crud/cart.js";

const router = Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await getCartByUserId(req.user.user_id);
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("GET_CART_ERROR", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch cart" });
  }
});

router.post("/items", verifyToken, async (req, res) => {
  try {
    const { productType, productId, quantity = 1 } = req.body;
    const cart = await addItemToCart(req.user.user_id, productType, productId, quantity);
    return res.status(200).json({ success: true, cart, message: "Item added to cart" });
  } catch (error) {
    console.error("ADD_CART_ITEM_ERROR", error);
    return res.status(400).json({ success: false, message: error.message || "Failed to add item to cart" });
  }
});

router.put("/items/:productType/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await updateCartItemQuantity(
      req.user.user_id,
      req.params.productType,
      req.params.productId,
      req.body.quantity
    );

    return res.status(200).json({ success: true, cart, message: "Cart updated" });
  } catch (error) {
    console.error("UPDATE_CART_ITEM_ERROR", error);
    return res.status(400).json({ success: false, message: error.message || "Failed to update cart item" });
  }
});

router.delete("/items/:productType/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await removeItemFromCart(req.user.user_id, req.params.productType, req.params.productId);
    return res.status(200).json({ success: true, cart, message: "Item removed from cart" });
  } catch (error) {
    console.error("REMOVE_CART_ITEM_ERROR", error);
    return res.status(400).json({ success: false, message: error.message || "Failed to remove cart item" });
  }
});

router.delete("/", verifyToken, async (req, res) => {
  try {
    const cart = await clearCartByUserId(req.user.user_id);
    return res.status(200).json({ success: true, cart, message: "Cart cleared" });
  } catch (error) {
    console.error("CLEAR_CART_ERROR", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to clear cart" });
  }
});

export default router;
