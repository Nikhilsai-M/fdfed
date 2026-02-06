import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/latest-products', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch latest products: ${response.status}`);
        }
  
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid response format');
        setProducts(data);
      } catch (error) {
        console.error('❌ Error fetching latest products:', error);
        setProducts([]); // fallback empty
      }
    };
  
    fetchLatestProducts();
    const interval = setInterval(fetchLatestProducts, 30000);
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 4000);
  
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
  }, [products]);

  const calculateFinalPrice = (product) => {
    const price = parseFloat(product.base_price || 0);
    const discount = parseFloat(product.discount || 0);
    return Number((price - (price * discount / 100)).toFixed(2));
  };

  const redirectToFilterPage = (brand) => {
    navigate(`/filter-buy-phone?brand=${brand}`);
  };

  const slides = [
    'src/assets/images/carousal/home/pic-1.jpeg',
    'src/assets/images/carousal/home/pic-2.jpeg',
    'src/assets/images/carousal/home/pic-3.jpeg',
    'src/assets/images/carousal/home/pic-4.jpeg',
  ];
  const slideLinks = ['', '', '/Accessories', '/buy-phone'];

  return (
    <div className="pt-6 bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 min-h-screen">
      <Header />
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes floatAnimation {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: floatAnimation 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
        
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
        
        .badge-glow {
          animation: pulse 2s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
      `}</style>

      {/* Hero Carousel */}
      <div className="relative w-[95vw] mx-auto rounded-3xl overflow-hidden shadow-2xl h-[450px] mb-12 animate-scale-in">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
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
              {slideLinks[index] && (
                <Link to={slideLinks[index]} className="block w-full h-full absolute top-0 left-0"></Link>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + 4) % 4)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg group"
        >
          <i className="fa-solid fa-chevron-left group-hover:animate-pulse"></i>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % 4)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-lg group"
        >
          <i className="fa-solid fa-chevron-right group-hover:animate-pulse"></i>
        </button>
        
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
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

      {/* Newly Added Products */}
      <div id="products-section" data-animate className={`mb-16 ${isVisible['products-section'] ? 'scroll-reveal visible' : 'scroll-reveal'}`}>
        <div className="flex items-center justify-between ml-6 mr-6 mb-6">
          <h2 className="text-4xl font-bold text-gradient animate-slide-in-left">
            Newly Added Products
          </h2>
          <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-blue-500 to-transparent rounded animate-slide-in-right"></div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-100 via-white to-gray-100 p-6 overflow-x-auto rounded-2xl mx-4 shadow-inner">
          <div className="flex gap-6 min-w-max pb-4">
            {products.length === 0 ? (
              <div className="w-full text-center py-12">
                <div className="animate-pulse-slow text-gray-400 text-lg">Loading amazing products...</div>
              </div>
            ) : (
              products.map((product, index) => {
                const finalPrice = calculateFinalPrice(product);
                return (
                  <div
                    key={product.id}
                    className={`bg-white p-6 rounded-2xl shadow-lg min-w-[280px] card-hover border border-gray-100 animate-fade-in-up delay-${Math.min(index, 8)}00`}
                  >
                    <Link 
                        to={product.series ? `/laptop/${product.id}` : `/product/${product.id}`} 
                        className="block text-black no-underline"
                      >

                      <div className="relative overflow-hidden rounded-xl mb-4 bg-gray-50 p-4">
                        <img
                          src={product.image}
                          alt={`${product.brand} ${product.model}`}
                          className="w-full h-52 object-contain mx-auto image-hover"
                        />
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse-slow">
                          {product.discount}% OFF
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2 truncate">{product.brand} {product.model}</h3>
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-green-600">₹{finalPrice.toLocaleString('en-IN')}</span>
                        <span className="line-through text-gray-400 text-sm">₹{product.base_price.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Grade: {product.condition}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-blue-600 font-medium">
                        <i className="fa-solid fa-shield-halved mr-2"></i>
                        FREE 6 Months Warranty
                      </div>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Brands */}
      <div id="brands-section" data-animate className={`mb-16 ${isVisible['brands-section'] ? 'scroll-reveal visible' : 'scroll-reveal'}`}>
        <div className="flex items-center justify-between ml-6 mr-6 mb-6">
          <h2 className="text-4xl font-bold text-gradient animate-slide-in-left">Top Brands</h2>
          <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-purple-500 to-transparent rounded animate-slide-in-right"></div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-blue-50 p-10 rounded-2xl mx-4 shadow-xl">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { brand: 'Apple', img: 'src/assets/images/topbrands/iphone.webp' },
              { brand: 'Samsung', img: 'src/assets/images/topbrands/samsung.webp' },
              { brand: 'Xiaomi', img: 'src/assets/images/topbrands/xiaomi.webp' },
              { brand: 'OnePlus', img: 'src/assets/images/topbrands/oneplus.webp' },
              { brand: 'Realme', img: '/src/assets/images/topbrands/realme.webp' },
              { brand: 'Motorola', img: 'src/assets/images/topbrands/motorola.webp' },
              { brand: 'Google', img: '/src/assets/images/topbrands/google pixel.webp' },
              { brand: 'Vivo', img: '/src/assets/images/topbrands/vivo.png' },
            ].map(({ brand, img }, index) => (
              <div
                key={brand}
                onClick={() => redirectToFilterPage(brand)}
                className={`brand-card bg-white rounded-2xl overflow-hidden w-36 shadow-lg cursor-pointer animate-scale-in delay-${index}00`}
              >
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                  <img src={img} alt={brand} className="w-full h-24 object-contain animate-float" />
                </div>
                <div className="p-3 text-center font-bold text-gray-800 bg-white">{brand}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grade Information Cards */}
      <div id="grades-section" data-animate className={`mb-16 ${isVisible['grades-section'] ? 'scroll-reveal visible' : 'scroll-reveal'}`}>
        <div className="flex items-center justify-between ml-6 mr-6 mb-8">
          <h2 className="text-4xl font-bold text-gradient animate-slide-in-left">Quality Grades</h2>
          <div className="h-1 flex-1 mx-6 bg-gradient-to-r from-green-500 to-transparent rounded animate-slide-in-right"></div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-10 rounded-2xl mx-4 shadow-xl">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                badge: 'SuperB Refurbished',
                color: 'from-teal-400 to-teal-600',
                icon: '⭐',
                features: ['Perfect working', '6 months assured warranty', 'Very minimal scratches/Dots/marks on display and back panel', 'No Discolouration on display', 'No scratches on camera', 'No gap between back panel and body'],
              },
              {
                badge: 'Very Good Refurbished',
                color: 'from-blue-500 to-blue-700',
                icon: '✨',
                features: ['Perfect working', '6 months assured warranty', 'Minimal scratches/Dots/marks on display and back panel', 'Very minimal discolouration on display', 'Very minimal scratches on camera*', 'Might have slight gap between back panel and body'],
              },
              {
                badge: 'Good Refurbished',
                color: 'from-indigo-600 to-purple-700',
                icon: '💫',
                features: ['Perfect working', '6 months assured warranty', 'Few scratches/Dots/marks on display and back panel', 'Few discolouration on Display', 'Few scratches on camera** does not restrict lens view', 'Might have Slight gap between back Panel and body', 'Might have usage marks on back Panel'],
              },
            ].map(({ badge, color, icon, features }, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 shadow-2xl w-96 relative card-hover border-2 border-gray-100 animate-fade-in-up delay-${(index + 1) * 200}`}
              >
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br ${color} text-white font-bold px-8 py-4 rounded-full shadow-xl badge-glow flex items-center gap-2`}>
                  <span className="text-2xl">{icon}</span>
                  <span>{badge}</span>
                </div>
                
                <ul className="mt-10 space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-700 group">
                      <span className="text-green-500 mr-3 text-xl transform group-hover:scale-125 transition-transform duration-300">✓</span>
                      <span className="group-hover:text-gray-900 transition-colors duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mx-4 mb-12 animate-fade-in-up">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 gradient-shimmer opacity-20"></div>
          <h2 className="text-4xl font-bold text-white mb-4 relative z-10 animate-pulse-slow">
            Ready to Upgrade?
          </h2>
          <p className="text-white text-lg mb-8 relative z-10">
            Discover the best deals on refurbished devices with warranty
          </p>
          <div className="flex gap-4 justify-center relative z-10">
            <Link to="/buy-phone" className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
              Shop Phones
            </Link>
            <Link to="/sell-phone" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300">
              Sell Your Device
            </Link>
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

export default HomePage;