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
import ChargerDetails from './pages/ChargerDetails';
import SupervisorDashboard from './pages/SupervisorDashboard'; // Add this import

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/chargers" element={<ChargersPage />} />
            <Route path="/mouses" element={<MousePage/>}/>
            <Route path="/earphones" element={<EarbudsPage/>}/>
            <Route path="/smartwatches" element={<SmartWatchesPage/>}/>
            
            <Route path="/chargers/:id" element={<ChargerDetails/>} />
            <Route path="/Accessories" element={<AccessoriesPage />} />
           
            <Route path="/sell-phone" element={<div>Sell Phone Page</div>} />
            <Route path="/sell-laptop" element={<SellLaptop />} />
            <Route path="/buy-phone" element={<div>Buy Phone Page</div>} />
            <Route path="/buy-laptop" element={<div>Buy Laptop Page</div>} />
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/cart" element={<div>Cart Page</div>} />
            <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} /> {/* Add this route */}
          </Routes>
        </main>
      
      </div>
    </Router>
  );
}

export default App;