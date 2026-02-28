import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

// Add CSS for animations
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`;

const ManageSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMessage, setFormMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    type: 'phone'   // ✅ NEW
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSupervisors();
  }, []);

  const loadSupervisors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/supervisors', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch supervisors');
      }
      
      const result = await response.json();
      
      if (result.success && result.supervisors) {
        setSupervisors(result.supervisors);
      } else {
        setSupervisors([]);
      }
    } catch (error) {
      console.error('Error loading supervisors:', error);
      setFormMessage('Failed to load supervisors.');
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone is required';
    // Check if contains only digits
    const digitsOnly = /^[0-9]+$/;
    if (!digitsOnly.test(phone)) return 'Phone must contain only digits';
    if (phone.length !== 10) return 'Phone must be exactly 10 digits';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password.length > 50) return 'Password must be less than 50 characters';
    return '';
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        // Check if contains only alphabets (letters and spaces allowed)
        const firstNameRegex = /^[a-zA-Z\s]+$/;
        if (!firstNameRegex.test(value)) return 'First name must contain only alphabets';
        return '';
      case 'lastName':
        if (!value) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        // Check if contains only alphabets (letters and spaces allowed)
        const lastNameRegex = /^[a-zA-Z\s]+$/;
        if (!lastNameRegex.test(value)) return 'Last name must contain only alphabets';
        return '';
      case 'email':
        return validateEmail(value);
      case 'phone':
        return validatePhone(value);
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        return '';
      case 'password':
        return validatePassword(value);
      default:
        return '';
    }
  };

  const checkDuplicate = async (field, value) => {
    if (!value) return '';
    
    // Check if email, username, or phone already exists in current supervisors list
    const exists = supervisors.some(supervisor => {
      if (field === 'email') return supervisor.email.toLowerCase() === value.toLowerCase();
      if (field === 'username') return supervisor.username.toLowerCase() === value.toLowerCase();
      if (field === 'phone') return supervisor.phone === value;
      return false;
    });
    
    if (exists) {
      return `${field === 'email' ? 'Email' : field === 'username' ? 'Username' : 'Phone number'} already exists`;
    }
    
    return '';
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear previous error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      } else {
        // Check for duplicates for email, username, and phone
        if (name === 'email' || name === 'username' || name === 'phone') {
          const duplicateError = await checkDuplicate(name, value);
          if (duplicateError) {
            setErrors(prev => ({ ...prev, [name]: duplicateError }));
          }
        }
      }
    }
  };

  const handleBlur = async (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      // Check for duplicates for email, username, and phone
      if (name === 'email' || name === 'username' || name === 'phone') {
        const duplicateError = await checkDuplicate(name, value);
        if (duplicateError) {
          setErrors(prev => ({ ...prev, [name]: duplicateError }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.username &&
      formData.password &&
      formData.type &&
      Object.keys(errors).length === 0 &&
      validateField('firstName', formData.firstName) === '' &&
      validateField('lastName', formData.lastName) === '' &&
      validateField('email', formData.email) === '' &&
      validateField('phone', formData.phone) === '' &&
      validateField('username', formData.username) === '' &&
      validateField('password', formData.password) === ''
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');
    setIsSubmitting(true);

    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      username: true,
      password: true
    });

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Check for duplicates
    const emailDuplicate = await checkDuplicate('email', formData.email);
    const usernameDuplicate = await checkDuplicate('username', formData.username);
    const phoneDuplicate = await checkDuplicate('phone', formData.phone);
    
    if (emailDuplicate || usernameDuplicate || phoneDuplicate) {
      setErrors({
        ...(emailDuplicate && { email: emailDuplicate }),
        ...(usernameDuplicate && { username: usernameDuplicate }),
        ...(phoneDuplicate && { phone: phoneDuplicate })
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/add-supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setFormMessage('Supervisor added successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          username: '',
          password: '',
          type: 'phone'   // ✅ NEW
        });
        setErrors({});
        setTouched({});
        loadSupervisors(); // Refresh the list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setFormMessage('');
        }, 3000);
      } else {
        // Handle server-side validation errors
        if (result.message.includes('email') || result.message.includes('Email')) {
          setErrors(prev => ({ ...prev, email: result.message }));
        } else if (result.message.includes('username') || result.message.includes('Username')) {
          setErrors(prev => ({ ...prev, username: result.message }));
        } else if (result.message.includes('phone') || result.message.includes('Phone')) {
          setErrors(prev => ({ ...prev, phone: result.message }));
        } else {
          setFormMessage(result.message || 'Failed to add supervisor.');
        }
      }
    } catch (error) {
      console.error('Error adding supervisor:', error);
      setFormMessage('Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    const supervisor = supervisors.find(s => s.user_id === userId);
    const supervisorName = supervisor ? `${supervisor.first_name} ${supervisor.last_name}` : 'this supervisor';
    
    if (!window.confirm(`Are you sure you want to delete ${supervisorName}?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/supervisors/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        loadSupervisors(); // Refresh the list
        alert('Supervisor deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete supervisor.');
      }
    } catch (error) {
      console.error('Error deleting supervisor:', error);
      alert('Server error.');
    }
  };

  const currentPath = window.location.pathname;

  return (
    <>
      <style>{styles}</style>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar activePath={currentPath} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
       

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <i className="fas fa-users-cog text-white text-2xl"></i>
              </div>
              Manage Supervisors
            </h1>
            <p className="text-gray-600 ml-16">Add, view, and manage supervisor accounts</p>
          </div>

          {/* Supervisors List */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <i className="fas fa-list text-blue-600"></i>
                Current Supervisors
              </h2>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                {supervisors.length} {supervisors.length === 1 ? 'Supervisor' : 'Supervisors'}
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading supervisors...</p>
              </div>
            ) : supervisors.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                  <i className="fas fa-user-slash text-4xl text-gray-400"></i>
                </div>
                <p className="text-gray-600 text-lg font-medium">No supervisors found.</p>
                <p className="text-gray-500 text-sm mt-2">Add your first supervisor using the form below.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supervisors.map((supervisor, index) => (
                  <div
                    key={supervisor.user_id}
                    className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Avatar Section */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {supervisor.first_name.charAt(0)}{supervisor.last_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {supervisor.first_name} {supervisor.last_name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Supervisor ID: {supervisor.user_id}</p>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-envelope text-blue-600 text-xs"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <p className="text-sm text-gray-900 truncate" title={supervisor.email}>
                            {supervisor.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-phone text-green-600 text-xs"></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Phone</p>
                          <p className="text-sm text-gray-900">{supervisor.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-user text-purple-600 text-xs"></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Username</p>
                          <p className="text-sm text-gray-900 truncate" title={supervisor.username}>
                            {supervisor.username}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-calendar text-orange-600 text-xs"></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Created</p>
                          <p className="text-sm text-gray-900">
                            {supervisor.created_at
                              ? new Date(supervisor.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(supervisor.user_id)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-trash-alt"></i>
                      Delete Supervisor
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Supervisor Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <i className="fas fa-user-plus text-white text-xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Add New Supervisor</h2>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new supervisor account</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fas fa-user text-blue-600"></i>
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => {
                      // Only allow alphabets and spaces
                      const filteredValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setFormData(prev => ({ ...prev, firstName: filteredValue }));
                      // Clear error if field was touched
                      if (touched.firstName) {
                        const error = validateField('firstName', filteredValue);
                        if (error) {
                          setErrors(prev => ({ ...prev, firstName: error }));
                        } else {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.firstName;
                            return newErrors;
                          });
                        }
                      }
                    }}
                    onBlur={handleBlur}
                    required
                    placeholder="Enter first name (alphabets only)"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.firstName && touched.firstName
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : formData.firstName && !errors.firstName
                        ? 'border-green-400 focus:ring-green-400 bg-green-50'
                        : 'border-gray-300 focus:ring-blue-500 bg-white hover:border-blue-300'
                    }`}
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-2 animate-fade-in">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.firstName}
                    </p>
                  )}
                  {formData.firstName && !errors.firstName && touched.firstName && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
                      Looks good!
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fas fa-user text-blue-600"></i>
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => {
                      // Only allow alphabets and spaces
                      const filteredValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setFormData(prev => ({ ...prev, lastName: filteredValue }));
                      // Clear error if field was touched
                      if (touched.lastName) {
                        const error = validateField('lastName', filteredValue);
                        if (error) {
                          setErrors(prev => ({ ...prev, lastName: error }));
                        } else {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.lastName;
                            return newErrors;
                          });
                        }
                      }
                    }}
                    onBlur={handleBlur}
                    required
                    placeholder="Enter last name (alphabets only)"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.lastName && touched.lastName
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : formData.lastName && !errors.lastName
                        ? 'border-green-400 focus:ring-green-400 bg-green-50'
                        : 'border-gray-300 focus:ring-blue-500 bg-white hover:border-blue-300'
                    }`}
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-2 animate-fade-in">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.lastName}
                    </p>
                  )}
                  {formData.lastName && !errors.lastName && touched.lastName && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
                      Looks good!
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fas fa-envelope text-blue-600"></i>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    placeholder="supervisor@example.com"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.email && touched.email
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : formData.email && !errors.email
                        ? 'border-green-400 focus:ring-green-400 bg-green-50'
                        : 'border-gray-300 focus:ring-blue-500 bg-white hover:border-blue-300'
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-2 animate-fade-in">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.email}
                    </p>
                  )}
                  {formData.email && !errors.email && touched.email && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
                      Valid email address
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fas fa-phone text-blue-600"></i>
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      // Only allow digits, max 10
                      const filteredValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                      setFormData(prev => ({ ...prev, phone: filteredValue }));
                      // Clear error if field was touched
                      if (touched.phone) {
                        const error = validateField('phone', filteredValue);
                        if (error) {
                          setErrors(prev => ({ ...prev, phone: error }));
                        } else {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.phone;
                            return newErrors;
                          });
                        }
                      }
                    }}
                    onBlur={handleBlur}
                    required
                    maxLength="10"
                    pattern="[0-9]{10}"
                    placeholder="1234567890"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.phone && touched.phone
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : formData.phone && !errors.phone
                        ? 'border-green-400 focus:ring-green-400 bg-green-50'
                        : 'border-gray-300 focus:ring-blue-500 bg-white hover:border-blue-300'
                    }`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-2 animate-fade-in">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.phone}
                    </p>
                  )}
                  {formData.phone && !errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
                      Valid phone number
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fas fa-user-tag text-blue-600"></i>
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Enter username"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.username && touched.username
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : formData.username && !errors.username
                        ? 'border-green-400 focus:ring-green-400 bg-green-50'
                        : 'border-gray-300 focus:ring-blue-500 bg-white hover:border-blue-300'
                    }`}
                  />
                  {errors.username && touched.username && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-2 animate-fade-in">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.username}
                    </p>
                  )}
                  {formData.username && !errors.username && touched.username && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
                      Username available
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <i className="fas fa-lock text-blue-600"></i>
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    placeholder="Enter password (min 6 characters)"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.password && touched.password
                        ? 'border-red-400 focus:ring-red-400 bg-red-50'
                        : formData.password && !errors.password
                        ? 'border-green-400 focus:ring-green-400 bg-green-50'
                        : 'border-gray-300 focus:ring-blue-500 bg-white hover:border-blue-300'
                    }`}
                  />
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-2 animate-fade-in">
                      <i className="fas fa-exclamation-circle text-xs"></i>
                      {errors.password}
                    </p>
                  )}
                  {formData.password && !errors.password && touched.password && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-2">
                      <i className="fas fa-check-circle text-xs"></i>
                      Password is valid
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-layer-group text-blue-600"></i>
                  Supervisor Type <span className="text-red-500">*</span>
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="phone">Phone Supervisor</option>
                  <option value="laptop">Laptop Supervisor</option>
                </select>

                <p className="text-xs text-gray-500">
                  Determines which sellers this supervisor manages
                </p>
              </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform ${
                      isFormValid() && !isSubmitting
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } flex items-center gap-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Adding Supervisor...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        <span>Add Supervisor</span>
                      </>
                    )}
                  </button>
                  {Object.keys(errors).length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Please fix the errors above</span>
                    </div>
                  )}
                </div>
              </div>
            </form>
            {formMessage && (
              <div
                className={`mt-6 p-4 rounded-xl border-2 shadow-lg animate-fade-in ${
                  formMessage === 'Supervisor added successfully!'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-300'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    formMessage === 'Supervisor added successfully!'
                      ? 'bg-green-200'
                      : 'bg-red-200'
                  }`}>
                    <i className={`fas ${
                      formMessage === 'Supervisor added successfully!'
                        ? 'fa-check-circle text-green-700'
                        : 'fa-exclamation-circle text-red-700'
                    }`}></i>
                  </div>
                  <p className="font-semibold">{formMessage}</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    </>
  );
};

export default ManageSupervisors;