import React, { useState } from "react";
import { ShoppingCart, X, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContent";

const AddToCartButton = ({ product }) => {
  const [message, setMessage] = useState(null);
  const { updateCart } = useCart();
  const navigate = useNavigate();

  const addToCart = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        navigate("/sign-in");
        return;
      }

      const userData = await response.json();
      const userId = userData?.user?.user_id;

      if (!userId) {
        navigate("/sign-in");
        return;
      }

      const cartKey = `cart_${userId}`;
      const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

      const index = existingCart.findIndex((item) => item.id === product.id);

      const discountedPrice =
        product.originalPrice -
        (product.originalPrice * product.discount) / 100;

      // base cart item
      const cartItem = {
        id: product.id,
        seller_id: product.sellerId || product.seller_id,

        title: product.title,
        brand: product.brand,
        image: product.image,

        price: discountedPrice,
        originalPrice: product.originalPrice,
        discount: product.discount,

        quantity: 1,
      };

      // Charger
      if (product.wattage && product.outputCurrent) {
        cartItem.wattage = product.wattage;
        cartItem.outputCurrent = product.outputCurrent;
        cartItem.type = product.type;
      }

      // Earphones
      if (product.design && product.batteryLife) {
        cartItem.design = product.design;
        cartItem.batteryLife = product.batteryLife;
      }

      // Smartwatch
      if (product.displaySize && product.displayType && product.batteryRuntime) {
        cartItem.displaySize = product.displaySize;
        cartItem.displayType = product.displayType;
        cartItem.batteryRuntime = product.batteryRuntime;
      }

      // Mouse
      if (product.resolution && product.connectivity && product.type) {
        cartItem.resolution = product.resolution;
        cartItem.connectivity = product.connectivity;
        cartItem.type = product.type;
      }

      let updatedCart;

      if (index !== -1) {
        updatedCart = [...existingCart];
        updatedCart[index].quantity += 1;
      } else {
        updatedCart = [...existingCart, cartItem];
      }

      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      updateCart(updatedCart, userId);

      setMessage("Item added to cart");
      setTimeout(() => setMessage(null), 2500);

    } catch (error) {
      console.error("Cart error:", error);
      navigate("/sign-in");
    }
  };

  return (
    <>
      {message && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span className="flex-1">Item added to cart</span>

          <Link to="/cart" className="underline text-white">
            View Cart
          </Link>

          <button onClick={() => setMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        onClick={addToCart}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </>
  );
};

export default AddToCartButton;