import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 animate-fadeInUp">
      <div className="flex justify-between items-center px-4 py-2 md:px-5">
        <a href="/" className="block">
          <img src="src/assets/images/icons/logo1.png" alt="Logo" className="w-32 md:w-44 transition-transform duration-300   animate-bounceIn" />
        </a>

        <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-2 w-1/3 animate-slideInRight">
          <i className="fa-solid fa-magnifying-glass text-gray-500 mr-2"></i>
          <input type="text" placeholder="Search for mobiles, laptops & More" className="bg-transparent outline-none w-full" />
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <a href={session?.loggedIn ? '/cart' : '/sign-in'} className="flex items-center text-black hover:text-blue-500 transition-colors duration-200 animate-fadeInUp delay-200">
            <img src="src/assets/images/icons/cart-icon.png" alt="Cart" className="w-6 h-6 mr-1 transition-transform duration-300 hover:rotate-12 hover:shadow-md animate-pulseSlow" />
            <span className="text-sm md:text-base">Cart</span>
          </a>

          <div className="relative">
            <a href={session?.loggedIn ? '/profile' : '/sign-in'} className="flex items-center text-black hover:text-blue-500 transition-colors duration-200 animate-fadeInUp delay-300">
              <img src="src/assets/images/icons/profile-icon.png" alt="Profile" className="w-6 h-6 mr-1 hidden md:block transition-transform duration-300 hover:scale-110 hover:shadow-md" />
              <span className={session?.loggedIn ? 'text-sm md:text-base' : 'bg-black text-white px-3 py-1 rounded text-sm transition-transform duration-200 hover:scale-105 hover:shadow-md'}>
                {session?.loggedIn ? session.name.split(' ')[0] : 'Sign in'}
              </span>
            </a>
            {session?.loggedIn && (
              <div className="absolute top-full right-0 bg-white shadow-lg rounded-md w-40 z-50 animate-slideInRight hidden group-hover:block">
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">User Profile</a>
                <a href="/myorders" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">My Orders</a>
                <a href="/listings" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">My Listings</a>
                <a href="/cart" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Cart</a>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center md:justify-center">
        <div className="md:hidden text-xl font-bold animate-fadeInUp">Smart Exchange</div>
        <div className="md:hidden flex flex-col gap-1 cursor-pointer" onClick={toggleMenu}>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </div>

        <div className={`md:flex md:gap-x-6 ${isMenuOpen ? 'flex flex-col absolute top-full right-0 bg-white text-black w-48 shadow-md rounded-md z-50 animate-slideInRight' : 'hidden md:flex'}`}>
          <div className="relative group">
            <a href="#" className="px-4 py-2 hover:bg-blue-600 transition-colors duration-200 animate-fadeInUp delay-100">All</a>
            <div className="absolute top-full left-0 bg-white text-black shadow-md rounded-md hidden group-hover:block w-40 animate-slideInRight">
              <a href="/sell-phone" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Sell Phone</a>
              <a href="/sell-laptop" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Sell Laptop</a>
              <a href="/buy-phone" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Buy Phone</a>
              <a href="/buy-laptop" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Buy Laptop</a>
              <a href="/Accessories" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Accessories</a>
            </div>
          </div>
          <div className="relative group">
            <a href="/sell-phone" className="px-4 py-2 hover:bg-blue-600 transition-colors duration-200 animate-fadeInUp delay-200">Sell Phone</a>
            <div className="absolute top-full left-0 bg-white text-black shadow-md rounded-md hidden group-hover:block w-40 animate-slideInRight">
              
            
            
            </div>
          </div>
          <div className="relative group">
            <a href="/sell-laptop" className="px-4 py-2 hover:bg-blue-600 transition-colors duration-200 animate-fadeInUp delay-300">Sell Laptop</a>
            <div className="absolute top-full left-0 bg-white text-black shadow-md rounded-md hidden group-hover:block w-40 animate-slideInRight">
             
              
             
            </div>
          </div>
          <div className="relative group">
            <a href="/buy-phone" className="px-4 py-2 hover:bg-blue-600 transition-colors duration-200 animate-fadeInUp delay-400">Buy Phones</a>
            <div className="absolute top-full left-0 bg-white text-black shadow-md rounded-md hidden group-hover:block w-40 animate-slideInRight">
              <span className="block px-4 py-2 font-bold">Top brands</span>
              {['Apple', 'Samsung', 'Xiaomi', 'One plus', 'Realme', 'Motorola', 'Google', 'Vivo'].map(brand => (
                <a key={brand} onClick={() => goToFilterPage('phone', brand)} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">{brand}</a>
              ))}
            </div>
          </div>
          <div className="relative group">
            <a href="/buy-laptop" className="px-4 py-2 hover:bg-blue-600 transition-colors duration-200 animate-fadeInUp delay-500">Buy Laptop</a>
            <div className="absolute top-full left-0 bg-white text-black shadow-md rounded-md hidden group-hover:block w-40 animate-slideInRight">
              <span className="block px-4 py-2 font-bold">Top brands</span>
              {['Apple', 'Dell', 'Hp', 'Asus', 'Acer', 'Microsoft', 'Msi', 'Lenovo'].map(brand => (
                <a key={brand} onClick={() => goToFilterPage('laptop', brand)} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">{brand}</a>
              ))}
            </div>
          </div>
          <div className="relative group">
            <a href="/Accessories" className="px-4 py-2 hover:bg-blue-600 transition-colors duration-200 animate-fadeInUp delay-600">Accessories</a>
            <div className="absolute top-full left-0 bg-white text-black shadow-md rounded-md hidden group-hover:block w-40 animate-slideInRight">
              <a href="/Accessories?category=smartwatches" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Smart Watches</a>
              <a href="/Accessories?category=earbuds" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Ear Phones</a>
              <Link to="/chargers" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Chargers</Link>
              <a href="/Accessories?category=mouses" className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">Mouses</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;