import React from 'react';
import { useNavigate } from 'react-router-dom';
import Grainient from '../components/Grainient';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    sessionStorage.setItem('hasVisitedLanding', 'true');
    navigate('/');
  };

  const handleAboutUs = () => {
    sessionStorage.setItem('hasVisitedLanding', 'true');
    navigate('/about_us');
  };

  const handleNavigate = (path) => {
    sessionStorage.setItem('hasVisitedLanding', 'true');
    navigate(path);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-black">
      {/* Grainient Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Grainient
          color1="#FF9FFC"
          color2="#5227FF"
          color3="#B19EEF"
          timeSpeed={1.5}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Header with Logo */}
      <div className="absolute top-0 left-0 right-0 z-20 px-8 md:px-12 lg:px-16 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-xl tracking-tight">Smart Exchange</h2>
              <p className="text-white/60 text-xs">Buy & Sell Devices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex items-center justify-between h-full max-w-7xl mx-auto px-8 md:px-12 lg:px-16">
        
        {/* Left Side - Text Content */}
        <div className="flex-1 max-w-2xl animate-slide-in-left">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Buy & Sell<br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              your devices
            </span><br />
            <span className="text-purple-300">effortlessly.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-lg leading-relaxed">
            Whether you're buying a phone, selling your laptop, or finding the perfect
            accessories, Smart Exchange makes every transaction seamless.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 bg-white text-purple-900 text-lg font-semibold rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/50"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={handleAboutUs}
              className="group relative px-8 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-semibold rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">About Us</span>
            </button>
          </div>

          {/* Stats or Features */}
          
        </div>

        {/* Right Side - Phone Mockup */}
        <div className="hidden lg:block flex-1 relative animate-slide-in-right">
          <div className="relative w-full max-w-md mx-auto">
            {/* Glowing Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-500/30 blur-3xl rounded-full"></div>
            
            {/* Phone Frame */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-3 shadow-2xl border border-white/10">
              {/* Screen */}
              <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 rounded-[2.5rem] overflow-hidden relative">
                {/* Status Bar - No Time */}
                <div className="flex justify-end items-center px-6 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-5 h-3 rounded-sm bg-white/30"></div>
                    <div className="w-5 h-3 rounded-sm bg-white/30"></div>
                    <div className="w-5 h-3 rounded-sm bg-white/30"></div>
                  </div>
                </div>

                {/* Mock Content - Device Listings */}
                <div className="p-6 space-y-4">
                  {/* Featured Card - Laptop Listing */}
                  <div 
                    onClick={() => handleNavigate('/buylaptops')}
                    className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 overflow-hidden shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="text-yellow-300 text-xs font-bold mb-2 tracking-wide">TRENDING</div>
                      <h3 className="text-white text-2xl font-bold mb-1">Laptops</h3>
                      <p className="text-white/90 text-sm mb-4">Premium Quality</p>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <div className="text-white/70 text-xs mb-1">Starting from</div>
                          <span className="text-white text-2xl font-bold">₹35,000</span>
                        </div>
                        <button className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* List Items - More Devices */}
                  <div className="space-y-3">
                    {/* Phone Item */}
                    <div 
                      onClick={() => handleNavigate('/buyphones')}
                      className="bg-purple-700/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover:bg-purple-700/60 transition cursor-pointer hover:scale-105 duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-base">Phones</div>
                          <div className="text-white/70 text-sm">Starting from ₹20,000</div>
                        </div>
                        <div className="text-cyan-400 text-xs font-bold bg-cyan-400/20 px-3 py-1 rounded-full">NEW</div>
                      </div>
                    </div>

                    {/* Accessory Item - Earbuds */}
                    <div 
                      onClick={() => handleNavigate('/accessories/earphones')}
                      className="bg-purple-700/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover:bg-purple-700/60 transition cursor-pointer hover:scale-105 duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-base">Earbuds</div>
                          <div className="text-white/70 text-sm">Starting from ₹5,000</div>
                        </div>
                        <div className="text-green-400 text-xs font-bold bg-green-400/20 px-3 py-1 rounded-full">VERIFIED</div>
                      </div>
                    </div>

                    {/* Watch Item */}
                    <div 
                      onClick={() => handleNavigate('/accessories/smartwatches')}
                      className="bg-purple-700/40 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover:bg-purple-700/60 transition cursor-pointer hover:scale-105 duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 12c0-2.54-1.19-4.81-3.04-6.27L16 0H8l-.95 5.73C5.19 7.19 4 9.45 4 12s1.19 4.81 3.05 6.27L8 24h8l.96-5.73C18.81 16.81 20 14.54 20 12zM6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-semibold text-base">Smart Watches</div>
                          <div className="text-white/70 text-sm">Starting from ₹8,000</div>
                        </div>
                        <div className="text-yellow-400 text-xs font-bold bg-yellow-400/20 px-3 py-1 rounded-full">HOT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Icons */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-pink-500 rounded-full animate-float shadow-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
              </svg>
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-500 rounded-full animate-float-delay shadow-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes floatDelay {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: floatDelay 3s ease-in-out infinite 1.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;