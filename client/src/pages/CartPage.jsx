import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useCart } from "../context/CartContent";

const Cart = () => {
  const {
    cartItems,
    fetchCart,
    updateItemQuantity,
    removeItem,
    isCartLoading,
  } = useCart();

  const getDiscountPrice = (item) => {
    if (item.discountPrice != null) return Number(item.discountPrice);

    if (item.price && item.discount != null) {
      return Number(item.price) - (Number(item.price) * Number(item.discount)) / 100;
    }

    if (item.price && item.discountPercentage != null) {
      return Number(item.price) - (Number(item.price) * Number(item.discountPercentage)) / 100;
    }

    return Number(item.price || 0);
  };

  useEffect(() => {
    fetchCart().catch(() => {});
  }, [fetchCart]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      const discounted = getDiscountPrice(item);
      return acc + discounted * Number(item.quantity || 1);
    }, 0);

    const shipping = subtotal > 0 ? 100 : 0;

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [cartItems]);

  const handleQuantityChange = async (item, quantity) => {
    if (quantity < 1) return;

    try {
      await updateItemQuantity(item.productType, item.productId || item.id, quantity);
    } catch (error) {
      console.error("Cart quantity update error:", error);
      alert(error.message || "Failed to update cart quantity");
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeItem(item.productType, item.productId || item.id);
    } catch (error) {
      console.error("Cart remove error:", error);
      alert(error.message || "Failed to remove item from cart");
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
            {isCartLoading ? (
              <p className="text-gray-500 text-center">Loading your cart...</p>
            ) : cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => {
                const discounted = getDiscountPrice(item);

                return (
                  <div key={`${item.productType}-${item.productId || item.id}`} className="flex justify-between py-4 border-b">
                    <div className="flex space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-contain rounded-lg"
                      />

                      <div>
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                        <p className="text-gray-600 text-sm capitalize">
                          {item.brand} | {item.category || item.productType}
                        </p>

                        <div className="flex items-center mt-2 space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item, Number(item.quantity || 1) - 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                            disabled={Number(item.quantity || 1) <= 1}
                          >
                            -
                          </button>

                          <span className="font-semibold">{item.quantity}</span>

                          <button
                            onClick={() => handleQuantityChange(item, Number(item.quantity || 1) + 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-blue-700">
                        ?{Number(discounted * Number(item.quantity || 1)).toLocaleString("en-IN")}
                      </div>

                      {item.originalPrice && Number(item.originalPrice) > discounted && (
                        <div className="text-sm text-gray-500 line-through">
                          ?{Number(Number(item.originalPrice) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                        </div>
                      )}

                      <button
                        onClick={() => handleRemove(item)}
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
              <span>?{totals.subtotal}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>?{totals.shipping}</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>?{totals.total}</span>
            </div>

            <Link
              to="/checkout"
              className="block w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-center"
            >
              Proceed to Checkout
            </Link>

            <button
              onClick={() => (window.location.href = "/products")}
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
