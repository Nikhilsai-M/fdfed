import React, { useEffect, useState } from "react";
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  // Load cart from localStorage
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

  // Function to update subtotal, shipping, and total
  const updateTotals = (items) => {
    const sub = items.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );
    const ship = sub > 0 ? 100 : 0;
    setSubtotal(sub);
    setShipping(ship);
    setTotal(sub + ship);
  };

  // Update quantity handler
  const handleQuantityChange = (index, newQty) => {
    if (newQty < 1) return;
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQty;
    setCartItems(updatedItems);
    updateTotals(updatedItems);

    // Save updated cart to localStorage
    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith("cart_user"));
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(updatedItems));
    }
  };

  // Remove item from cart
  const handleRemove = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    updateTotals(updatedItems);

    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith("cart_user"));
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(updatedItems));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header/>

      {/* Cart Container */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
          Your Shopping Cart
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-200 py-4"
                >
                  {/* Product Info */}
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
                          onClick={() =>
                            handleQuantityChange(index, item.quantity - 1)
                          }
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.quantity || 1}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(index, item.quantity + 1)
                          }
                          className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="text-right">
                    <div className="font-semibold text-blue-700">
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </div>
                    <button
                      onClick={() => handleRemove(index)}
                      className="text-sm text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
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
            <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
              Proceed to Checkout
            </button>
            <button
              onClick={() => (window.location.href = "/products")}
              className="w-full mt-3 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <Footer/>   
    </div>
  );
};

export default Cart;
