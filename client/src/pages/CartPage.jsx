import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { useCart } from "../context/CartContent";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  const { fetchCartCount } = useCart();

  // Function to get discounted price for each item
  const getDiscountPrice = (item) => {
    if (item.discountPrice) {
      return item.discountPrice;
    }

    if (item.price && item.discountPercentage) {
      return item.price - (item.price * item.discountPercentage) / 100;
    }

    return item.price || 0;
  };

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith("cart_user"));
    let items = [];

    if (cartKey) {
      try {
        items = JSON.parse(localStorage.getItem(cartKey)) || [];
      } catch (error) {
        console.error("Error reading cart:", error);
      }
    }

    setCartItems(items);
    updateTotals(items);
  }, []);

  // ---------------- TOTAL CALCULATION ----------------
  const updateTotals = (items) => {
    const sub = items.reduce((acc, item) => {
      const dPrice = getDiscountPrice(item);
      return acc + dPrice * (item.quantity || 1);
    }, 0);

    const ship = sub > 0 ? 100 : 0;

    setSubtotal(sub);
    setShipping(ship);
    setTotal(sub + ship);
  };

  // ---------------- CHANGE QUANTITY ----------------
  const handleQuantityChange = (index, newQty) => {
    if (newQty < 1) return;

    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQty;
    setCartItems(updatedItems);
    updateTotals(updatedItems);

    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith("cart_user"));
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(updatedItems));
    }

    fetchCartCount();
  };

  // ---------------- REMOVE ITEM ----------------
  const handleRemove = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    updateTotals(updatedItems);

    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith("cart_user"));
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(updatedItems));
    }

    fetchCartCount();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
          Your Shopping Cart
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* ---------------- CART ITEMS ---------------- */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
              cartItems.map((item, index) => {
                const discountPrice = getDiscountPrice(item);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-gray-200 py-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || "/default-product.png"}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                        <p className="text-gray-600 text-sm">
                          {item.brand || "Brand"} | {item.category || "Category"}
                        </p>

                        <div className="flex items-center mt-2 space-x-3">
                          <button
                            onClick={() => handleQuantityChange(index, item.quantity - 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                          >
                            -
                          </button>

                          <span className="font-semibold">{item.quantity || 1}</span>

                          <button
                            onClick={() => handleQuantityChange(index, item.quantity + 1)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* PRICE + REMOVE */}
                    <div className="text-right">
                      {/* PRICE + REMOVE */}
<div className="text-right">

{/* Discounted Price */}
<div className="font-semibold text-blue-700">
  ₹{Number(item.price * item.quantity).toLocaleString("en-IN")}
</div>

{/* Original Price (line-through) */}
{item.originalPrice && item.originalPrice > item.price && (
  <div className="text-sm text-gray-500 line-through">
    ₹{Number(item.originalPrice * item.quantity).toLocaleString("en-IN")}
  </div>
)}


</div>


                      <button
                        onClick={() => handleRemove(index)}
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

          {/* ---------------- ORDER SUMMARY ---------------- */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="flex justify-between mb-2">
              <span>Items:</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>₹{shipping}</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{total}</span>
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
