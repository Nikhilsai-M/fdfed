import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:3000';

export default function SignIn() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        securityToken: ''
    });
    const [userType, setUserType] = useState('customer'); // 'customer', 'supervisor', 'admin'
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const detectUserType = (username) => {
        const supervisorPattern = /^supervisor\d*@se\.com$/i;
        const adminPattern = /^ADMIN\d+$/i; // ADMIN001, ADMIN002, etc.
        
        if (supervisorPattern.test(username)) {
            return 'supervisor';
        } else if (adminPattern.test(username)) {
            return 'admin';
        }
        
        return 'customer';
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });

        // Auto-detect user type when username changes
        if (id === 'username') {
            const detectedType = detectUserType(value);
            setUserType(detectedType);
        }

        if (error) setError(null);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        // For admin, security token is required
        if (userType === 'admin' && !formData.securityToken) {
            setError("Security token is required for admin login");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log(`Detected user type: ${userType} for username: ${formData.username}`);

            let apiEndpoint, userKey, role;

            if (userType === 'supervisor') {
                apiEndpoint = `${API_BASE_URL}/api/supervisor-auth/signin`;
                userKey = 'supervisor';
                role = 'supervisor';
            } else if (userType === 'admin') {
                apiEndpoint = `${API_BASE_URL}/api/admin-auth/admin-signin`;
                userKey = 'admin';
                role = 'admin';
            } else {
                apiEndpoint = `${API_BASE_URL}/api/auth/signin`;
                userKey = 'user';
                role = 'customer';
            }

            const res = await fetch(apiEndpoint, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false || !res.ok) {
                setLoading(false);
                setError(data.message || "Invalid credentials");
                return;
            }

            // Store user data with role
            const userData = {
                ...data[userKey],
                role: role
            };
            localStorage.setItem('user', JSON.stringify(userData));
            
            setLoading(false);
            setError(null);
            
            // Redirect based on role
            if (userType === 'supervisor') {
                navigate('/supervisor-dashboard');
            } else if (userType === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/');
            }
            
        } catch(error) {
            setLoading(false);
            setError(error.message || "An error occurred during sign in.");
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
            
            {/* User Type Indicator */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                    <strong>Detected User Type:</strong> 
                    <span className={`ml-2 font-bold ${
                        userType === 'admin' ? 'text-red-600' : 
                        userType === 'supervisor' ? 'text-green-600' : 'text-blue-600'
                    }`}>
                        {userType.toUpperCase()}
                    </span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <input
                        type="text"
                        placeholder="Username or Email"
                        className="border p-3 rounded-lg w-full"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-3 rounded-lg w-full"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {/* Security Token Field - Only show for admin */}
                {userType === 'admin' && (
                    <div>
                        <input
                            type="password"
                            placeholder="Security Token (Required for Admin)"
                            className="border p-3 rounded-lg w-full border-red-300 bg-red-50"
                            id="securityToken"
                            value={formData.securityToken}
                            onChange={handleChange}
                        />
                    </div>
                )}
                
                <button 
                    disabled={loading} 
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-50"
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>
            
            <div className="flex gap-2 mt-5 justify-center">
                <p>Don't have an account?</p>
                <Link to="/sign-up">
                    <span className="text-blue-700">Sign Up</span>
                </Link>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-3">
                    {error}
                </div>
            )}
            
            {/* Login Patterns Information */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Login Patterns:</h3>
                <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Customer:</strong> Any regular email or username</p>
                    <p><strong>Supervisor:</strong> Email pattern: <strong>supervisor123@se.com</strong></p>
                    <p><strong>Admin:</strong> Admin ID pattern: <strong>ADMIN001</strong></p>
                    <p className="text-xs text-gray-500">(Auto-detected based on pattern)</p>
                </div>
            </div>

            {/* Test Credentials */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Test Credentials:</h3>
                <div className="text-sm text-blue-700 space-y-2">
                    <div>
                        <p className="font-semibold">Supervisor:</p>
                        <p><strong>Email:</strong> supervisor@se.com</p>
                        <p><strong>Password:</strong> Supervisor@123</p>
                    </div>
                    <div>
                        <p className="font-semibold">Admin:</p>
                        <p><strong>Admin ID:</strong> ADMIN001</p>
                        <p><strong>Password:</strong> Admin@123</p>
                        <p><strong>Security Token:</strong> TOKEN001</p>
                    </div>
                </div>
            </div>
        </div>
    );
}