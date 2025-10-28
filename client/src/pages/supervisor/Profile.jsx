import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const [supervisor, setSupervisor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSupervisorProfile();
  }, []);

  const fetchSupervisorProfile = async () => {
    try {
      const response = await fetch('/api/supervisor/profile', {
        credentials: 'include'
      });
      const result = await response.json();
      
      if (result.success) {
        setSupervisor(result.supervisor);
        setFormData({
          first_name: result.supervisor.first_name,
          last_name: result.supervisor.last_name,
          email: result.supervisor.email,
          phone: result.supervisor.phone,
          username: result.supervisor.username
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to load profile' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Error loading profile' });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage({ type: '', text: '' });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/supervisor/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSupervisor({ ...supervisor, ...formData });
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.message || 'Failed to update profile' 
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/supervisor/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({ type: 'error', text: 'Error updating password' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/supervisor/logout', {
        credentials: 'include'
      });
      const result = await response.json();
      
      if (result.success) {
        localStorage.removeItem('user');
        navigate('/sign-in');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!supervisor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Navigation */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link to="/supervisor-dashboard" className="flex items-center group">
                <img 
                  src="/src/assets/images/icons/logo1.png" 
                  alt="Logo" 
                  className="h-9 w-auto transition-transform duration-200 group-hover:scale-105"
                />
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Supervisor Portal
                </span>
              </Link>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-6">
                <Link 
                  to="/supervisor-dashboard" 
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-all duration-200 hover:translate-x-1"
                >
                  <i className="fas fa-house mr-2"></i>
                  Dashboard
                </Link>
                <Link 
                  to="/supervisor/verify-listings" 
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-all duration-200 hover:translate-x-1"
                >
                  <i className="fas fa-clipboard-check mr-2"></i>
                  Verify Listings
                </Link>
                <Link 
                  to="/supervisor/manage-inventory" 
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-all duration-200 hover:translate-x-1"
                >
                  <i className="fas fa-boxes mr-2"></i>
                  Manage Inventory
                </Link>
                <Link 
                  to="/supervisor/statistics" 
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center transition-all duration-200 hover:translate-x-1"
                >
                  <i className="fas fa-chart-bar mr-2"></i>
                  Statistics
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm mr-2">
                  {supervisor.first_name.charAt(0)}{supervisor.last_name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {supervisor.first_name} {supervisor.last_name}
                </span>
              </div>
              <Link 
                to="/supervisor/profile" 
                className="p-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <i className="fas fa-user-cog text-lg"></i>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="bg-white border-b md:hidden shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-4 overflow-x-auto py-2">
            <Link 
              to="/supervisor-dashboard" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center whitespace-nowrap text-sm transition-colors"
            >
              <i className="fas fa-house mr-1"></i>
              Dashboard
            </Link>
            <Link 
              to="/supervisor/verify-listings" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center whitespace-nowrap text-sm transition-colors"
            >
              <i className="fas fa-clipboard-check mr-1"></i>
              Verify
            </Link>
            <Link 
              to="/supervisor/manage-inventory" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center whitespace-nowrap text-sm transition-colors"
            >
              <i className="fas fa-boxes mr-1"></i>
              Inventory
            </Link>
            <Link 
              to="/supervisor/statistics" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center whitespace-nowrap text-sm transition-colors"
            >
              <i className="fas fa-chart-bar mr-1"></i>
              Statistics
            </Link>
          </nav>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link 
                    to="/supervisor-dashboard" 
                    className="text-gray-400 hover:text-blue-600 flex items-center transition-colors"
                  >
                    <i className="fas fa-house mr-2"></i>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                </li>
                <li>
                  <span className="text-blue-600 font-semibold">Profile</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-600">Manage your account information and security.</p>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
              <i className="far fa-calendar-alt mr-2 text-blue-600"></i>
              <span className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-5 rounded-2xl shadow-lg border-2 animate-fadeIn ${
              message.type === 'success' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700'
                : 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center">
                <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-3 text-xl`}></i>
                <span className="font-semibold">{message.text}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl mr-3">
                    <i className="fas fa-user text-white"></i>
                  </div>
                  Personal Information
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                    <span className="font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-id-badge w-5 mr-2 text-gray-400"></i>
                      User ID:
                    </span>
                    <span className="text-gray-900 font-bold">{supervisor.user_id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                    <span className="font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-user w-5 mr-2 text-gray-400"></i>
                      First Name:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="border-2 border-blue-300 rounded-lg px-3 py-2 w-48 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none font-semibold"
                      />
                    ) : (
                      <span className="text-gray-900 font-semibold">{supervisor.first_name}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                    <span className="font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-user w-5 mr-2 text-gray-400"></i>
                      Last Name:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="border-2 border-blue-300 rounded-lg px-3 py-2 w-48 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none font-semibold"
                      />
                    ) : (
                      <span className="text-gray-900 font-semibold">{supervisor.last_name}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                    <span className="font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-envelope w-5 mr-2 text-gray-400"></i>
                      Email:
                    </span>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-2 border-blue-300 rounded-lg px-3 py-2 w-48 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none font-semibold"
                      />
                    ) : (
                      <span className="text-gray-900 font-semibold">{supervisor.email}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                    <span className="font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-phone w-5 mr-2 text-gray-400"></i>
                      Phone:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-2 border-blue-300 rounded-lg px-3 py-2 w-48 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none font-semibold"
                      />
                    ) : (
                      <span className="text-gray-900 font-semibold">{supervisor.phone}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                    <span className="font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-user-circle w-5 mr-2 text-gray-400"></i>
                      Username:
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="border-2 border-blue-300 rounded-lg px-3 py-2 w-48 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none font-semibold"
                      />
                    ) : (
                      <span className="text-gray-900 font-semibold">{supervisor.username}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                    <span className="font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-shield-alt w-5 mr-2 text-gray-400"></i>
                      Role:
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-bold text-sm shadow-md">
                      Supervisor
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 hover:bg-gray-50 px-3 rounded-lg transition-colors">
                    <span className="font-semibold text-gray-700 flex items-center">
                      <i className="fas fa-calendar-plus w-5 mr-2 text-gray-400"></i>
                      Joined:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {new Date(supervisor.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:scale-105"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50 transition-all duration-300 hover:scale-105"
                      >
                        <i className="fas fa-save mr-2"></i>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-sm font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 hover:scale-105"
                      >
                        <i className="fas fa-times mr-2"></i>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-xl mr-3">
                    <i className="fas fa-lock text-white"></i>
                  </div>
                  Change Password
                </h3>
              </div>
              <div className="p-6">
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <i className="fas fa-key mr-2 text-gray-400"></i>
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all font-medium"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label htmlFor="new-password" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <i className="fas fa-lock mr-2 text-gray-400"></i>
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all font-medium"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <i className="fas fa-check-circle mr-2 text-gray-400"></i>
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all font-medium"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex justify-center items-center px-6 py-4 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 transition-all duration-300 hover:scale-105"
                    >
                      <i className="fas fa-save mr-2"></i>
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Back to Dashboard & Logout Buttons */}
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              to="/supervisor-dashboard"
              className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-base font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;