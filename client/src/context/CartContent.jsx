// src/context/CartContext.js
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCart } from "../services/cartApi";

const CartContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getAuthHeaders = (includeJson = false) => {
  const headers = {};
  const token = localStorage.getItem("token");

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const syncCartCount = useCallback((cart) => {
    setCartCount(cart?.cartCount || 0);
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const cart = await getCart();
      syncCartCount(cart);
      return cart;
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        setCartCount(0);
        return null;
      }

      console.error("Failed to fetch cart count:", error);
      return null;
    }
  }, [syncCartCount]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  const updateCart = useCallback(
    async (cart) => {
      if (cart && typeof cart.cartCount === "number") {
        syncCartCount(cart);
        return cart;
      }

      return fetchCartCount();
    },
    [fetchCartCount, syncCartCount]
  );

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCart, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
