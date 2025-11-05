import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Homepage from './pages/Homepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SellLaptop from './pages/SellLaptop';
import ChargersPage from './pages/ChargersPage';
import MousePage from './pages/MousePage';
import EarbudsPage from './pages/EarbudsPage';
import SmartWatchesPage from './pages/SmartWatchesPage';
import AccessoriesPage from './pages/Accessories';
import AccessoryDetails from './pages/AccessoryDetails';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
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


import SellPhoneForm from './pages/SellPhone';
import AboutUs from './pages/AboutUS';
import Blog from './pages/Blog';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivayPolicy';
import TermsAndConditions from './pages/TermsAndConditions';  
import PaymentPage from './pages/Payment';
function App() {
  return (
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
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/charger/:id" element={<AccessoryDetails type="charger" />} />
            <Route path="/mouse/:id" element={<AccessoryDetails type="mouse" />} />
            <Route path="/smartwatch/:id" element={<AccessoryDetails type="smartwatch" />} />
            <Route path="/earphone/:id" element={<AccessoryDetails type="earphone" />} />
            <Route path="/Accessories" element={<AccessoriesPage />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/orders/:orderId" element={<Orders />} />
            <Route path="/sell-phone" element={<SellPhoneForm />}/>
            <Route path="/sell-laptop" element={<SellLaptop />} />
            <Route path="/buy-phone" element={<div>Buy Phone Page</div>} />
            <Route path="/buy-laptop" element={<div>Buy Laptop Page</div>} />
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/cart" element={<CartPage/>} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/buyphones" element={<BuyPhones/>} />
            <Route path="/buylaptops" element={<BuyLaptops/>} />
            <Route path="/about_us" element={<AboutUs/>} />
            <Route path="/blog" element={<Blog/>} />
            <Route path="/contact_us" element={<ContactUs/>} />
            <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
            <Route path="/terms" element={<TermsAndConditions/>} />
            <Route path="/payment" element={<PaymentPage/>} />
            {/* Supervisor Routes */}
            <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
            <Route path="/supervisor/verify-listings" element={<VerifyListings />} />
            <Route path="/supervisor/manage-inventory" element={<ManageInventory />} />
            <Route path="/supervisor/statistics" element={<Statistics />} />
            <Route path="/supervisor/profile" element={<Profile />} />
          </Routes>
        </main>
      
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;