import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import LandingPage from './pages/LandingPage';
import Homepage from './pages/Homepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OTPVerification from './pages/OTPVerification';
import SellLaptop from './pages/SellLaptop';
import ChargersPage from './pages/ChargersPage';
import MousePage from './pages/MousePage';
import EarbudsPage from './pages/EarbudsPage';
import SmartWatchesPage from './pages/SmartWatchesPage';
import AccessoriesPage from './pages/Accessories';
import AccessoryDetails from './pages/AccessoryDetails';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import AdminDashboard from './pages/admin/adminDashboard';
import VerifyListings from './pages/supervisor/VerifyListings';
import ManageInventory from './pages/supervisor/ManageInventory';
import Statistics from './pages/supervisor/Statistics';
import Profile from './pages/supervisor/Profile';
import { CartProvider } from './context/CartContent';
import { NotificationProvider } from './context/NotificationContext';
import UserProfile from './pages/UserProfile';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';
import BuyPhones from './pages/Buyphones';
import BuyLaptops from './pages/Buylaptops';
import FilterPhones from './pages/filter-phones';
import FilterLaptops from './pages/FilterLaptops';
import Listings from './pages/listings';
import SellPhoneForm from './pages/SellPhone';
import AboutUs from './pages/AboutUs';
import Blog from './pages/Blog';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivayPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import PaymentPage from './pages/Payment';
import LaptopDetails from './pages/LaptopDetails';
import PhoneDetails from './pages/PhoneDetails';
import ForgotPassword from './pages/ForgotPassword';
import SearchResults from './pages/SearchResults';
import Analytics from './pages/admin/AdminAnalytics';
import ManageSupervisors from './pages/admin/ManageSupervisors';
import Notifications from './pages/Notifications.jsx';
import RequestDevice from './pages/RequestDevice';
import SellerDashboard from './pages/seller/Dashboard.jsx';
import SellerSignup from './pages/seller/SellerSignup.jsx';
import SellerLogin from './pages/seller/SellerSignIn.jsx';
import ProductAnalytics from './pages/admin/ProductAnalytics';
import ManageInventorySeller from './pages/seller/ManageInventory.jsx';
import AddProduct from './pages/seller/AddProduct.jsx';
import SellerOrders from './pages/seller/SellerOrders.jsx';
import RevenueAnalytics from './pages/admin/RevenueAnalytics';
import SellerProfile from './pages/seller/SellerProfile.jsx';
import SellerActivity from './pages/admin/SellerActivity';
import SellerOTPVerification from './pages/seller/SellerOTPVerification';
import { logout } from './store/slices/authSlice';

const API_BASE_URL = 'http://localhost:3000';

const getValidationRequest = (role) => {
  switch (role) {
    case 'admin':
      return { url: `${API_BASE_URL}/api/admin/statistics` };
    case 'supervisor':
      return { url: `${API_BASE_URL}/api/supervisor/profile` };
    case 'customer':
    default:
      return { url: `${API_BASE_URL}/api/user/profile` };
  }
};

const FullScreenLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const allowedRolesKey = allowedRoles?.join(',') || '';

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      if (!user) {
        if (isMounted) {
          setIsAuthorized(false);
          setIsChecking(false);
        }
        return;
      }

      if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        if (isMounted) {
          setIsAuthorized(false);
          setIsChecking(false);
        }
        return;
      }

      const validationRequest = getValidationRequest(user.role);

      try {
        const response = await fetch(validationRequest.url, {
          method: 'GET',
          credentials: 'include',
        });

        if (!isMounted) {
          return;
        }

        if (response.status === 401 || response.status === 403) {
          dispatch(logout());
          setIsAuthorized(false);
          setIsChecking(false);
          return;
        }

        setIsAuthorized(response.ok);
        setIsChecking(false);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setIsAuthorized(false);
        setIsChecking(false);
      }
    };

    setIsChecking(true);
    validateSession();

    return () => {
      isMounted = false;
    };
  }, [allowedRolesKey, dispatch, location.pathname, user]);

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  if (isChecking) {
    return <FullScreenLoader />;
  }

  if (!isAuthorized) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return children;
};

const SellerProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const validateSellerSession = async () => {
      const sellerToken = localStorage.getItem('sellerToken');

      if (!sellerToken) {
        if (isMounted) {
          setIsAuthorized(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/seller/dashboard`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!isMounted) {
          return;
        }

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('sellerToken');
          setIsAuthorized(false);
          setIsChecking(false);
          return;
        }

        setIsAuthorized(response.ok);
        setIsChecking(false);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setIsAuthorized(false);
        setIsChecking(false);
      }
    };

    setIsChecking(true);
    validateSellerSession();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (!localStorage.getItem('sellerToken')) {
    return <Navigate to="/seller/login" replace state={{ from: location }} />;
  }

  if (isChecking) {
    return <FullScreenLoader />;
  }

  if (!isAuthorized) {
    return <Navigate to="/seller/login" replace state={{ from: location }} />;
  }

  return children;
};

const FirstVisitRedirect = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const visited = sessionStorage.getItem('hasVisitedLanding');

    if (!visited && location.pathname === '/') {
      navigate('/welcome', { replace: true });
    }
  }, [navigate, location]);

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <FirstVisitRedirect>
              <div className="flex flex-col min-h-screen">
                <main className="flex-grow">
                  <Routes>
                    <Route path="/welcome" element={<LandingPage />} />
                    <Route path="/" element={<Homepage />} />
                    <Route path="/accessories/chargers" element={<ChargersPage />} />
                    <Route path="/accessories/mouses" element={<MousePage />} />
                    <Route path="/accessories/earphones" element={<EarbudsPage />} />
                    <Route path="/accessories/smartwatches" element={<SmartWatchesPage />} />
                    <Route path="/request-device" element={<RequestDevice />} />
                    <Route path="/profile" element={<ProtectedRoute allowedRoles={['customer']}><UserProfile /></ProtectedRoute>} />
                    <Route path="/charger/:id" element={<AccessoryDetails type="charger" />} />
                    <Route path="/mouse/:id" element={<AccessoryDetails type="mouse" />} />
                    <Route path="/smartwatch/:id" element={<AccessoryDetails type="smartwatch" />} />
                    <Route path="/earphone/:id" element={<AccessoryDetails type="earphone" />} />
                    <Route path="/Accessories" element={<AccessoriesPage />} />
                    <Route path="/myorders" element={<ProtectedRoute allowedRoles={['customer']}><MyOrders /></ProtectedRoute>} />
                    <Route path="/orders/:orderId" element={<ProtectedRoute allowedRoles={['customer']}><Orders /></ProtectedRoute>} />
                    <Route path="/sell-phone" element={<SellPhoneForm />} />
                    <Route path="/sell-laptop" element={<SellLaptop />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/signin" element={<Navigate to="/sign-in" replace />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/verify-otp" element={<OTPVerification />} />
                    <Route path="/cart" element={<ProtectedRoute allowedRoles={['customer']}><CartPage /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute allowedRoles={['customer']}><Checkout /></ProtectedRoute>} />
                    <Route path="/buyphones" element={<BuyPhones />} />
                    <Route path="/buylaptops" element={<BuyLaptops />} />
                    <Route path="/filter-buy-phone" element={<FilterPhones />} />
                    <Route path="/filter-buy-laptop" element={<FilterLaptops />} />
                    <Route path="/product/:id" element={<PhoneDetails />} />
                    <Route path="/laptop/:id" element={<LaptopDetails />} />
                    <Route path="/about_us" element={<AboutUs />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact_us" element={<ContactUs />} />
                    <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/payment" element={<ProtectedRoute allowedRoles={['customer']}><PaymentPage /></ProtectedRoute>} />
                    <Route path="/listings" element={<ProtectedRoute allowedRoles={['customer']}><Listings /></ProtectedRoute>} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/notifications" element={<ProtectedRoute allowedRoles={['customer']}><Notifications /></ProtectedRoute>} />
                    <Route path="/products" element={<Navigate to="/" replace />} />
                    <Route path="/supervisor-dashboard" element={<ProtectedRoute allowedRoles={['supervisor']}><SupervisorDashboard /></ProtectedRoute>} />
                    <Route path="/supervisor/verify-listings" element={<ProtectedRoute allowedRoles={['supervisor']}><VerifyListings /></ProtectedRoute>} />
                    <Route path="/supervisor/manage-inventory" element={<ProtectedRoute allowedRoles={['supervisor']}><ManageInventory /></ProtectedRoute>} />
                    <Route path="/supervisor/statistics" element={<ProtectedRoute allowedRoles={['supervisor']}><Statistics /></ProtectedRoute>} />
                    <Route path="/supervisor/profile" element={<ProtectedRoute allowedRoles={['supervisor']}><Profile /></ProtectedRoute>} />
                    <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />
                    <Route path="/admin/manage-supervisors" element={<ProtectedRoute allowedRoles={['admin']}><ManageSupervisors /></ProtectedRoute>} />
                    <Route path="/admin/product-analytics" element={<ProtectedRoute allowedRoles={['admin']}><ProductAnalytics /></ProtectedRoute>} />
                    <Route path="/admin/revenue" element={<ProtectedRoute allowedRoles={['admin']}><RevenueAnalytics /></ProtectedRoute>} />
                    <Route path="/admin/seller-activity" element={<ProtectedRoute allowedRoles={['admin']}><SellerActivity /></ProtectedRoute>} />
                    <Route path="/seller/signup" element={<SellerSignup />} />
                    <Route path="/seller/login" element={<SellerLogin />} />
                    <Route path="/seller/dashboard" element={<SellerProtectedRoute><SellerDashboard /></SellerProtectedRoute>} />
                    <Route path="/seller/manage-inventory" element={<SellerProtectedRoute><ManageInventorySeller /></SellerProtectedRoute>} />
                    <Route path="/seller/add-product" element={<SellerProtectedRoute><AddProduct /></SellerProtectedRoute>} />
                    <Route path="/seller/orders" element={<SellerProtectedRoute><SellerOrders /></SellerProtectedRoute>} />
                    <Route path="/seller/profile" element={<SellerProtectedRoute><SellerProfile /></SellerProtectedRoute>} />
                    <Route path="/seller/benefits" element={<Navigate to="/seller/signup" replace />} />
                    <Route path="/seller/verify-otp" element={<SellerOTPVerification />} />
                  </Routes>
                </main>
              </div>
            </FirstVisitRedirect>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </Provider>
  );
}

export default App;
