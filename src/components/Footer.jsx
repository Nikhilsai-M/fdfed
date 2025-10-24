import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .footer-link {
          position: relative;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #10b981, #059669);
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .footer-link:hover {
          color: #6ee7b7;
          transform: translateX(5px);
        }

        .social-icon {
          transition: all 0.3s ease;
          display: inline-block;
        }

        .social-icon:hover {
          transform: translateY(-5px) scale(1.1);
          color: #6ee7b7;
        }

        .footer-section {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .footer-section:nth-child(1) {
          animation-delay: 0.1s;
        }

        .footer-section:nth-child(2) {
          animation-delay: 0.2s;
        }

        .footer-section:nth-child(3) {
          animation-delay: 0.3s;
        }

        .footer-item {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }

        .footer-item:nth-child(1) { animation-delay: 0.2s; }
        .footer-item:nth-child(2) { animation-delay: 0.3s; }
        .footer-item:nth-child(3) { animation-delay: 0.4s; }
        .footer-item:nth-child(4) { animation-delay: 0.5s; }
        .footer-item:nth-child(5) { animation-delay: 0.6s; }

        .footer-title {
          position: relative;
          padding-bottom: 0.75rem;
          margin-bottom: 1rem;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #6ee7b7, #34d399);
          border-radius: 2px;
        }

        .brand-icon {
          transition: transform 0.3s ease;
        }

        .brand-icon:hover {
          transform: rotate(360deg) scale(1.1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          {/* Brand Section */}
          <div className="footer-section text-center md:text-left">
            <h2 className="footer-title text-2xl font-bold mb-3 flex items-center justify-center md:justify-start gap-2">
              <span className="brand-icon text-green-300">♻</span>
              Smart Exchange
            </h2>
            <ul className="list-none space-y-2">
              <li className="footer-item flex items-center justify-center md:justify-start gap-2 text-gray-200 text-sm">
                <span className="text-green-300">♻️</span>
                <span>Buy Smart</span>
              </li>
              <li className="footer-item flex items-center justify-center md:justify-start gap-2 text-gray-200 text-sm">
                <span className="text-green-300">💰</span>
                <span>Save More</span>
              </li>
              <li className="footer-item flex items-center justify-center md:justify-start gap-2 text-gray-200 text-sm">
                <span className="text-green-300">🌍</span>
                <span>Reduce E-Waste</span>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="footer-section text-center md:text-left">
            <h2 className="footer-title text-xl font-bold mb-3">Our Services</h2>
            <ul className="list-none space-y-2">
              <li className="footer-item">
                <a href="/sell-phone" className="footer-link text-gray-200 text-sm">Sell Phone</a>
              </li>
              <li className="footer-item">
                <a href="/sell-laptop" className="footer-link text-gray-200 text-sm">Sell Laptop</a>
              </li>
              <li className="footer-item">
                <a href="/buy-phone" className="footer-link text-gray-200 text-sm">Buy Phone</a>
              </li>
              <li className="footer-item">
                <a href="/buy-laptop" className="footer-link text-gray-200 text-sm">Buy Laptop</a>
              </li>
              <li className="footer-item">
                <a href="/Accessories" className="footer-link text-gray-200 text-sm">Accessories</a>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section text-center md:text-left">
            <h2 className="footer-title text-xl font-bold mb-3">Quick Links</h2>
            <ul className="list-none space-y-2">
              <li className="footer-item">
                <a href="/about_us" className="footer-link text-gray-200 text-sm">About Us</a>
              </li>
              <li className="footer-item">
                <a href="/contact_us" className="footer-link text-gray-200 text-sm">Contact</a>
              </li>
              <li className="footer-item">
                <a href="/blog" className="footer-link text-gray-200 text-sm">Blog</a>
              </li>
              <li className="footer-item">
                <a href="/privacy" className="footer-link text-gray-200 text-sm">Privacy Policy</a>
              </li>
              <li className="footer-item">
                <a href="/terms" className="footer-link text-gray-200 text-sm">Terms & Conditions</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Social Media Section */}
        <div className="flex justify-center gap-5 mb-5">
          <a href="#" className="social-icon text-xl text-gray-200" aria-label="Facebook">
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a href="#" className="social-icon text-xl text-gray-200" aria-label="Twitter">
            <i className="fa-brands fa-twitter"></i>
          </a>
          <a href="#" className="social-icon text-xl text-gray-200" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="#" className="social-icon text-xl text-gray-200" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a href="#" className="social-icon text-xl text-gray-200" aria-label="YouTube">
            <i className="fa-brands fa-youtube"></i>
          </a>
        </div>

        {/* Divider */}
        <hr className="border-green-700 mb-4" />

        {/* Copyright Section */}
        <div className="text-center">
          <p className="text-gray-200 text-sm">
            © 2025 Smart Exchange. All Rights Reserved.
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Made with <span className="text-red-400">❤️</span> for a sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;