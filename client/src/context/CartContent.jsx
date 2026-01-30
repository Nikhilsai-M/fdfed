// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  
  const fetchCartCount = () => {
    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith("cart_user_"));
    if (!cartKey) return setCartCount(0);

    const cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
    const totalCount = cartData.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    setCartCount(totalCount);
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  const updateCart = (newCartData, userId) => {
    localStorage.setItem(`cart_user_${userId}`, JSON.stringify(newCartData));
    fetchCartCount();
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCart, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
