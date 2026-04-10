// src/pages/PhoneDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import ProductSidebar from '../components/ProductSideBar';
import ProductImage from '../components/ProductImage';
import ProductContent from '../components/ProductContent';
import ProductActions from '../components/ProductActions';
import CartMessage from '../components/CartMessage';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

import { useCart } from '../context/CartContent';

const PhoneDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);

  const { addItem } = useCart();

  // Fetch phone details
  useEffect(() => {
    const fetchPhone = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/phones/${id}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        if (!data || !data.id) throw new Error('Invalid phone data');
        setPhone(data);
      } catch (err) {
        setError(err.message);
        setPhone(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPhone();
  }, [id]);

  const getCartItemFields = (phoneData) => {
    return {
      id: phoneData.id,
      brand: phoneData.brand,
      title: `${phoneData.brand} ${phoneData.model}`,
      model: phoneData.model,
      color: phoneData.color,
      image: phoneData.image,
  
      // ORIGINAL PRICE
      price: phoneData.pricing.basePrice,
  
      // STORE DISCOUNT PERCENTAGE IN CART
      discountPercentage: parseFloat(phoneData.pricing.discount),
  
      // OPTIONAL: STORE DISCOUNT PRICE DIRECTLY (YOUR CART USES THIS)
      discountPrice:
        phoneData.pricing.basePrice -
        phoneData.pricing.basePrice * (phoneData.pricing.discount / 100),
  
      ram: phoneData.ram,
      rom: phoneData.rom,
      processor: phoneData.specs.processor,
      display: phoneData.specs.display,
      battery: phoneData.specs.battery,
      camera: phoneData.specs.camera,
  
      quantity: 1,
      type: 'phone',
    };
  };
  

  // Add to Cart using Context
  const addToCart = async () => {
    try {
      await addItem('phone', phone.id, 1);
      setCartMessage(`${phone.brand} ${phone.model} added to cart!`);
      setTimeout(() => setCartMessage(null), 3500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (/unauthorized|forbidden/i.test(error.message || '')) {
        navigate('/sign-in');
        return;
      }
      alert(error.message || 'Failed to add item to cart');
    }
  };
  const buyNow = async () => {
    try {
      const response = await fetch('/api/user/profile', { credentials: 'include' });
      if (!response.ok) {
        navigate('/sign-in');
        return;
      }

      const userData = await response.json();
      const userId = userData?.user?.user_id;
      
      if (!userId) {
        navigate('/sign-in');
        return;
      }

      // Calculate price locally
      const basePrice = phone.pricing.basePrice;
      const finalPrice = parseFloat(basePrice) - parseFloat(basePrice) * (parseFloat(phone.pricing.discount) / 100);

      const paymentData = {
        price: finalPrice,
        type: 'phone',
        id: id,
        phone: phone,
        userId: userId,
      };

      // Navigate to frontend payment page
      navigate('/payment', { 
        state: paymentData 
      });
    } catch (error) {
      console.error('Buy now error:', error);
      navigate('/sign-in');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600 animate-pulse">Loading phone details...</div>
      </div>
    );
  }

  if (error || !phone || !phone.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">{error || 'Phone not found'}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Retry
          </button>
          <Link
            to="/filter-buy-phone"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Phones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-24">
        <nav className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/filter-buy-phone" className="text-blue-600 hover:text-blue-800">Phones</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{phone.brand} {phone.model}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in">
          <ProductImage 
            image={phone.image} 
            alt={`${phone.brand} ${phone.model}`} 
            condition={phone.condition}
          />
          <div className="space-y-6">
            <ProductSidebar product={phone} type="phone" />
          </div>
        </div>

        <div className="mb-12 w-full">
          <ProductActions
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            productId={phone.id}
          />
        </div>

        <ProductContent product={phone} type="phone" />
      </div>

      {cartMessage && (
        <CartMessage message={cartMessage} onClose={() => setCartMessage(null)} />
      )}

      <Footer />
    </div>
  );
};

export default PhoneDetails;

