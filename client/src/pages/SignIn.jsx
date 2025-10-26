import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.username || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch('/api/auth/signin', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false || !res.ok) {
                setLoading(false);
                setError(data.message || "Sign in failed");
                return;
            }

            // Store user data in localStorage or context
            localStorage.setItem('user', JSON.stringify(data.user));
            
            setLoading(false);
            setError(null);
            navigate('/');
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
            
            <div className="flex gap-2 mt-5">
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
        </div>
    );
}