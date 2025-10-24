import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Homepage from './pages/Homepage';
import Sell_laptop from './pages/Sell_laptop';
import AccessoryRouter from './components/AccessoryRouter';
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            
            
            <Route path="/Accessories" element={<AccessoryRouter />} />
            
            
            <Route path="/mouse/:id" element={<div>Mouse Detail Page</div>} />
            
           
            <Route path="/sell-phone" element={<div>Sell Phone Page</div>} />
            <Route path="/sell-laptop" element={<Sell_laptop />} />
            <Route path="/buy-phone" element={<div>Buy Phone Page</div>} />
            <Route path="/buy-laptop" element={<div>Buy Laptop Page</div>} />
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/cart" element={<div>Cart Page</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;