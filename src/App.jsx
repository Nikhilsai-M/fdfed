import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Homepage from './pages/Homepage';
import Accessories from './pages/Accessories';
import MousePage from './pages/MousePage';

// Component to handle category-based routing for Accessories
const AccessoryRouter = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');

  // Route to specific category pages based on query parameter
  if (category === 'mouses') {
    return <MousePage />;
  }
  // Add more category pages here as needed
  // if (category === 'chargers') {
  //   return <ChargersPage />;
  // }
  // if (category === 'earbuds') {
  //   return <EarbudsPage />;
  // }
  // if (category === 'smartwatches') {
  //   return <SmartWatchesPage />;
  // }

  // Default to main accessories page
  return <Accessories />;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            
            {/* Accessories route with category query parameter */}
            <Route path="/Accessories" element={<AccessoryRouter />} />
            
            {/* Individual mouse detail page */}
            <Route path="/mouse/:id" element={<div>Mouse Detail Page</div>} />
            
            {/* Other routes */}
            <Route path="/sell-phone" element={<div>Sell Phone Page</div>} />
            <Route path="/sell-laptop" element={<div>Sell Laptop Page</div>} />
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