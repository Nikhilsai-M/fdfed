import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/images/icons/logo1.png';
import cartIcon from '../../assets/images/icons/cart-icon.png';
import profileIcon from '../../assets/images/icons/profile-icon.png';


const Header = () => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    fetchCartCount();
  }, []);

  // ✅ Detects correct cart key dynamically
  const fetchCartCount = () => {
    const allKeys = Object.keys(localStorage);
    const cartKey = allKeys.find((key) => key.startsWith("cart_user_"));
    if (!cartKey) return setCartCount(0);

    const cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
    const totalCount = cartData.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    setCartCount(totalCount);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      {/* Header Main */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="flex justify-between items-center px-6 py-3 md:px-10">
          {/* Logo */}
          <Link to="/" className="block">
            <img
              src={logo}
              alt="Logo"
              className="w-36 md:w-48 object-contain"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-4 py-2 w-1/3 hover:bg-gray-200 transition">
            <i className="fa-solid fa-magnifying-glass text-gray-500 mr-2"></i>
            <input
              type="text"
              placeholder="Search for mobiles, laptops & more"
              className="bg-transparent outline-none w-full text-gray-700"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to={user ? "/cart" : "/sign-in"}
              className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <img
                src={cartIcon}
                alt="Cart"
                className="w-6 h-6"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-md">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Profile Section */}
            {user ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition">
                  <img
                    src=
                      {user.profileImage ||
                      profileIcon}
                    
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="font-semibold capitalize">
                    {user.first_name || "User"}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/myorders"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Your Orders
                  </Link>
                  <Link
                    to="/listings"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    Your Listings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="bg-gradient-to-r from-gray-800 to-black text-white px-4 py-2 rounded-md font-semibold hover:scale-105 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Navbar */}
        <nav className="bg-gradient-to-r from-blue-800 via-indigo-800 to-purple-900 text-white font-medium shadow-inner">
          <ul className="flex flex-wrap justify-center space-x-8 py-3 text-sm md:text-base">
            <li>
              <Link to="/" className="hover:text-gray-300">
                All
              </Link>
            </li>
            <li>
              <Link to="/sell-phone" className="hover:text-gray-300">
                Sell Phone
              </Link>
            </li>
            <li>
              <Link to="/sell-laptop" className="hover:text-gray-300">
                Sell Laptop
              </Link>
            </li>

            {/* Buy Phone Dropdown */}
            <li className="relative group">
              <span className="cursor-pointer hover:text-gray-300">
                Buy Phone ▾
              </span>
              <div className="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg mt-2 w-48">
                {["Apple", "Samsung", "OnePlus"].map((brand) => (
                  <Link
                    key={brand}
                    to={`/buy-phone/${brand.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </li>

            {/* Buy Laptop Dropdown */}
            <li className="relative group">
              <span className="cursor-pointer hover:text-gray-300">
                Buy Laptop ▾
              </span>
              <div className="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg mt-2 w-48">
                {["Dell", "HP", "Apple"].map((brand) => (
                  <Link
                    key={brand}
                    to={`/buy-laptop/${brand.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </li>

            {/* Accessories Dropdown */}
            <li className="relative group">
              <Link to="/Accessories" className="cursor-pointer hover:text-gray-300">
                Accessories ▾
              </Link>
              <div className="absolute hidden group-hover:block bg-white text-gray-800 rounded-md shadow-lg mt-2 w-52">
                {["Smartwatches", "Chargers", "Earphones", "Mouses"].map(
                  (item) => (
                    <Link
                      key={item}
                      to={`/accessories/${item.toLowerCase()}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {item}
                    </Link>
                  )
                )}
              </div>
            </li>
          </ul>
        </nav>
      </header>

      {/* Spacer */}
      <div className="h-[120px] md:h-[140px]"></div>
    </>
  );
};

export default Header;
