import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentSession = JSON.parse(localStorage.getItem('currentSession'));
    setSession(currentSession);
  }, []);

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

          /* Icon Animations */
          .cart-icon:hover, .profile-icon:hover {
            transform: scale(1.1);
          }

          .cart-icon, .profile-icon {
            transition: transform 0.2s ease;
          }

          /* Sign In Button */
          .sign-in-btn {
            transition: all 0.2s ease;
          }

          .sign-in-btn:hover {
            background: #1f2937;
            transform: scale(1.05);
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
          }
        `}</style>

        <div className="flex justify-between items-center px-4 py-2 md:px-5">
          <a href="/" className="logo-container block">
            <img src="src/assets/images/icons/logo1.png" alt="Logo" className="w-32 md:w-44" />
          </a>

          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2 w-1/3 transition-all duration-300 hover:bg-gray-200">
            <i className="fa-solid fa-magnifying-glass text-gray-500 mr-2"></i>
            <input type="text" placeholder="Search for mobiles, laptops & More" className="bg-transparent outline-none w-full" />
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <a href={session?.loggedIn ? '/cart' : '/sign-in'} className="flex items-center text-black hover:text-blue-500 transition-colors duration-200">
              <img src="src/assets/images/icons/cart-icon.png" alt="Cart" className="cart-icon w-6 h-6 mr-1" />
              <span className="text-sm md:text-base">Cart</span>
            </a>

            <div className="relative group">
              <a href={session?.loggedIn ? '/profile' : '/sign-in'} className="flex items-center text-black hover:text-blue-500 transition-colors duration-200">
                <img src="src/assets/images/icons/profile-icon.png" alt="Profile" className="profile-icon w-6 h-6 mr-1 hidden md:block" />
                <span className={session?.loggedIn ? 'text-sm md:text-base' : 'sign-in-btn bg-black text-white px-3 py-1 rounded text-sm'}>
                  {session?.loggedIn ? session.name.split(' ')[0] : 'Sign in'}
                </span>
              </a>
              {session?.loggedIn && (
                <div className="dropdown-menu absolute top-full right-0 bg-white shadow-lg rounded-md w-40 z-50 hidden group-hover:block border border-gray-100">
                  <a href="/profile" className="dropdown-item block px-4 py-2">User Profile</a>
                  <a href="/myorders" className="dropdown-item block px-4 py-2">My Orders</a>
                  <a href="/listings" className="dropdown-item block px-4 py-2">My Listings</a>
                  <a href="/cart" className="dropdown-item block px-4 py-2">Cart</a>
                  <button onClick={handleLogout} className="dropdown-item block w-full text-left px-4 py-2">Logout</button>
                </div>
              )}
            </div>
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
            
            {/* ALL Button - Blue */}
            <div className="relative group">
              <a href="#" className="nav-item nav-item-all">All</a>
              <div className="dropdown-menu absolute top-full left-0 bg-white text-black shadow-lg rounded-lg hidden group-hover:block w-48 border border-gray-200 overflow-hidden">
                <a href="/sell-phone" className="dropdown-item block px-4 py-2.5">Sell Phone</a>
                <a href="/sell-laptop" className="dropdown-item block px-4 py-2.5">Sell Laptop</a>
                <a href="/buy-phone" className="dropdown-item block px-4 py-2.5">Buy Phone</a>
                <a href="/buy-laptop" className="dropdown-item block px-4 py-2.5">Buy Laptop</a>
                <a href="/Accessories" className="dropdown-item block px-4 py-2.5">Accessories</a>
              </div>
            </div>

            {/* Sell Phone - Green Border */}
            <div className="relative group">
              <a href="/sell-phone" className="nav-item nav-item-sell-phone">Sell Phone</a>
            </div>

            {/* Sell Laptop - Orange Border */}
            <div className="relative group">
              <a href="/sell-laptop" className="nav-item nav-item-sell-laptop">Sell Laptop</a>
            </div>

            {/* Buy Phone - Blue Border */}
            <div className="relative group">
              <a href="/buy-phone" className="nav-item nav-item-buy-phone">Buy Phones</a>
              <div className="dropdown-menu absolute top-full left-0 bg-white text-black shadow-lg rounded-lg hidden group-hover:block w-48 border border-gray-200 overflow-hidden">
                <span className="block px-4 py-2.5 font-bold text-gray-700 bg-gray-50">Top brands</span>
                {['Apple', 'Samsung', 'Xiaomi', 'One plus', 'Realme', 'Motorola', 'Google', 'Vivo'].map(brand => (
                  <a key={brand} onClick={() => goToFilterPage('phone', brand)} className="dropdown-item block px-4 py-2.5 cursor-pointer">{brand}</a>
                ))}
              </div>
            </div>

            {/* Buy Laptop - Purple Border */}
            <div className="relative group">
              <a href="/buy-laptop" className="nav-item nav-item-buy-laptop">Buy Laptop</a>
              <div className="dropdown-menu absolute top-full left-0 bg-white text-black shadow-lg rounded-lg hidden group-hover:block w-48 border border-gray-200 overflow-hidden">
                <span className="block px-4 py-2.5 font-bold text-gray-700 bg-gray-50">Top brands</span>
                {['Apple', 'Dell', 'Hp', 'Asus', 'Acer', 'Microsoft', 'Msi', 'Lenovo'].map(brand => (
                  <a key={brand} onClick={() => goToFilterPage('laptop', brand)} className="dropdown-item block px-4 py-2.5 cursor-pointer">{brand}</a>
                ))}
              </div>
            </div>

            {/* Accessories - Pink Border */}
            <div className="relative group">
              <a href="/Accessories" className="nav-item nav-item-accessories">Accessories</a>
              <div className="dropdown-menu absolute top-full left-0 bg-white text-black shadow-lg rounded-lg hidden group-hover:block w-48 border border-gray-200 overflow-hidden">
                <a href="/smartwatches" className="dropdown-item block px-4 py-2.5">Smart Watches</a>
                <a href="/earphones" className="dropdown-item block px-4 py-2.5">Ear Phones</a>
                <a href="/chargers" className="dropdown-item block px-4 py-2.5">Chargers</a>
                <a href="/mouses" className="dropdown-item block px-4 py-2.5">Mouses</a>
              </div>
            </div>

          </div>
        </nav>
      </header>
      
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[100px] md:h-[110px]"></div>
    </>
  );
};

export default Header;