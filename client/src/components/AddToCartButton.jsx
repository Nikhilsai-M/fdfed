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
      if (!userData.success || !userData.user) {
        navigate("/sign-in");
        return;
      }

      const userId = userData.user.user_id;
      const userCartKey = `cart_user_${userId}`;

      if (!product || !product.id) {
        setMessage("Item added to cart");
        return;
      }

      let currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
      const existingIndex = currentCart.findIndex((item) => item.id === product.id);

      let updatedCart;

      if (existingIndex !== -1) {
        updatedCart = [...currentCart];
        updatedCart[existingIndex].quantity += 1;
      } else {
        updatedCart = [
          ...currentCart,
          {
            id: product.id,
            title: product.title,
            brand: product.brand,
            image: product.image,
            wattage: product.wattage,
            type: product.type,
            outputCurrent: product.outputCurrent,
            price: parseFloat(product.originalPrice),
            discountPercentage: parseFloat(product.discount),
            discountPrice:
              parseFloat(product.originalPrice) -
              (parseFloat(product.originalPrice) * parseFloat(product.discount)) / 100,
            quantity: 1,
            type: "charger",
          },
        ];
      }

      localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
      updateCart(updatedCart, userId);

      // ⭐ Simplified message
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
          
          {/* ⭐ Simplified popup text */}
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
