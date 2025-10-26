import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: {
            street: '',
            city: '',
            state: '',
            postal_code: '',
            country: ''
        }
    });
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        
        // Handle nested address fields
        if (id.startsWith('address.')) {
            const addressField = id.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [id]: value
            });
        }
        
        // Clear field error when user starts typing
        if (fieldErrors[id]) {
            setFieldErrors({ ...fieldErrors, [id]: null });
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.username) errors.username = "Username is required";
        if (!formData.firstName) errors.firstName = "First name is required";
        if (!formData.lastName) errors.lastName = "Last name is required";
        if (!formData.email) errors.email = "Email is required";
        if (!formData.phone) errors.phone = "Phone number is required";
        if (!formData.password) errors.password = "Password is required";
        if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }
        if (!formData.address.street) errors['address.street'] = "Street is required";
        if (!formData.address.city) errors['address.city'] = "City is required";
        if (!formData.address.state) errors['address.state'] = "State is required";
        if (!formData.address.postal_code) errors['address.postal_code'] = "Postal code is required";
        if (!formData.address.country) errors['address.country'] = "Country is required";
        
        return errors;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setError("Please fill in all required fields correctly");
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            setFieldErrors({});

            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false || !res.ok) {
                setLoading(false);
                setError(data.message || "Signup failed");
                if (data.errors) {
                    setFieldErrors(data.errors);
                }
                return;
            }
            
            setLoading(false);
            setError(null);
            alert('Account created successfully! Please sign in.');
            navigate('/sign-in');
        } catch(error) {
            setLoading(false);
            setError(error.message || "An error occurred during sign up.");
        }
    };

    return (
        <div className="p-3 max-w-2xl mx-auto min-h-screen">
            <h1 className="text-3xl text-center font-semibold my-7">Create Account</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Account Information */}
                <h3 className="text-xl font-semibold mt-2">Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username *"
                            className={`border p-3 rounded-lg w-full ${fieldErrors.username ? 'border-red-500' : ''}`}
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {fieldErrors.username && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
                        )}
                    </div>
                    
                    <div>
                        <input
                            type="email"
                            placeholder="Email *"
                            className={`border p-3 rounded-lg w-full ${fieldErrors.email ? 'border-red-500' : ''}`}
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {fieldErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                        )}
                    </div>
                </div>

                {/* Personal Information */}
                <h3 className="text-xl font-semibold mt-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="First Name *"
                            className={`border p-3 rounded-lg w-full ${fieldErrors.firstName ? 'border-red-500' : ''}`}
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {fieldErrors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
                        )}
                    </div>
                    
                    <div>
                        <input
                            type="text"
                            placeholder="Last Name *"
                            className={`border p-3 rounded-lg w-full ${fieldErrors.lastName ? 'border-red-500' : ''}`}
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        {fieldErrors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
                        )}
                    </div>
                </div>

                <div>
                    <input
                        type="tel"
                        placeholder="Phone Number *"
                        className={`border p-3 rounded-lg w-full ${fieldErrors.phone ? 'border-red-500' : ''}`}
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    {fieldErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
                    )}
                </div>

                {/* Address Section */}
                <h3 className="text-xl font-semibold mt-4">Address Information</h3>
                
                <div>
                    <input
                        type="text"
                        placeholder="Street Address *"
                        className={`border p-3 rounded-lg w-full ${fieldErrors['address.street'] ? 'border-red-500' : ''}`}
                        id="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                    />
                    {fieldErrors['address.street'] && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors['address.street']}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="City *"
                            className={`border p-3 rounded-lg w-full ${fieldErrors['address.city'] ? 'border-red-500' : ''}`}
                            id="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                        />
                        {fieldErrors['address.city'] && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors['address.city']}</p>
                        )}
                    </div>
                    
                    <div>
                        <input
                            type="text"
                            placeholder="State *"
                            className={`border p-3 rounded-lg w-full ${fieldErrors['address.state'] ? 'border-red-500' : ''}`}
                            id="address.state"
                            value={formData.address.state}
                            onChange={handleChange}
                        />
                        {fieldErrors['address.state'] && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors['address.state']}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Postal Code *"
                            className={`border p-3 rounded-lg w-full ${fieldErrors['address.postal_code'] ? 'border-red-500' : ''}`}
                            id="address.postal_code"
                            value={formData.address.postal_code}
                            onChange={handleChange}
                        />
                        {fieldErrors['address.postal_code'] && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors['address.postal_code']}</p>
                        )}
                    </div>
                    
                    <div>
                        <input
                            type="text"
                            placeholder="Country *"
                            className={`border p-3 rounded-lg w-full ${fieldErrors['address.country'] ? 'border-red-500' : ''}`}
                            id="address.country"
                            value={formData.address.country}
                            onChange={handleChange}
                        />
                        {fieldErrors['address.country'] && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors['address.country']}</p>
                        )}
                    </div>
                </div>

                {/* Password Section */}
                <h3 className="text-xl font-semibold mt-4">Security</h3>
                
                <div>
                    <input
                        type="password"
                        placeholder="Password (min 6 characters) *"
                        className={`border p-3 rounded-lg w-full ${fieldErrors.password ? 'border-red-500' : ''}`}
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {fieldErrors.password && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Confirm Password *"
                        className={`border p-3 rounded-lg w-full ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    {fieldErrors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                    )}
                </div>

                <button 
                    disabled={loading} 
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-50 mt-4"
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>
            </form>
            
            <div className="flex gap-2 mt-5 justify-center">
                <p>Already have an account?</p>
                <Link to="/sign-in">
                    <span className="text-blue-700 hover:underline">Sign In</span>
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