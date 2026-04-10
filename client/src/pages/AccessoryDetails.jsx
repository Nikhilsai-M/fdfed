import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

import ProductSidebar from "../components/ProductSideBar";
import ProductImage from "../components/ProductImage";
import ProductContent from "../components/ProductContent";
import ProductActions from "../components/ProductActions";
import CartMessage from "../components/CartMessage";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

import { useCart } from "../context/CartContent";
import { addCartItem } from "../services/cartApi";

const AccessoryDetails = ({ type }) => {
  console.log("AccessoryDetails component loaded");
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);

  const { addItem } = useCart();

  const getApiEndpoint = () => {
    switch (type) {
      case "charger":
        return `/api/Accessories/chargers/${id}`;
      case "mouse":
        return `/api/Accessories/mouses/${id}`;
      case "smartwatch":
        return `/api/Accessories/smartwatches/${id}`;
      case "earphone":
        return `/api/Accessories/earphones/${id}`;
      default:
        return "";
    }
  };

  const getDiscountedPrice = (p) => {
    const price = parseFloat(p.originalPrice || 0);
    const discount = parseFloat(p.discount || 0);
    return price - (price * discount) / 100;
  };

  const getCartItemFields = (productData) => {
    const originalPrice = parseFloat(productData.originalPrice || 0);
    const discount = parseFloat(productData.discount || 0);

    const discountedPrice =
      originalPrice - (originalPrice * discount) / 100;

    const base = {
      id: productData.id,
      seller_id: productData.sellerId,
      brand: productData.brand,
      title: productData.title,
      image: productData.image,
      price: Number(discountedPrice),
      originalPrice: originalPrice,
      discount: discount,
      quantity: 1,
    };

    switch (type) {
      case "charger":
        return {
          ...base,
          wattage: productData.wattage,
          type: productData.type,
          outputCurrent: productData.outputCurrent,
        };

      case "mouse":
        return {
          ...base,
          connectivity: productData.connectivity,
          resolution: productData.resolution,
          type: productData.type,
        };

      case "smartwatch":
        return {
          ...base,
          displaySize: productData.displaySize,
          displayType: productData.displayType,
          batteryRuntime: productData.batteryRuntime,
        };

      case "earphone":
        return {
          ...base,
          design: productData.design,
          batteryLife: productData.batteryLife,
        };

      default:
        return base;
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(getApiEndpoint());

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        console.log(getApiEndpoint(), "API endpoint called");
        const data = await response.json();
        console.log("PRODUCT FROM API:", data); 
        if (!data || !data.id) {
          throw new Error(`Invalid ${type} data`);
        }

        setProduct(data);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id && type) fetchProduct();
  }, [id, type]);

  const addToCart = async () => {
    try {
      const cart = await addCartItem({
        productType: type,
        productId: product.id,
        quantity: 1,
      });

      await updateCart(cart);

      setCartMessage(`${product.title} added to cart!`);
      setTimeout(() => setCartMessage(null), 3000);
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error.status === 401 || error.status === 403) {
        navigate("/sign-in");
        return;
      }

      setCartMessage(error.message || "Unable to add item to cart");
      setTimeout(() => setCartMessage(null), 3000);
    }
  };
  const buyNow = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        credentials: "include",
      });

      if (!response.ok) return navigate("/sign-in");

      const userData = await response.json();
      const userId = userData?.user?.user_id;

      if (!userId) return navigate("/sign-in");

      const finalPrice = getDiscountedPrice(product);

      const paymentData = {
        price: finalPrice,
        type: type,
        id: id,
        accessory: product,
        userId: userId,
      };

      navigate("/payment", { state: paymentData });
    } catch (error) {
      console.error("Buy now error:", error);
      navigate("/sign-in");
    }
  };

const outOfStock =
  ["charger", "mouse", "earphone", "smartwatch"].includes(type) &&
  Number(product?.stock ?? 0) <= 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading {type} details...
      </div>
    );
  }

  if (error || !product || !product.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            {error || `${type} not found`}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          <ProductImage
            image={product.image}
            brand={product.brand}
            title={product.title}
          />

          <ProductSidebar product={product} type={type} />

        </div>

        {outOfStock ? (
          <div className="mb-12 text-center">
            <div className="bg-red-50 border border-red-300 text-red-600 font-semibold py-4 rounded-lg">
              Currently Not Available in Stock
            </div>
          </div>
        ) : (
          <div className="mb-12 w-full">
            <ProductActions
              onAddToCart={addToCart}
              onBuyNow={buyNow}
              productId={product.id}
            />
          </div>
        )}

        <ProductContent product={product} type={type} />

      </div>

      {cartMessage && (
        <CartMessage
          message={cartMessage}
          onClose={() => setCartMessage(null)}
        />
      )}

      <Footer />

    </div>
  );
};

AccessoryDetails.propTypes = {
  type: PropTypes.oneOf([
    "charger",
    "mouse",
    "smartwatch",
    "earphone",
  ]).isRequired,
};

export default AccessoryDetails;
