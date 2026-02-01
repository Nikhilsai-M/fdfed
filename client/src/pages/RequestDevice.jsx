import React, { useState } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const RequestDevice = () => {
  const [deviceType, setDeviceType] = useState("phone");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const submitRequest = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(
        "/api/device-requests",
        {
          device_type: deviceType,
          criteria: { brand, model },
        },
        { withCredentials: true }
      );

      setShowSuccess(true);
      setBrand("");
      setModel("");
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert("Error submitting request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deviceIcons = {
    phone: "📱",
    laptop: "💻",
    charger: "🔌",
    earphone: "🎧",
    smartwatch: "⌚",
    mouse: "🖱️"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg transform animate-slideInDown">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">Device request submitted successfully!</span>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-3xl">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <span className="text-4xl animate-bounce">{deviceIcons[deviceType]}</span>
                <div>
                  <h2 className="text-2xl font-bold">Request a Device</h2>
                  <p className="text-blue-100 text-sm mt-1">Fill in the details below</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              {/* Device Type Selector */}
              <div className="mb-6 animate-fadeIn">
                <label className="block text-gray-700 font-semibold mb-2">
                  Device Type
                </label>
                <div className="relative">
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full p-3 pl-4 pr-10 border-2 border-gray-200 rounded-xl appearance-none cursor-pointer
                             transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                             hover:border-blue-300 bg-white"
                  >
                    <option value="phone">📱 Phone</option>
                    <option value="laptop">💻 Laptop</option>
                    <option value="charger">🔌 Charger</option>
                    <option value="earphone">🎧 Earphone</option>
                    <option value="smartwatch">⌚ Smartwatch</option>
                    <option value="mouse">🖱️ Mouse</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Brand Input */}
              <div className="mb-6 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
                <label className="block text-gray-700 font-semibold mb-2">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl
                           transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                           hover:border-blue-300 placeholder-gray-400"
                  placeholder="e.g., Apple, Samsung, Dell"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              {/* Model Input */}
              <div className="mb-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
                <label className="block text-gray-700 font-semibold mb-2">
                  Model <span className="text-gray-400 text-sm font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl
                           transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                           hover:border-blue-300 placeholder-gray-400"
                  placeholder="e.g., iPhone 15, XPS 13"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={submitRequest}
                disabled={isSubmitting || !brand}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl
                         font-bold text-lg shadow-lg
                         transform transition-all duration-300
                         hover:scale-105 hover:shadow-xl
                         active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideInDown {
          animation: slideInDown 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default RequestDevice;