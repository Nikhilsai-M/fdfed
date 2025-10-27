import { useEffect, useState } from "react";
import SupervisorLayout from "../../components/supervisor/SupervisorLayout";

export default function Profile() {
    const [supervisor, setSupervisor] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        username: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/supervisor/profile', {
                credentials: 'include'
            });
            const data = await res.json();
            
            if (data.success) {
                setSupervisor(data.supervisor);
                setFormData({
                    first_name: data.supervisor.first_name,
                    last_name: data.supervisor.last_name,
                    email: data.supervisor.email,
                    phone: data.supervisor.phone,
                    username: data.supervisor.username
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setProfileMessage('Error loading profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (editMode) {
            // Reset form data when cancelling
            setFormData({
                first_name: supervisor.first_name,
                last_name: supervisor.last_name,
                email: supervisor.email,
                phone: supervisor.phone,
                username: supervisor.username
            });
            setProfileMessage('');
        }
        setEditMode(!editMode);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,63})$/;
        return email.length <= 254 && emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\+?[\d\s-]{10,15}$/;
        return phoneRegex.test(phone);
    };

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s-]{2,50}$/;
        return nameRegex.test(name);
    };

    const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
        return usernameRegex.test(username);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setProfileMessage('');

        // Validation
        if (!validateName(formData.first_name)) {
            setProfileMessage('First name must be 2-50 characters long and contain only letters, spaces, or hyphens');
            setSaving(false);
            return;
        }

        if (!validateName(formData.last_name)) {
            setProfileMessage('Last name must be 2-50 characters long and contain only letters, spaces, or hyphens');
            setSaving(false);
            return;
        }

        if (!validateEmail(formData.email)) {
            setProfileMessage('Please enter a valid email address (e.g., user@domain.com)');
            setSaving(false);
            return;
        }

        if (!validatePhone(formData.phone)) {
            setProfileMessage('Please enter a valid phone number (10-15 digits, may include +, spaces, or hyphens)');
            setSaving(false);
            return;
        }

        if (!validateUsername(formData.username)) {
            setProfileMessage('Username must be 3-20 characters long and contain only letters, numbers, underscores, or hyphens');
            setSaving(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/supervisor/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setSupervisor(prev => ({ ...prev, ...formData }));
                setEditMode(false);
                setProfileMessage('Profile updated successfully');
                setTimeout(() => setProfileMessage(''), 3000);
            } else {
                setProfileMessage(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setProfileMessage('An error occurred while updating profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordMessage('New password must be at least 6 characters long');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/supervisor/password', {
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

            const data = await res.json();

            if (data.success) {
                setPasswordMessage('Password updated successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setTimeout(() => setPasswordMessage(''), 3000);
            } else {
                setPasswordMessage(data.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Password update error:', error);
            setPasswordMessage('An error occurred while updating password');
        }
    };

    if (loading) {
        return (
            <SupervisorLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </SupervisorLayout>
        );
    }

    if (!supervisor) {
        return (
            <SupervisorLayout>
                <div className="text-center py-12">
                    <p className="text-red-600">Error loading profile data</p>
                </div>
            </SupervisorLayout>
        );
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <SupervisorLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <div className="text-sm text-gray-600 flex items-center">
                        <i className="far fa-calendar-alt mr-2"></i>
                        {currentDate}
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <section className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-user mr-2"></i>
                    Personal Information
                </h3>
                
                <form onSubmit={handleProfileSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="detail-item">
                            <label className="block text-sm font-medium text-gray-700 mb-1">User ID:</label>
                            <span className="text-gray-900">{supervisor.user_id}</span>
                        </div>
                        
                        <div className="detail-item">
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            ) : (
                                <span className="text-gray-900">{supervisor.first_name}</span>
                            )}
                        </div>
                        
                        <div className="detail-item">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            ) : (
                                <span className="text-gray-900">{supervisor.last_name}</span>
                            )}
                        </div>
                        
                        <div className="detail-item">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                            {editMode ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            ) : (
                                <span className="text-gray-900">{supervisor.email}</span>
                            )}
                        </div>
                        
                        <div className="detail-item">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            ) : (
                                <span className="text-gray-900">{supervisor.phone}</span>
                            )}
                        </div>
                        
                        <div className="detail-item">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            ) : (
                                <span className="text-gray-900">{supervisor.username}</span>
                            )}
                        </div>
                        
                        <div className="detail-item">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
                            <span className="text-gray-900">Supervisor</span>
                        </div>
                        
                        <div className="detail-item">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Joined:</label>
                            <span className="text-gray-900">
                                {new Date(supervisor.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {!editMode ? (
                            <button
                                type="button"
                                onClick={handleEditToggle}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <i className="fas fa-edit mr-2"></i>
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleEditToggle}
                                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </form>

                {profileMessage && (
                    <div className={`mt-4 p-3 rounded-lg ${
                        profileMessage.includes('successfully') 
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                        {profileMessage}
                    </div>
                )}
            </section>

            {/* Change Password */}
            <section className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-lock mr-2"></i>
                    Change Password
                </h3>
                
                <form onSubmit={handlePasswordSubmit} className="max-w-md">
                    <div className="space-y-4 mb-4">
                        <div>
                            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password:
                            </label>
                            <input
                                type="password"
                                id="current-password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password:
                            </label>
                            <input
                                type="password"
                                id="new-password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password:
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <i className="fas fa-save mr-2"></i>
                        Update Password
                    </button>
                </form>

                {passwordMessage && (
                    <div className={`mt-4 p-3 rounded-lg ${
                        passwordMessage.includes('successfully') 
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                        {passwordMessage}
                    </div>
                )}
            </section>
        </SupervisorLayout>
    );
}