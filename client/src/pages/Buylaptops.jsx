import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, Award, Zap, Shield, Clock, Laptop } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const BuyLaptops = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();

  const carouselImages = [
    'src/assets/images/buy_laptop/buy-laptop-page-curosal.webp',
    'src/assets/images/carousal/home/pic-1.jpeg'
  ];

  const topBrands = [
    { name: 'Dell', image: 'src/assets/images/buy_laptop/topbrands1.webp', color: 'from-blue-600 to-blue-800' },
    { name: 'HP', image: 'src/assets/images/buy_laptop/topbrands2.webp', color: 'from-cyan-600 to-cyan-800' },
    { name: 'Lenovo', image: 'src/assets/images/buy_laptop/topbrands3.webp', color: 'from-red-600 to-red-800' },
    { name: 'Apple', image: 'src/assets/images/buy_laptop/topbrands4.webp', color: 'from-gray-700 to-gray-900' },
    { name: 'Asus', image: 'src/assets/images/buy_laptop/topbrands5.webp', color: 'from-orange-600 to-orange-800' },
    { name: 'Acer', image: 'src/assets/images/buy_laptop/topbrands6.webp', color: 'from-green-600 to-green-800' },
    { name: 'MSI', image: 'src/assets/images/buy_laptop/topbrands7.webp', color: 'from-red-500 to-red-700' },
    { name: 'Microsoft', image: 'src/assets/images/buy_laptop/topbrands8.webp', color: 'from-blue-500 to-blue-700' }
  ];

  const priceCategories = [
    { price: '30,000', value: 30000, bg: 'from-cyan-400 to-cyan-600', image: '/images/buy_laptop/buy-laptop-page1.webp', icon: '💰' },
    { price: '40,000', value: 40000, bg: 'from-amber-400 to-amber-600', image: '/images/buy_laptop/buy-laptop-page2.webp', icon: '💳' },
    { price: '50,000', value: 50000, bg: 'from-blue-400 to-blue-600', image: '/images/buy_laptop/buy-laptop-page3.webp', icon: '💎' },
    { price: '60,000', value: 60000, bg: 'from-green-400 to-green-600', image: '/images/buy_laptop/buy-laptop-page4.webp', icon: '🏆' }
  ];

  useEffect(() => {
    fetchLatestProducts();
    const interval = setInterval(fetchLatestProducts, 30000);
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearInterval(slideInterval);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [latestProducts]);

  const fetchLatestProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/latest-laptops', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error(`Failed to fetch latest laptops (${response.status})`);
      
      const products = await response.json();
      setLatestProducts(products);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching latest laptops:', err);
      setError('Error loading laptops. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  const calculateFinalPrice = (product) => {
    const price = parseFloat(product.base_price || 0);
    const discount = parseFloat(product.discount || 0);
    return Number((price - (price * discount / 100)).toFixed(2));
  };

  const redirectToFilterPage = (brand) => {
    navigate(`/filter-buy-laptop?brand=${brand}`);
  };

  const redirectToFilterPageWithPrice = (maxPrice) => {
    navigate(`/filter-buy-laptop?maxPrice=${maxPrice}`);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="pt-6 bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 min-h-screen">
      <Header />
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
        }
        
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-float { animation: floatAnimation 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .animate-bounce-slow { animation: bounce 2s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        
        .gradient-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .image-hover {
          transition: transform 0.4s ease;
        }
        
        .image-hover:hover {
          transform: scale(1.1) rotate(2deg);
        }
        
        .brand-card {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .brand-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .brand-card:hover::before {
          left: 100%;
        }
        
        .brand-card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }
        
        .carousel-slide {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .price-card {
          transition: all 0.3s ease;
        }

        .price-card:hover {
          transform: translateY(-10px) scale(1.05);
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        
        .scroll-reveal {
          opacity: 0;
        }
        
        .scroll-reveal.visible {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .sparkle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          animation: sparkleAnim 1.5s ease-in-out infinite;
        }

        @keyframes sparkleAnim {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-3 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <Laptop className="w-5 h-5 animate-spin-slow" />
          <p className="text-sm md:text-base font-semibold">
            🎉 Limited Time Offer: Extra 10% OFF on all laptops! Use code: SMART10
          </p>
          <Laptop className="w-5 h-5 animate-spin-slow" />
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative w-[95vw] mx-auto rounded-3xl overflow-hidden shadow-2xl h-[450px] mb-12 mt-8 animate-scale-in">
        <div className="relative w-full h-full">
          {carouselImages.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide absolute top-0 left-0 w-full h-full ${
                currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            </div>
          ))}
        </div>
        
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg group z-30"
        >
          <ChevronLeft className="w-6 h-6 group-hover:animate-pulse" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg group z-30"
        >
          <ChevronRight className="w-6 h-6 group-hover:animate-pulse" />
        </button>
        
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Top Brands Section */}
      <div id="brands-section" data-animate className={`mb-16 ${isVisible['brands-section'] ? 'scroll-reveal visible' : 'scroll-reveal'}`}>
        <div className="flex items-center justify-between ml-6 mr-6 mb-6">
          <h2 className="text-4xl font-bold text-gradient animate-slide-in-left">Top Brands</h2>
          <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-purple-500 to-transparent rounded animate-slide-in-right"></div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-blue-50 p-10 rounded-2xl mx-4 shadow-xl">
          <div className="flex flex-wrap justify-center gap-6">
            {topBrands.map(({ name, image }, index) => (
              <div
                key={name}
                onClick={() => redirectToFilterPage(name)}
                className={`brand-card bg-white rounded-2xl overflow-hidden w-36 shadow-lg cursor-pointer animate-scale-in delay-${index}00`}
              >
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                  <img src={image} alt={name} className="w-full h-24 object-contain animate-float" />
                </div>
                <div className="p-3 text-center font-bold text-gray-800 bg-white">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Image */}
      <div className="mx-4 mb-12 animate-fade-in-up relative group">
        <img
          src="src/assets/images/buy_laptop/buy-laptop-page.webp"
          alt="Banner"
          className="w-full rounded-3xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Newly Added Laptops Section */}
      <div id="products-section" data-animate className={`mb-16 ${isVisible['products-section'] ? 'scroll-reveal visible' : 'scroll-reveal'}`}>
        <div className="flex items-center justify-between ml-6 mr-6 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-gradient animate-slide-in-left">
              Newly Added Laptops
            </h2>
            <Sparkles className="w-8 h-8 text-yellow-500 animate-spin-slow" />
          </div>
          <Link
            to="/filter-buy-laptop"
            className="text-blue-600 hover:text-blue-800 font-semibold text-lg underline transition-colors duration-300 flex items-center gap-2 group"
          >
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl mx-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-shimmer"></div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-semibold">Loading amazing laptops...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-600 py-12">{error}</p>
          ) : latestProducts.length === 0 ? (
            <p className="text-center text-gray-600 py-12">No new laptops available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {latestProducts.map((product, index) => {
                const finalPrice = calculateFinalPrice(product);
                const originalPrice = product.base_price;

                if (typeof finalPrice !== 'number' || typeof originalPrice !== 'number') {
                  return null;
                }

                return (
                  <div
                    key={product.id}
                    className={`bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg card-hover border-2 border-transparent hover:border-purple-300 animate-fade-in-up delay-${Math.min(index, 8)}00 relative group`}
                  >
                    <Link to={`/laptop/${product.id}`} className="block text-black no-underline">
                      <div className="relative overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                        <img
                          src={product.image}
                          alt={`${product.brand} ${product.series}`}
                          className="w-full h-52 object-contain mx-auto image-hover"
                        />
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse-slow shadow-lg">
                          {product.discount}% OFF
                        </div>
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          NEW
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 truncate group-hover:text-purple-600 transition-colors">{product.brand} {product.series}</h3>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-green-600">₹{finalPrice.toLocaleString('en-IN')}</span>
                        <span className="line-through text-gray-400 text-sm">₹{originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Grade: {product.condition}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-blue-600 font-medium">
                        <Shield className="w-4 h-4 mr-2" />
                        FREE 6 Months Warranty
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Price Categories Section */}
      <div id="price-section" data-animate className={`mb-16 ${isVisible['price-section'] ? 'scroll-reveal visible' : 'scroll-reveal'}`}>
        <div className="flex items-center justify-between ml-6 mr-6 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-gradient animate-slide-in-left">Shop by Budget</h2>
            <span className="text-3xl animate-bounce-slow">💸</span>
          </div>
          <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-green-500 to-transparent rounded animate-slide-in-right"></div>
        </div>

        <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {priceCategories.map((category, index) => (
            <div
              key={category.value}
              onClick={() => redirectToFilterPageWithPrice(category.value)}
              className={`price-card bg-gradient-to-br ${category.bg} rounded-2xl p-8 shadow-xl cursor-pointer relative overflow-hidden animate-scale-in delay-${(index + 1) * 100} group`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl mb-3 animate-bounce-slow">{category.icon}</div>
                <h3 className="text-white text-lg font-bold mb-1">Best-Selling Laptops</h3>
                <p className="text-white/90 text-sm mb-2">UNDER</p>
                <h2 className="text-white text-4xl font-bold mb-4">₹{category.price}</h2>
                <div className="flex items-center text-white text-sm font-semibold">
                  <span>Explore Now</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"></div>
              
              {/* Sparkle effects */}
              <div className="sparkle" style={{ top: '20%', left: '30%', animationDelay: '0s' }}></div>
              <div className="sparkle" style={{ top: '60%', left: '70%', animationDelay: '0.5s' }}></div>
              <div className="sparkle" style={{ top: '40%', right: '20%', animationDelay: '1s' }}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive CTA Banner */}
      <div className="mx-4 mb-12 animate-fade-in-up">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 gradient-shimmer opacity-20"></div>
          
          {/* Animated circles */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-10 h-10 text-yellow-300 animate-bounce-slow" />
              <h2 className="text-4xl font-bold text-white animate-pulse-slow">
                Ready to Upgrade Your Laptop?
              </h2>
              <Zap className="w-10 h-10 text-yellow-300 animate-bounce-slow" />
            </div>
            
            <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who saved big on premium refurbished laptops. Quality guaranteed with 6-month warranty!
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/filter-buy-laptop" 
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2 group animate-glow"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Browse All Laptops
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link 
                to="/sell-laptop" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Sell Your Laptop
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-8 text-white">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                <span className="font-semibold">100% Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span className="font-semibold">Certified Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-6 h-6" />
                <span className="font-semibold">Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-4 mb-16 animate-fade-in-up">
        <div className="bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 rounded-3xl p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full filter blur-3xl"></div>
          </div>
          
          <h3 className="text-3xl font-bold text-center text-gradient mb-10 relative z-10">Our Guarantees</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto relative z-10">
            
            <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-5 card-hover">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-4 flex-shrink-0 animate-bounce-slow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-0.5">6 Month Warranty</h3>
                <p className="text-gray-600 text-sm">All devices covered with comprehensive protection</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-5 card-hover">
              <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-4 flex-shrink-0 animate-bounce-slow" style={{ animationDelay: '0.2s' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-0.5">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Quick & secure shipping to your doorstep</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-5 card-hover">
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-4 flex-shrink-0 animate-bounce-slow" style={{ animationDelay: '0.4s' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-0.5">Quality Certified</h3>
                <p className="text-gray-600 text-sm">Rigorously tested & verified devices</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md flex items-center gap-5 card-hover">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-4 flex-shrink-0 animate-bounce-slow" style={{ animationDelay: '0.6s' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-0.5">Best Prices</h3>
                <p className="text-gray-600 text-sm">Save up to 70% on retail prices</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BuyLaptops;