import { buildApiUrl } from "../utils/api";

const CART_API_BASE = buildApiUrl("/api/cart");

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Cart request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function getCart() {
  const response = await fetch(CART_API_BASE, {
    method: "GET",
    credentials: "include",
  });

  const data = await parseResponse(response);
  return data.cart;
}

export async function addCartItem({ productType, productId, quantity = 1 }) {
  const response = await fetch(`${CART_API_BASE}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ productType, productId, quantity }),
  });

  const data = await parseResponse(response);
  return data.cart;
}

export async function updateCartItem(itemId, quantity) {
  const response = await fetch(`${CART_API_BASE}/items/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });

  const data = await parseResponse(response);
  return data.cart;
}

export async function removeCartItem(itemId) {
  const response = await fetch(`${CART_API_BASE}/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await parseResponse(response);
  return data.cart;
}

export async function clearCart() {
  const response = await fetch(CART_API_BASE, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await parseResponse(response);
  return data.cart;
}
