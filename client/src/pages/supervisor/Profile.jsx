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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              {/* Logo that links to supervisor dashboard */}
              <Link to="/supervisor-dashboard" className="flex items-center">
                <img 
                  src="/src/assets/images/icons/logo1.png" 
                  alt="Logo" 
                  className="h-8 w-auto"
                />
              </Link>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-6">
                <Link 
                  to="/supervisor-dashboard" 
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                >
                  <i className="fas fa-house mr-2"></i>
                  Dashboard
                </Link>
                <Link 
                  to="/supervisor/verify-listings" 
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                >
                  <i className="fas fa-clipboard-check mr-2"></i>
                  Verify Listings
                </Link>
                <Link 
                  to="/supervisor/manage-inventory" 
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                >
                  <i className="fas fa-boxes mr-2"></i>
                  Manage Inventory
                </Link>
                <Link 
                  to="/supervisor/statistics" 
                  className="text-gray-700 hover:text-blue-600 font-medium flex items-center"
                >
                  <i className="fas fa-chart-bar mr-2"></i>
                  Statistics
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:block">
                Welcome, {supervisor.first_name} {supervisor.last_name}
              </span>
              <Link 
                to="/supervisor/profile" 
                className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
              >
                <i className="fas fa-user-cog"></i>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="bg-white border-b md:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-4 overflow-x-auto py-2">
            <Link 
              to="/supervisor-dashboard" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center whitespace-nowrap text-sm"
            >
              <i className="fas fa-house mr-1"></i>
              Dashboard
            </Link>
            <Link 
              to="/supervisor/verify-listings" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center whitespace-nowrap text-sm"
            >
              <i className="fas fa-clipboard-check mr-1"></i>
              Verify
            </Link>
            <Link 
              to="/supervisor/manage-inventory" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center whitespace-nowrap text-sm"
            >
              <i className="fas fa-boxes mr-1"></i>
              Inventory
            </Link>
            <Link 
              to="/supervisor/statistics" 
              className="text-gray-700 hover:text-blue-600 font-medium flex items-center whitespace-nowrap text-sm"
            >
              <i className="fas fa-chart-bar mr-1"></i>
              Statistics
            </Link>
          </nav>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link 
                    to="/supervisor-dashboard" 
                    className="text-gray-400 hover:text-gray-500 flex items-center"
                  >
                    <i className="fas fa-house mr-2"></i>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                </li>
                <li>
                  <span className="text-gray-600 font-medium">Profile</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <div className="text-gray-500">
              <i className="far fa-calendar-alt mr-2"></i>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  <i className="fas fa-user mr-2 text-blue-600"></i>
                  Personal Information
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">User ID:</span>
                    <span className="text-gray-900">{supervisor.user_id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">First Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-3 py-1 w-48"
                      />
                    ) : (
                      <span className="text-gray-900">{supervisor.first_name}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Last Name:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-3 py-1 w-48"
                      />
                    ) : (
                      <span className="text-gray-900">{supervisor.last_name}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Email:</span>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-3 py-1 w-48"
                      />
                    ) : (
                      <span className="text-gray-900">{supervisor.email}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Phone:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-3 py-1 w-48"
                      />
                    ) : (
                      <span className="text-gray-900">{supervisor.phone}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Username:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-3 py-1 w-48"
                      />
                    ) : (
                      <span className="text-gray-900">{supervisor.username}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="text-gray-900">Supervisor</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Joined:</span>
                    <span className="text-gray-900">
                      {new Date(supervisor.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <i className="fas fa-save mr-2"></i>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  <i className="fas fa-lock mr-2 text-blue-600"></i>
                  Change Password
                </h3>
              </div>
              <div className="p-6">
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/supervisor-dashboard"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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