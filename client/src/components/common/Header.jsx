import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/icons/logo1.png";
import cartIcon from "../../assets/images/icons/cart-icon.png";
import profileIcon from "../../assets/images/icons/profile-icon.png";
import { useCart } from "../../context/CartContent"; 
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";
import axios from "axios";

const Header = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { cartCount, fetchCartCount } = useCart(); 
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    fetchCartCount();
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const response = await axios.get('/api/customer/notifications', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setNotifications(response.data.notifications.slice(0, 5)); // Show only latest 5
        setNotificationCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await axios.put(`/api/customer/notifications/${notificationId}/read`, {}, {
        withCredentials: true
      });
      
      // Update local state
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
      setNotificationCount(prev => Math.max(0, prev - 1));
      
      // Navigate to listings page
      navigate('/listings');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return { bg: 'bg-green-100', text: 'text-green-600', icon: 'fa-check' };
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-600', icon: 'fa-times' };
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: 'fa-clock' };
      case 'processing': return { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'fa-gear' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600', icon: 'fa-bell' };
    }
  };

  const getDeviceIcon = (deviceType) => {
    return deviceType === 'phone' ? 'fa-solid fa-mobile-screen' : 'fa-solid fa-laptop';
  };

  return (
    <>
      {/* Header Main */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="flex justify-between items-center px-6 py-3 md:px-10">
          {/* Logo */}
          <Link to="/" className="block">
            <img src={logo} alt="Logo" className="w-36 md:w-48 object-contain" />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-4 py-2 w-1/3 hover:bg-gray-200 transition">
            <i className="fa-solid fa-magnifying-glass text-gray-500 mr-2"></i>
            <input
              type="text"
              placeholder="Search for mobiles, laptops & more"
              className="bg-transparent outline-none w-full text-gray-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = e.target.value.trim();
                  if (query) {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                  }
                }
              }}
            />
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={() => navigate('/search')}
            className="md:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-600 transition"
            aria-label="Search"
          >
            <i className="fa-solid fa-magnifying-glass text-xl"></i>
          </button>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Notifications - Listing Status Only */}
            {user && (
              <div className="relative group">
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition"
                  aria-label="Notifications"
                >
                  <i className="fa-regular fa-bell text-xl"></i>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown - Only Listings */}
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-96 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-96 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Listing Notifications</h3>
                    <p className="text-xs text-gray-500">Updates about your device listings</p>
                  </div>
                  
                  <div className="overflow-y-auto max-h-64">
                    {loadingNotifications ? (
                      <div className="px-4 py-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const statusColor = getStatusColor(notification.status);
                        
                        return (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id)}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Status Icon */}
                              <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${statusColor.bg}`}>
                                <i className={`fa-solid ${statusColor.icon} ${statusColor.text}`}></i>
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <i className={`${getDeviceIcon(notification.device_type)} text-gray-500`}></i>
                                      <h4 className="font-medium text-gray-800">
                                        {notification.device_type === 'phone' ? 'Phone' : 'Laptop'} Listing
                                      </h4>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">{notification.brand} {notification.model}</span>
                                    </p>
                                    <p className={`text-sm mt-1 ${statusColor.text}`}>
                                      <span className="font-medium capitalize">{notification.status}</span>
                                      {notification.status === 'rejected' && notification.rejection_reason && 
                                        ` - ${notification.rejection_reason}`
                                      }
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className="text-xs text-gray-400 block">
                                      {notification.time}
                                    </span>
                                    {notification.price && notification.status === 'approved' && (
                                      <span className="text-xs font-semibold text-green-600 mt-1 block">
                                        ₹{notification.price.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <i className="fa-regular fa-bell text-3xl mb-2"></i>
                        <p>No listing updates</p>
                        <p className="text-sm mt-1">You'll get notified here when your listings are updated</p>
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 text-center">
                      <Link
                        to="/notifications"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View all listing notifications
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            

            {/* Cart */}
            <Link
              to={user ? "/cart" : "/sign-in"}
              className="relative flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <img src={cartIcon} alt="Cart" className="w-6 h-6" />
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
                    src={user.profileImage || profileIcon}
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
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
            <div className="cursor-pointer hover:text-gray-300 py-2">
              <Link to="/" className="hover:text-gray-300">
                All
              </Link>
              </div>
            </li>
            <li>
            <div className="cursor-pointer hover:text-gray-300 py-2">
              <Link to="/sell-phone" className="hover:text-gray-300">
                Sell Phone
              </Link>
              </div>
            </li>
            <li>
            <div className="cursor-pointer hover:text-gray-300 py-2">
              <Link to="/sell-laptop" className="hover:text-gray-300">
                Sell Laptop
              </Link>
              </div>
            </li>
            <li>
  <div className="cursor-pointer hover:text-gray-300 py-2">
    <Link to="/request-device" className="hover:text-gray-300">
      Request Device
    </Link>
  </div>
</li>

            {/* Buy Phone Dropdown - FIXED */}
            <li className="relative group">
              <div className="cursor-pointer hover:text-gray-300 py-2">
                <Link to='/buyphones' className="hover:text-gray-300">
                  Buy Phone ▾
                </Link>
                {/* Dropdown positioned directly below with no gap */}
                <div className="absolute left-0 top-full mt-0 bg-white text-gray-800 rounded-md shadow-lg w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
                  {["Apple", "Samsung", "OnePlus"].map((brand) => (
                    <Link
                      key={brand}
                      to={`/filter-buy-phone?brand=${brand.toLowerCase()}`}
                      className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* Buy Laptop Dropdown - FIXED */}
            <li className="relative group">
              <div className="cursor-pointer hover:text-gray-300 py-2">
                <Link to='/buylaptops' className="hover:text-gray-300">
                  Buy Laptop ▾
                </Link>
                {/* Dropdown positioned directly below with no gap */}
                <div className="absolute left-0 top-full mt-0 bg-white text-gray-800 rounded-md shadow-lg w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
                  {["Dell", "HP", "Apple", "Lenovo", "Asus"].map((brand) => (
                    <Link
                      key={brand}
                      to={`/filter-buy-laptop?brand=${brand.toLowerCase()}`}
                      className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            {/* Accessories Dropdown - FIXED */}
            <li className="relative group">
              <div className="cursor-pointer hover:text-gray-300 py-2">
                <Link to="/Accessories" className="hover:text-gray-300">
                  Accessories ▾
                </Link>
                {/* Dropdown positioned directly below with no gap */}
                <div className="absolute left-0 top-full mt-0 bg-white text-gray-800 rounded-md shadow-lg w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
                  {["Smartwatches", "Chargers", "Earphones", "Mouses"].map(
                    (item) => (
                      <Link
                        key={item}
                        to={`/accessories/${item.toLowerCase()}`}
                        className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                      >
                        {item}
                      </Link>
                    )
                  )}
                </div>
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