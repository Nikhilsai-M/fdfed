import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Lock, Edit2, X, Check, ShoppingBag, Package } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const API_BASE_URL = 'http://localhost:3000';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user && chartRef.current) {
      renderPieChart();
    }
  }, [user]);

  const fetchUserProfile = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "customer") {
      window.location.href = "/sign-in";
      return;
    }

    const userId = storedUser.user_id;

    // 1️⃣ Fetch base user profile
    const res = await fetch(`${API_BASE_URL}/api/customer/profile`, {
      credentials: "include",
    });

    const data = await res.json();
    if (!data.success) {
      setMessage("Error loading profile");
      return;
    }

    const baseUser = data.user;

    // 2️⃣ Fetch user's listings to compute items_sold_count
    const listingsRes = await fetch(`${API_BASE_URL}/api/customer/listings`, {
      credentials: "include",
    });

    const listingsData = await listingsRes.json();
    const listings = listingsData.listings || [];

    // 3️⃣ Count items sold = approved + added_to_inventory
    const itemsSoldCount = listings.filter(listing =>
      ["approved", "added_to_inventory"].includes(listing.status)
    ).length;

    // 4️⃣ Final updated user object
    const finalUser = {
      ...baseUser,
      items_sold_count: itemsSoldCount
    };

    setUser(finalUser);

    // 5️⃣ Update localStorage
    localStorage.setItem("user", JSON.stringify({
      ...storedUser,
      items_sold_count: itemsSoldCount
    }));

    // 6️⃣ Update form
    setFormData({
      first_name: baseUser.first_name,
      last_name: baseUser.last_name,
      email: baseUser.email,
      phone: baseUser.phone,
      address: {
        street: baseUser.address?.street || "",
        city: baseUser.address?.city || "",
        state: baseUser.address?.state || "",
        postal_code: baseUser.address?.postal_code || "",
        country: baseUser.address?.country || ""
      }
    });

  } catch (error) {
    console.error("Error fetching profile:", error);
    setMessage("Error loading profile data");
  } finally {
    setLoading(false);
  }
};


  const renderPieChart = () => {
    if (!user || !chartRef.current) return;

    // Destroy existing chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const orders = user.orders_count || 0;
    const itemsSold = user.items_sold_count || 0;

    // Import Chart.js dynamically to avoid SSR issues
    import('chart.js/auto').then(({ default: Chart }) => {
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Orders', 'Items Sold'],
          datasets: [{
            data: [orders, itemsSold],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverOffset: 4,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12,
                  family: "'Inter', sans-serif"
                }
              }
            },
            title: {
              display: true,
              text: 'Orders vs Items Sold',
              font: {
                size: 16,
                weight: 'bold',
                family: "'Inter', sans-serif"
              },
              padding: 20
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                size: 12,
                family: "'Inter', sans-serif"
              },
              bodyFont: {
                size: 12,
                family: "'Inter', sans-serif"
              },
              padding: 10,
              cornerRadius: 8
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    });
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Address validation
    if (!formData.address.street?.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!formData.address.city?.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.address.state?.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.address.postal_code?.trim()) {
      newErrors.postal_code = 'Postal code is required';
    }
    if (!formData.address.country?.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    if (!validatePersonalInfo()) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        setUser(prev => ({
          ...prev,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        }));
        
        // Update localStorage user data
        const currentUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email
        }));

        setIsEditingPersonal(false);
        setMessage('Profile updated successfully');
        setTimeout(() => setMessage(''), 3000);
        setErrors({});
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await res.json();

      if (data.success) {
        setUser(prev => ({ 
          ...prev, 
          password_last_changed: new Date().toISOString() 
        }));
        setIsEditingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage('Password updated successfully');
        setTimeout(() => setMessage(''), 3000);
        setErrors({});
      } else {
        setMessage(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">Error loading profile data</p>
            <button 
              onClick={fetchUserProfile}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                </div>
                
                <h2 className="mt-4 text-2xl font-bold text-slate-800">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-slate-600 mt-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{user.orders_count || 0}</div>
                  <div className="text-sm text-slate-600 mt-1">Orders</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <Package className="w-6 h-6 text-pink-600" />
                  </div>
                  <div className="text-3xl font-bold text-pink-600">{user.items_sold_count || 0}</div>
                  <div className="text-sm text-slate-600 mt-1">Items Sold</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                {!isEditingPersonal && (
                  <button
                    onClick={() => setIsEditingPersonal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {!isEditingPersonal ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 p-4 rounded-lg bg-slate-50">
                    <div className="text-sm font-semibold text-slate-600">Full Name</div>
                    <div className="text-slate-800">{user.first_name} {user.last_name}</div>
                  </div>
                  <div className="space-y-1 p-4 rounded-lg bg-slate-50">
                    <div className="text-sm font-semibold text-slate-600">Email</div>
                    <div className="text-slate-800 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {user.email}
                    </div>
                  </div>
                  <div className="space-y-1 p-4 rounded-lg bg-slate-50">
                    <div className="text-sm font-semibold text-slate-600">Phone</div>
                    <div className="text-slate-800 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {user.phone}
                    </div>
                  </div>
                  <div className="space-y-1 p-4 rounded-lg bg-slate-50">
                    <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      Address
                    </div>
                    {user.address ? (
                      <div className="text-slate-800 text-sm space-y-0.5">
                        <div>{user.address.street}</div>
                        <div>{user.address.city}</div>
                        <div>{user.address.state} {user.address.postal_code}</div>
                        <div>{user.address.country}</div>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">Not provided</div>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.first_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.last_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
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
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, street: e.target.value } 
                        })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.street && (
                        <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, city: e.target.value } 
                        })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, state: e.target.value } 
                        })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={formData.address.postal_code}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, postal_code: e.target.value } 
                        })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.postal_code && (
                        <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          address: { ...formData.address, country: e.target.value } 
                        })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPersonal(false);
                        setErrors({});
                        // Reset form data
                        setFormData({
                          first_name: user.first_name,
                          last_name: user.last_name,
                          email: user.email,
                          phone: user.phone,
                          address: user.address
                        });
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Statistics Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800">Statistics</h3>
              </div>
              
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <div className="h-80"> {/* Fixed height for chart container */}
                    <canvas 
                      ref={chartRef}
                      aria-label="Orders vs Items Sold chart"
                      role="img"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-800">Account Security</h3>
              </div>

              {!isEditingPassword ? (
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-slate-800">Password</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Last changed: {new Date(user.password_last_changed).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
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
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Minimum 6 characters
                    </p>
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setErrors({});
                      }}
                      className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}