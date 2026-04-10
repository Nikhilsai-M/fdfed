import React, { useState } from "react";
import { ShoppingCart, X, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContent";

const inferProductType = (product) => {
  if (product?.productType) return product.productType;
  if (product?.type === "phone" || product?.type === "laptop") return product.type;
  if (product?.wattage && product?.outputCurrent) return "charger";
  if (product?.design && product?.batteryLife) return "earphone";
  if (product?.displaySize && product?.displayType && product?.batteryRuntime) return "smartwatch";
  if (product?.resolution && product?.connectivity) return "mouse";
  return null;
};

const AddToCartButton = ({ product }) => {
  const [message, setMessage] = useState(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const productType = inferProductType(product);

      if (!productType || !product?.id) {
        throw new Error("Product details are incomplete");
      }

      await addItem(productType, product.id, 1);
      setMessage("Item added to cart");
      setTimeout(() => setMessage(null), 2500);
    } catch (error) {
      console.error("Cart error:", error);

      if (/unauthorized|forbidden/i.test(error.message || "")) {
        navigate("/sign-in");
        return;
      }

      alert(error.message || "Failed to add item to cart");
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
        onClick={handleAddToCart}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </>
  );
};

export default AddToCartButton;
