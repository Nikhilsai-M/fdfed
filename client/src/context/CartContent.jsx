// src/context/CartContext.js
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCart } from "../services/cartApi";
import { API_BASE_URL } from "../utils/api";

const CartContext = createContext();

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
  const customerToken = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const currentUser = typeof window !== "undefined" ? localStorage.getItem("user") : "";
  const isCustomerSession = Boolean(customerToken) && String(currentUser || "").includes('"role":"customer"');

  const syncCartCount = useCallback((cart) => {
    setCartCount(cart?.cartCount || 0);
  }, []);

  const fetchCartCount = useCallback(async () => {
    if (!isCustomerSession) {
      setCartCount(0);
      return null;
    }

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
  }, [isCustomerSession, syncCartCount]);

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
