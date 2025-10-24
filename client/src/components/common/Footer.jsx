import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 animate-fadeInUp">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-around items-center px-4">
        <div className="mb-6 md:mb-0 text-center md:text-left animate-slideInRight">
          <h2 className="text-2xl font-bold mb-2 transition-transform duration-300 hover:scale-105 animate-bounceIn">Smart Exchange</h2>
          <ul className="list-none p-0">
            <li className="text-sm opacity-80 hover:text-green-500 cursor-pointer transition-colors duration-200 animate-fadeInUp delay-100">♻ Buy Smart</li>
            <li className="text-sm opacity-80 hover:text-green-500 cursor-pointer transition-colors duration-200 animate-fadeInUp delay-200">💰 Save More</li>
            <li className="text-sm opacity-80 hover:text-green-500 cursor-pointer transition-colors duration-200 animate-fadeInUp delay-300">🌍 Reduce E-Waste</li>
          </ul>
        </div>

        <div className="mb-6 md:mb-0 text-center md:text-left animate-slideInRight delay-200">
          <h2 className="text-2xl font-bold mb-2 transition-transform duration-300 hover:scale-105 animate-bounceIn">Our Services</h2>
          <ul className="list-none p-0">
            <li><a href="/sell-phone" className="text-white hover:text-green-500 transition-colors duration-200 animate-fadeInUp delay-400">Sell Phone</a></li>
            <li><a href="/sell-laptop" className="text-white hover:text-green-500 transition-colors duration-200 animate-fadeInUp delay-500">Sell Laptop</a></li>
            <li><a href="/buy-phone" className="text-white hover:text-green-500 transition-colors duration-200 animate-fadeInUp delay-600">Buy phone</a></li>
            <li className="hover:text-green-500 cursor-pointer transition-colors duration-200 animate-fadeInUp delay-700">Buy Laptop</li>
            <li><a href="/Accessories" className="text-white hover:text-green-500 transition-colors duration-200 animate-fadeInUp delay-800">Accessories</a></li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-6 md:gap-8 animate-slideInRight delay-300">
          <a href="/about_us" className="text-white hover:text-green-500 transition-colors duration-200 animate-fadeInUp delay-900">About Us</a>
          <a href="/contact_us" className="text-white hover:text-green-500 transition-colors duration-200 animate-fadeInUp delay-1000">Contact</a>
          <a href="/blog" className="text-white hover:text-green-500 transition-colors duration-200 animate-fadeInUp delay-1100">Blog</a>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6 animate-slideInRight delay-400">
        <a href="#" className="text-white hover:text-green-500 transition-transform duration-300 hover:scale-125 animate-pulseSlow"><i className="fa-brands fa-facebook"></i></a>
        <a href="#" className="text-white hover:text-green-500 transition-transform duration-300 hover:scale-125 animate-pulseSlow"><i className="fa-brands fa-twitter"></i></a>
        <a href="#" className="text-white hover:text-green-500 transition-transform duration-300 hover:scale-125 animate-pulseSlow"><i className="fa-brands fa-instagram"></i></a>
      </div>

      <hr className="my-6 border-gray-700" />

      <div className="text-center text-xs opacity-70 animate-fadeInUp delay-500">© 2025 Smart Exchange. All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;