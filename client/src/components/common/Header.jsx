import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const currentSession = JSON.parse(localStorage.getItem('currentSession'));
    setSession(currentSession);
    
    // Fetch cart count when user is logged in
    if (currentSession?.loggedIn) {
      fetchCartCount();
    }
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await fetch('/api/cart/count', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.success && typeof data.count === 'number') {
        setCartCount(data.count);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/customer/logout', { method: 'GET' });
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem('currentSession');
        if (!localStorage.getItem('rememberUser')) {
          localStorage.removeItem('rememberUser');
        }
        navigate('/');
        window.location.reload();
      } else {
        alert('Failed to log out. Please try again.');
      }
    } catch (error) {
      alert('Error during logout. Please try again.');
    }
  };

  const goToFilterPage = (type, brand) => {
    const path = type === 'phone' ? `/filter-buy-phone?brand=${encodeURIComponent(brand.toUpperCase())}` : `/filter-buy-laptop?brand=${encodeURIComponent(brand.toUpperCase())}`;
    navigate(path);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <style>{`
          /* Simple Nav Item Styles */
          .nav-item {
            position: relative;
            padding: 0.75rem 1.25rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
          }

          /* Bottom Border */
          .nav-item::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 3px;
            transition: width 0.3s ease;
          }

          .nav-item:hover::after {
            width: 100%;
          }

          /* ALL Button */
          .nav-item-all {
            background: #3b82f6;
            color: white;
            border-radius: 4px;
          }

          .nav-item-all:hover {
            background: #2563eb;
          }

          .nav-item-all::after {
            display: none;
          }

          /* Sell Phone - Green */
          .nav-item-sell-phone::after {
            background: #10b981;
          }

          .nav-item-sell-phone:hover {
            background: rgba(16, 185, 129, 0.25);
          }

          /* Sell Laptop - Green */
          .nav-item-sell-laptop::after {
            background: #10b981;
          }

          .nav-item-sell-laptop:hover {
            background: rgba(16, 185, 129, 0.25);
          }

          /* Buy Phone - Green */
          .nav-item-buy-phone::after {
            background: #10b981;
          }

          .nav-item-buy-phone:hover {
            background: rgba(16, 185, 129, 0.25);
          }

          /* Buy Laptop - Green */
          .nav-item-buy-laptop::after {
            background: #10b981;
          }

          .nav-item-buy-laptop:hover {
            background: rgba(16, 185, 129, 0.25);
          }

          /* Accessories - Green */
          .nav-item-accessories::after {
            background: #10b981;
          }

          .nav-item-accessories:hover {
            background: rgba(16, 185, 129, 0.25);
          }

          /* Dropdown Styles */
          .dropdown-menu {
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .dropdown-item {
            transition: all 0.2s ease;
          }

          .dropdown-item:hover {
            background: #f3f4f6;
            padding-left: 1.25rem;
          }

          /* Enhanced Cart & Profile Section */
          .action-btn {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
            font-weight: 500;
          }

          .action-btn:hover {
            background: #f3f4f6;
            transform: translateY(-2px);
          }

          .action-btn-icon {
            width: 24px;
            height: 24px;
            transition: transform 0.3s ease;
          }

          .action-btn:hover .action-btn-icon {
            transform: scale(1.15);
          }

          /* Cart Badge */
          .cart-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #ef4444;
            color: white;
            font-size: 0.7rem;
            font-weight: 700;
            min-width: 18px;
            height: 18px;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            animation: badge-pulse 2s ease-in-out infinite;
          }

          @keyframes badge-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          /* Profile Dropdown */
          .profile-dropdown {
            position: absolute;
            top: calc(100% + 0.5rem);
            right: 0;
            background: white;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            min-width: 200px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            border: 1px solid #e5e7eb;
            overflow: hidden;
          }

          .profile-container:hover .profile-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          .profile-dropdown-header {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            padding: 1rem;
            font-weight: 600;
          }

          .profile-dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            transition: all 0.2s ease;
            color: #374151;
            font-size: 0.95rem;
          }

          .profile-dropdown-item:hover {
            background: #f9fafb;
            color: #3b82f6;
            padding-left: 1.25rem;
          }

          .profile-dropdown-divider {
            height: 1px;
            background: #e5e7eb;
            margin: 0.25rem 0;
          }

          /* Sign In Button Enhanced */
          .sign-in-btn-enhanced {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: white;
            padding: 0.625rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .sign-in-btn-enhanced:hover {
            background: linear-gradient(135deg, #111827 0%, #000000 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          }

          /* Logo */
          .logo-container {
            transition: transform 0.2s ease;
          }

          .logo-container:hover {
            transform: scale(1.05);
          }

          /* Mobile Menu */
          .mobile-menu-btn span {
            transition: all 0.3s ease;
          }

          @media (max-width: 768px) {
            .nav-item {
              padding: 0.75rem 1rem;
              margin: 0.25rem 0.5rem;
              border-radius: 0.5rem;
            }
            
            .action-btn {
              padding: 0.375rem 0.75rem;
            }
            
            .action-btn-text {
              display: none;
            }
          }

          @media (min-width: 768px) {
            .cart-badge-mobile-hide {
              display: none;
            }
          }
        `}</style>

        <div className="flex justify-between items-center px-4 py-2 md:px-5">
          <Link to="/" className="logo-container block">
            <img src="src/assets/images/icons/logo1.png" alt="Logo" className="w-32 md:w-44" />
          </Link>

          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2 w-1/3 transition-all duration-300 hover:bg-gray-200">
            <i className="fa-solid fa-magnifying-glass text-gray-500 mr-2"></i>
            <input type="text" placeholder="Search for mobiles, laptops & More" className="bg-transparent outline-none w-full" />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Cart Button */}
            <Link to={session?.loggedIn ? '/cart' : '/sign-in'} className="action-btn relative">
              <div className="relative">
                <img src="src/assets/images/icons/cart-icon.png" alt="Cart" className="action-btn-icon" />
                {session?.loggedIn && cartCount > 0 && (
                  <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </div>
              <span className="action-btn-text text-sm md:text-base">Cart</span>
            </Link>

            {/* Profile Section */}
            {session?.loggedIn ? (
              <div className="profile-container relative">
                <div className="action-btn cursor-pointer">
                  <img src="src/assets/images/icons/profile-icon.png" alt="Profile" className="action-btn-icon hidden md:block" />
                  <span className="text-sm md:text-base font-semibold">{session.name.split(' ')[0]}</span>
                  <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="text-sm opacity-90">Welcome back,</div>
                    <div className="text-base">{session.name}</div>
                  </div>
                  
                  <Link to="/profile" className="profile-dropdown-item">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  
                  <Link to="/myorders" className="profile-dropdown-item">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </Link>
                  
                  <Link to="/listings" className="profile-dropdown-item">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Listings
                  </Link>
                  
                  <Link to="/cart" className="profile-dropdown-item">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                  </Link>
                  
                  <div className="profile-dropdown-divider"></div>
                  
                  <button onClick={handleLogout} className="profile-dropdown-item w-full text-left text-red-600 hover:text-red-700 hover:bg-red-50">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/sign-in" className="sign-in-btn-enhanced">
                Sign In
              </Link>
            )}
          </div>
        </div>

        <nav className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center md:justify-center">
          <div className="md:hidden text-xl font-bold">Smart Exchange</div>
          <div className="mobile-menu-btn md:hidden flex flex-col gap-1 cursor-pointer" onClick={toggleMenu}>
            <span className={`w-6 h-0.5 bg-white ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </div>

          <div className={`md:flex md:gap-x-2 ${isMenuOpen ? 'flex flex-col absolute top-full right-0 bg-white text-black w-48 shadow-md rounded-md z-50' : 'hidden md:flex'}`}>
            
            {/* ALL Button */}
            <div className="relative group">
              <Link to="#" className="nav-item nav-item-all">All</Link>
              <div className="dropdown-menu absolute top-full left-0 bg-white text-black shadow-lg rounded-lg hidden group-hover:block w-48 border border-gray-200 overflow-hidden">
                <Link to="/sell-phone" className="dropdown-item block px-4 py-2.5">Sell Phone</Link>
                <Link to="/sell-laptop" className="dropdown-item block px-4 py-2.5">Sell Laptop</Link>
                <Link to="/buy-phone" className="dropdown-item block px-4 py-2.5">Buy Phone</Link>
                <Link to="/buy-laptop" className="dropdown-item block px-4 py-2.5">Buy Laptop</Link>
                <Link to="/Accessories" className="dropdown-item block px-4 py-2.5">Accessories</Link>
              </div>
            </div>

            {/* Sell Phone */}
            <div className="relative group">
              <Link to="/sell-phone" className="nav-item nav-item-sell-phone">Sell Phone</Link>
            </div>

            {/* Sell Laptop */}
            <div className="relative group">
              <Link to="/sell-laptop" className="nav-item nav-item-sell-laptop">Sell Laptop</Link>
            </div>

            {/* Buy Phone */}
            <div className="relative group">
              <Link to="/buy-phone" className="nav-item nav-item-buy-phone">Buy Phones</Link>
              <div className="dropdown-menu absolute top-full left-0 bg-white text-black shadow-lg rounded-lg hidden group-hover:block w-48 border border-gray-200 overflow-hidden">
                <span className="block px-4 py-2.5 font-bold text-gray-700 bg-gray-50">Top brands</span>
                {['Apple', 'Samsung', 'Xiaomi', 'One plus', 'Realme', 'Motorola', 'Google', 'Vivo'].map(brand => (
                  <Link key={brand} to={`/filter-buy-phone?brand=${encodeURIComponent(brand.toUpperCase())}`} className="dropdown-item block px-4 py-2.5 cursor-pointer">{brand}</Link>
                ))}
              </div>
            </div>

            {/* Buy Laptop */}
            <div className="relative group">
              <Link to="/buy-laptop" className="nav-item nav-item-buy-laptop">Buy Laptop</Link>
              <div className="dropdown-menu absolute top-full left-0 bg-white text-black shadow-lg rounded-lg hidden group-hover:block w-48 border border-gray-200 overflow-hidden">
                <span className="block px-4 py-2.5 font-bold text-gray-700 bg-gray-50">Top brands</span>
                {['Apple', 'Dell', 'Hp', 'Asus', 'Acer', 'Microsoft', 'Msi', 'Lenovo'].map(brand => (
                  <Link key={brand} to={`/filter-buy-laptop?brand=${encodeURIComponent(brand.toUpperCase())}`} className="dropdown-item block px-4 py-2.5 cursor-pointer">{brand}</Link>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div className="relative group">
              <Link to="/Accessories" className="nav-item nav-item-accessories">Accessories</Link>
              <div className="dropdown-menu absolute top-full left-0 bg-white text-black shadow-lg rounded-lg hidden group-hover:block w-48 border border-gray-200 overflow-hidden">
                <Link to="/smartwatches" className="dropdown-item block px-4 py-2.5">Smart Watches</Link>
                <Link to="/earphones" className="dropdown-item block px-4 py-2.5">Ear Phones</Link>
                <Link to="/chargers" className="dropdown-item block px-4 py-2.5">Chargers</Link>
                <Link to="/mouses" className="dropdown-item block px-4 py-2.5">Mouses</Link>
              </div>
            </div>

          </div>
        </nav>
      </header>
      
      <div className="h-[100px] md:h-[110px]"></div>
    </>
  );
};

export default Header;