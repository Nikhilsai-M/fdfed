// client/src/pages/PhoneDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContent';
import {
  ShoppingCart, Zap, Shield, Award, Truck, Check, X,
  Cpu, Monitor as Display, Battery, Camera, Weight,
  MemoryStick as Memory, HardDrive
} from 'lucide-react';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import './PhoneDetails.css';

const PhoneDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCart } = useCart();
  const [phone, setPhone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    const fetchPhoneDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/phones/${id}`);
        
        if (!response.ok) {
          throw new Error('Phone not found');
        }
        
        const phoneData = await response.json();
        setPhone(phoneData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching phone details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneDetails();
  }, [id]);

  const calculateFinalPrice = (phone) => {
    const price = parseFloat(phone.pricing.basePrice || 0);
    const discount = parseFloat(phone.pricing.discount || 0);
    return Number((price - (price * discount / 100)).toFixed(2));
  };

  const addToCart = async () => {
    try {
      // Verify user session via API
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        navigate('/sign-in');
        return;
      }

      const userData = await response.json();
      if (!userData.success || !userData.user) {
        navigate('/sign-in');
        return;
      }

      const userId = userData.user.user_id;
      const userCartKey = `cart_user_${userId}`;

      if (!phone || !phone.id) {
        console.error('Phone data not available');
        return;
      }

      let currentCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

      const existingProductIndex = currentCart.findIndex((item) => item.id === phone.id);

      let updatedCart;
      if (existingProductIndex !== -1) {
        updatedCart = [...currentCart];
        updatedCart[existingProductIndex].quantity += 1;
      } else {
        const finalPrice = calculateFinalPrice(phone);
        updatedCart = [...currentCart, {
          id: phone.id,
          name: `${phone.brand} ${phone.model}`,
          brand: phone.brand,
          model: phone.model,
          color: phone.color,
          processor: phone.specs.processor,
          display: phone.specs.display,
          battery: phone.specs.battery,
          camera: phone.specs.camera,
          os: phone.specs.os,
          network: phone.specs.network,
          weight: phone.specs.weight,
          ram: phone.ram,
          rom: phone.rom,
          image: phone.image,
          price: finalPrice,
          originalPrice: phone.pricing.basePrice,
          discount: phone.pricing.discount,
          condition: phone.condition,
          quantity: 1,
          type: 'phone'
        }];
      }

      // Save to localStorage
      localStorage.setItem(userCartKey, JSON.stringify(updatedCart));

      // Update the context
      updateCart(updatedCart, userId);

      // Show success message
      setCartItem(`${phone.brand} ${phone.model} added to cart!`);
      setTimeout(() => setCartItem(null), 3000);

    } catch (error) {
      console.error('Error adding to cart:', error);
      navigate('/sign-in');
    }
  };

  const buyNow = async () => {
    await addToCart();
    navigate('/payment');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading phone details...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error-page">
            <h2>Phone Not Found</h2>
            <p>{error}</p>
            <Link to="/filter-buy-phone" className="btn btn-primary">
              Back to Phones
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!phone) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error-page">
            <h2>Phone Not Found</h2>
            <Link to="/filter-buy-phone" className="btn btn-primary">
              Back to Phones
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const finalPrice = calculateFinalPrice(phone);
  const originalPrice = phone.pricing.basePrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      
      {/* Cart Success Message */}
      {cartItem && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-slideIn flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span className="flex-1">{cartItem}</span>
          <button 
            onClick={() => navigate('/cart')} 
            className="text-white underline hover:no-underline"
          >
            View Cart
          </button>
          <button onClick={() => setCartItem(null)} className="ml-2 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/filter-buy-phone" className="text-blue-600 hover:text-blue-800">Phones</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{phone.brand} {phone.model}</span>
        </nav>

        {/* Product Details */}
        <div className="product-details-container">
          <div className="product-image-section">
            <div className="product-image">
              <img 
                src={phone.image} 
                alt={`${phone.brand} ${phone.model}`}
                className="w-full h-full object-contain"
              />
              <div className="condition-badge">
                {phone.condition}
              </div>
            </div>
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{phone.brand} {phone.model}</h1>
            <span className="product-color">{phone.color}</span>
            <span className="product-condition">{phone.condition} Condition</span>
            
            <div className="price-container">
              <span className="final-price">₹{finalPrice.toLocaleString('en-IN')}</span>
              <span className="original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
              <span className="discount-badge">{phone.pricing.discount}% OFF</span>
            </div>

            <div className="product-actions">
              <button 
                className="btn btn-primary"
                onClick={addToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button 
                className="btn btn-secondary"
                onClick={buyNow}
              >
                <Zap className="w-5 h-5" />
                Buy Now
              </button>
            </div>

            <div className="features-grid">
              <div className="feature-item">
                <Shield className="w-6 h-6 text-green-600" />
                <span>6 Month Warranty</span>
              </div>
              <div className="feature-item">
                <Truck className="w-6 h-6 text-blue-600" />
                <span>Free Shipping</span>
              </div>
              <div className="feature-item">
                <Award className="w-6 h-6 text-purple-600" />
                <span>Quality Certified</span>
              </div>
            </div>

            <div className="specifications">
              <h3>Key Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  <div>
                    <strong>Processor:</strong> {phone.specs.processor}
                  </div>
                </div>
                <div className="spec-item">
                  <Display className="w-5 h-5 text-blue-600" />
                  <div>
                    <strong>Display:</strong> {phone.specs.display}
                  </div>
                </div>
                <div className="spec-item">
                  <Battery className="w-5 h-5 text-blue-600" />
                  <div>
                    <strong>Battery:</strong> {phone.specs.battery}mAh
                  </div>
                </div>
                <div className="spec-item">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <div>
                    <strong>Camera:</strong> {phone.specs.camera}
                  </div>
                </div>
                <div className="spec-item">
                  <i className="fab fa-android text-blue-600"></i>
                  <div>
                    <strong>OS:</strong> {phone.specs.os}
                  </div>
                </div>
                <div className="spec-item">
                  <i className="fas fa-network-wired text-blue-600"></i>
                  <div>
                    <strong>Network:</strong> {phone.specs.network}
                  </div>
                </div>
                <div className="spec-item">
                  <Weight className="w-5 h-5 text-blue-600" />
                  <div>
                    <strong>Weight:</strong> {phone.specs.weight}
                  </div>
                </div>
                <div className="spec-item">
                  <Memory className="w-5 h-5 text-blue-600" />
                  <div>
                    <strong>RAM:</strong> {phone.ram}
                  </div>
                </div>
                <div className="spec-item">
                  <HardDrive className="w-5 h-5 text-blue-600" />
                  <div>
                    <strong>Storage:</strong> {phone.rom}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-description">
          <h2>Product Description</h2>
          <p>
            Experience the power and performance of the {phone.brand} {phone.model}. 
            This {phone.condition.toLowerCase()} condition device features {phone.ram} RAM and {phone.rom} storage, 
            making it perfect for multitasking and storing all your media.
          </p>

          <div className="highlight-features">
            <h3>Highlight Features</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Cpu className="w-8 h-8" />
                </div>
                <h4>Powerful Processor</h4>
                <p>{phone.specs.processor}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Display className="w-8 h-8" />
                </div>
                <h4>Stunning Display</h4>
                <p>{phone.specs.display}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Battery className="w-8 h-8" />
                </div>
                <h4>Long-lasting Battery</h4>
                <p>{phone.specs.battery}mAh battery for extended usage</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <Camera className="w-8 h-8" />
                </div>
                <h4>Professional Camera</h4>
                <p>{phone.specs.camera}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PhoneDetails;