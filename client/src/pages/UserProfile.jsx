import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Edit2, X, Check, ShoppingBag, Package } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'recharts';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserProfile() {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94102',
      country: 'United States'
    },
    ordersCount: 24,
    itemsSoldCount: 48,
    passwordLastChanged: '2025-01-15'
  });

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      postal_code: user.address?.postal_code || '',
      country: user.address?.country || ''
    });
  }, [user]);

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    } else if (passwordData.currentPassword.length < 6) {
      newErrors.currentPassword = 'Current password must be at least 6 characters';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    } else if (passwordData.newPassword === passwordData.currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    if (!validatePersonalInfo()) return;

    setUser({
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country
      }
    });
    setIsEditingPersonal(false);
    setErrors({});
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setUser({ ...user, passwordLastChanged: new Date().toISOString().split('T')[0] });
    setIsEditingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '' });
    setErrors({});
  };

  const chartData = [
    { name: 'Orders', value: user.ordersCount, fill: '#3b82f6' },
    { name: 'Items Sold', value: user.itemsSoldCount, fill: '#ec4899' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
    <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-blue-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                
                <h2 className="mt-4 text-2xl font-bold text-slate-800 animate-fade-in">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-slate-600 mt-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex justify-center mb-2">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 animate-count-up">{user.ordersCount}</div>
                  <div className="text-sm text-slate-600 mt-1">Orders</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <div className="flex justify-center mb-2">
                    <Package className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="text-3xl font-bold text-pink-600 animate-count-up">{user.itemsSoldCount}</div>
                  <div className="text-sm text-slate-600 mt-1">Items Sold</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 transform transition-all duration-300 hover:shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                {!isEditingPersonal && (
                  <button
                    onClick={() => setIsEditingPersonal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {!isEditingPersonal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  <div className="space-y-1 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="text-sm font-semibold text-slate-600">Full Name</div>
                    <div className="text-slate-800">{user.firstName} {user.lastName}</div>
                  </div>
                  <div className="space-y-1 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="text-sm font-semibold text-slate-600">Email</div>
                    <div className="text-slate-800 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-1 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="text-sm font-semibold text-slate-600">Phone</div>
                    <div className="text-slate-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {user.phone || 'Not provided'}
                    </div>
                  </div>
                  <div className="space-y-1 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      Address
                    </div>
                    {user.address && (user.address.street || user.address.city) ? (
                      <div className="text-slate-800 text-sm space-y-0.5">
                        {user.address.street && <div>{user.address.street}</div>}
                        {user.address.city && <div>{user.address.city}</div>}
                        {(user.address.state || user.address.postal_code) && (
                          <div>{[user.address.state, user.address.postal_code].filter(Boolean).join(' ')}</div>
                        )}
                        {user.address.country && <div>{user.address.country}</div>}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">Not provided</div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-4 animate-slide-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1 animate-shake">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1 animate-shake">{errors.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 animate-shake">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 animate-shake">{errors.phone}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPersonal(false);
                        setErrors({});
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 hover:scale-105"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 transform transition-all duration-300 hover:shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800">Account Security</h3>
              </div>

              {!isEditingPassword ? (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                  <div>
                    <h4 className="font-semibold text-slate-800">Password</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Last changed: {new Date(user.passwordLastChanged).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-slide-in">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1 animate-shake">{errors.currentPassword}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Minimum 8 characters with uppercase, lowercase, and number
                    </p>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1 animate-shake">{errors.newPassword}</p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '' });
                        setErrors({});
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 hover:scale-105"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 transform transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Statistics</h3>
              <div className="flex justify-center items-center h-80">
                <div className="relative w-full max-w-sm">
                  <svg viewBox="0 0 200 200" className="w-full h-full transform transition-transform duration-300 hover:scale-105">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      strokeDasharray={`${(user.ordersCount / (user.ordersCount + user.itemsSoldCount)) * 502.65} 502.65`}
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-1000"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="20"
                      strokeDasharray={`${(user.itemsSoldCount / (user.ordersCount + user.itemsSoldCount)) * 502.65} 502.65`}
                      strokeDashoffset={`${-(user.ordersCount / (user.ordersCount + user.itemsSoldCount)) * 502.65}`}
                      transform="rotate(-90 100 100)"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold text-slate-800">{user.ordersCount + user.itemsSoldCount}</div>
                    <div className="text-sm text-slate-600">Total</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">Orders ({user.ordersCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">Items Sold ({user.itemsSoldCount})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </main>
  <Footer />
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-out;
        }
        
        .animate-count-up {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}