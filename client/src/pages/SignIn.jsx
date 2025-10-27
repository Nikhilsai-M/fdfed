import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = 'http://localhost:3000';

export default function SignIn() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        if (error) setError(null);
    };

    const detectUserType = (username) => {
        const supervisorPattern = /^supervisor\d*@se\.com$/i;
        
        if (supervisorPattern.test(username)) {
            return 'supervisor';
        }
        
        return 'customer';
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const userType = detectUserType(formData.username);
            console.log(`Detected user type: ${userType} for username: ${formData.username}`);

            let apiEndpoint, userKey, role;

            if (userType === 'supervisor') {
                apiEndpoint = `${API_BASE_URL}/api/supervisor-auth/signin`;
                userKey = 'supervisor';
                role = 'supervisor';
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
            
            {/* Email pattern information */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Login Patterns:</h3>
                <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Customer:</strong> Any regular email or username</p>
                    <p><strong>Supervisor:</strong> Email pattern: <strong>supervisor123@se.com</strong></p>
                    <p className="text-xs text-gray-500">(Numbers are optional: supervisor@se.com, supervisor1@se.com, etc.)</p>
                </div>
            </div>

            {/* Test credentials */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Test Supervisor Credentials:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Email:</strong> supervisor@se.com</p>
                    <p><strong>Password:</strong> Supervisor@123</p>
                    <p><strong>Email:</strong> supervisor1@se.com</p>
                    <p><strong>Password:</strong> Supervisor@456</p>
                </div>
            </div>
        </div>
    );
}