
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './hooks/redux';
import Homepage from './pages/Homepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OTPVerification from './pages/OTPVerification'; // ADD THIS
import SellLaptop from './pages/SellLaptop';
import ChargersPage from './pages/ChargersPage';
import MousePage from './pages/MousePage';
import EarbudsPage from './pages/EarbudsPage';
import SmartWatchesPage from './pages/SmartWatchesPage';
import AccessoriesPage from './pages/Accessories';
import AccessoryDetails from './pages/AccessoryDetails';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyListings from './pages/supervisor/VerifyListings';
import ManageInventory from './pages/supervisor/ManageInventory';
import Statistics from './pages/supervisor/Statistics';
import Profile from './pages/supervisor/Profile';
import { CartProvider } from './context/CartContent';
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
import RequestDevice from "./pages/RequestDevice";
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);
  return user ? children : <Navigate to="/sign-in" replace />;
};

function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/accessories/chargers" element={<ChargersPage />} />
                <Route path="/accessories/mouses" element={<MousePage/>}/>
                <Route path="/accessories/earphones" element={<EarbudsPage/>}/>
                <Route path="/accessories/smartwatches" element={<SmartWatchesPage/>}/>
                 <Route path="/request-device" element={<RequestDevice />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/charger/:id" element={<AccessoryDetails type="charger" />} />
                <Route path="/mouse/:id" element={<AccessoryDetails type="mouse" />} />
                <Route path="/smartwatch/:id" element={<AccessoryDetails type="smartwatch" />} />
                <Route path="/earphone/:id" element={<AccessoryDetails type="earphone" />} />
                <Route path="/Accessories" element={<AccessoriesPage />} />
                <Route path="/myorders" element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                } />
                <Route path="/orders/:orderId" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/sell-phone" element={<SellPhoneForm />}/>
                <Route path="/sell-laptop" element={<SellLaptop />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/verify-otp" element={<OTPVerification />} /> {/* ADD THIS */}
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <CartPage/>
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout/>
                  </ProtectedRoute>
                } />
                <Route path="/buyphones" element={<BuyPhones/>} />
                <Route path="/buylaptops" element={<BuyLaptops/>} />
                <Route path="/filter-buy-phone" element={<FilterPhones/>}/>
                <Route path="/filter-buy-laptop" element={<FilterLaptops />} />
                <Route path="/product/:id" element={<PhoneDetails />} />
                <Route path="/laptop/:id" element={<LaptopDetails />} />
                <Route path="/about_us" element={<AboutUs/>} />
                <Route path="/blog" element={<Blog/>} />
                <Route path="/contact_us" element={<ContactUs/>} />
                <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
                <Route path="/terms" element={<TermsAndConditions/>} />
                <Route path="/payment" element={
                  <ProtectedRoute>
                    <PaymentPage/>
                  </ProtectedRoute>
                } />
                <Route path="/listings" element={
                  <ProtectedRoute>
                    <Listings/>
                  </ProtectedRoute>
                } />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/search" element={<SearchResults />} />

                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />

                {/* Supervisor Routes - Also protected */}
                <Route path="/supervisor-dashboard" element={<ProtectedRoute><SupervisorDashboard /></ProtectedRoute>} />
                <Route path="/supervisor/verify-listings" element={<ProtectedRoute><VerifyListings /></ProtectedRoute>} />
                <Route path="/supervisor/manage-inventory" element={<ProtectedRoute><ManageInventory /></ProtectedRoute>} />
                <Route path="/supervisor/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
                <Route path="/supervisor/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                
                {/* Admin Routes - Also protected */}
                <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/admin/manage-supervisors" element={<ProtectedRoute><ManageSupervisors /></ProtectedRoute>} />
              </Routes>
            </main>
          
          </div>
        </Router>
      </CartProvider>
    </Provider>
  );
}

export default App;