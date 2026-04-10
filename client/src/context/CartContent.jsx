import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  const [isCartLoading, setIsCartLoading] = useState(false);

  const syncCartState = useCallback((cart) => {
    const items = cart?.items || [];
    const totalCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    setCartItems(items);
    setCartCount(totalCount);

    return items;
  }, []);

  const fetchCart = useCallback(async () => {
    setIsCartLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (response.status === 401 || response.status === 403) {
        syncCartState({ items: [] });
        return [];
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch cart");
      }

      return syncCartState(data.cart);
    } catch (error) {
      console.error("Cart fetch error:", error);
      syncCartState({ items: [] });
      throw error;
    } finally {
      setIsCartLoading(false);
    }
  }, [syncCartState]);

  const fetchCartCount = useCallback(async () => {
    try {
      await fetchCart();
    } catch (error) {
      // fetchCart already normalizes the state on auth/network errors.
    }
  }, [fetchCart]);

  const addItem = useCallback(async (productType, productId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/api/cart/items`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(true),
      body: JSON.stringify({ productType, productId, quantity }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to add item to cart");
    }

    syncCartState(data.cart);
    return data.cart;
  }, [syncCartState]);

  const updateItemQuantity = useCallback(async (productType, productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/api/cart/items/${encodeURIComponent(productType)}/${encodeURIComponent(productId)}`, {
      method: "PUT",
      credentials: "include",
      headers: getAuthHeaders(true),
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to update cart item");
    }

    syncCartState(data.cart);
    return data.cart;
  }, [syncCartState]);

  const removeItem = useCallback(async (productType, productId) => {
    const response = await fetch(`${API_BASE_URL}/api/cart/items/${encodeURIComponent(productType)}/${encodeURIComponent(productId)}`, {
      method: "DELETE",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to remove cart item");
    }

    syncCartState(data.cart);
    return data.cart;
  }, [syncCartState]);

  const clearCart = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "DELETE",
      credentials: "include",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to clear cart");
    }

    syncCartState(data.cart);
    return data.cart;
  }, [syncCartState]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  const value = useMemo(() => ({
    cartItems,
    cartCount,
    setCartCount,
    isCartLoading,
    fetchCart,
    fetchCartCount,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    updateCart: fetchCart,
  }), [addItem, cartCount, cartItems, clearCart, fetchCart, fetchCartCount, isCartLoading, removeItem, updateItemQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
