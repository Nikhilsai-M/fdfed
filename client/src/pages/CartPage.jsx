import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useCart } from "../context/CartContent";
import { getCart, removeCartItem, updateCartItem } from "../services/cartApi";
import { buildAssetUrl } from "../utils/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchCartCount } = useCart();

  const getItemUnitPrice = (item) => Number(item.unitPrice || item.price || 0);

  const updateTotals = (items) => {
    const sub = items.reduce(
      (acc, item) => acc + getItemUnitPrice(item) * (item.quantity || 1),
      0
    );
    const ship = sub > 0 ? 100 : 0;
    setSubtotal(sub);
    setShipping(ship);
    setTotal(sub + ship);
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await getCart();
        const items = cart?.items || [];
        setCartItems(items);
        updateTotals(items);
      } catch (error) {
        console.error("Cart error:", error);
        if (error.status === 401 || error.status === 403) {
          navigate("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate]);

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    const item = cartItems.find((cartItem) => cartItem.itemId === itemId);
    if (item && typeof item.stock === "number" && quantity > item.stock) {
      return;
    }

    try {
      const cart = await updateCartItem(itemId, quantity);
      const items = cart?.items || [];
      setCartItems(items);
      updateTotals(items);
      await fetchCartCount();
    } catch (error) {
      console.error("Quantity update error:", error);
      alert(error.message || "Unable to update quantity");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const cart = await removeCartItem(itemId);
      const items = cart?.items || [];
      setCartItems(items);
      updateTotals(items);
      await fetchCartCount();
    } catch (error) {
      console.error("Remove item error:", error);
      alert(error.message || "Unable to remove item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
          Your Shopping Cart
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            {loading ? (
              <p className="text-gray-500 text-center">Loading your cart...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => {
                const unitPrice = getItemUnitPrice(item);

                return (
                  <div key={item.itemId} className="flex justify-between py-4 border-b">
                    <div className="flex space-x-4">
                      <img
                        src={buildAssetUrl(item.image)}
                        alt={item.title}
                        className="w-16 h-16 object-contain rounded-lg"
                      />

                      <div>
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                        <p className="text-gray-600 text-sm">
                          {item.brand} | {item.type}
                        </p>

                        <div className="flex items-center mt-2 space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                            disabled={Number(item.quantity || 1) <= 1}
                          >
                            -
                          </button>

                          <span className="font-semibold">{item.quantity}</span>

                          <button
                            onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                            disabled={typeof item.stock === "number" && item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>

                        {typeof item.stock === "number" ? (
                          <p className="text-xs text-gray-500 mt-2">Stock left: {item.stock}</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-blue-700">
                        Rs.{Number(unitPrice * item.quantity).toLocaleString("en-IN")}
                      </div>

                      {item.originalPrice && item.originalPrice > unitPrice ? (
                        <div className="text-sm text-gray-500 line-through">
                          Rs.{Number(item.originalPrice * item.quantity).toLocaleString("en-IN")}
                        </div>
                      ) : null}

                      <button
                        onClick={() => handleRemove(item.itemId)}
                        className="text-sm text-red-500 hover:underline mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="flex justify-between mb-2">
              <span>Items:</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>Rs.{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>Rs.{shipping.toLocaleString("en-IN")}</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>Rs.{total.toLocaleString("en-IN")}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-center"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={() => navigate("/")}
              className="w-full mt-3 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
