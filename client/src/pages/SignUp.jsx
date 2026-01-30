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

    // Regex patterns
    const nameRegex = /^[a-zA-Z\s-]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{10}$/;
    const postalRegex = /^\d{5,10}$/;
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    const getValue = (fieldId, currentFormData) => {
        if (fieldId.startsWith('address.')) {
            const key = fieldId.split('.')[1];
            return currentFormData.address[key];
        }
        return currentFormData[fieldId];
    };

    const getValidationError = (fieldId, currentFormData) => {
        const value = getValue(fieldId, currentFormData);
        const trimmed = value ? value.trim() : '';
        let message = '';

        switch (fieldId) {
            case 'username':
                if (!trimmed) {
                    message = 'Username is required';
                }
                break;

            case 'firstName':
            case 'lastName':
                if (!trimmed) {
                    message = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} is required`;
                } else if (trimmed.length < 2) {
                    message = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} must be at least 2 characters`;
                } else if (!nameRegex.test(trimmed)) {
                    message = `${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)} can only contain letters, spaces, and hyphens`;
                }
                break;

            case 'address.street':
            case 'address.city':
            case 'address.state':
            case 'address.country':
                const fieldName = fieldId.split('.').pop();
                if (!trimmed) {
                    message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
                } else if (!nameRegex.test(trimmed)) {
                    message = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} can only contain letters, spaces, and hyphens`;
                }
                break;

            case 'email':
                if (!trimmed) {
                    message = 'Email is required';
                } else if (!emailRegex.test(trimmed)) {
                    message = 'Please enter a valid email address (e.g., user@example.com)';
                }
                break;

            case 'phone':
                if (!trimmed) {
                    message = 'Phone number is required';
                } else if (!phoneRegex.test(trimmed)) {
                    message = 'Phone number must be 10 digits';
                }
                break;

            case 'address.postal_code':
                if (!trimmed) {
                    message = 'Postal code is required';
                } else if (!postalRegex.test(trimmed)) {
                    message = 'Postal code must be 5-10 digits';
                }
                break;

            case 'password':
                if (!value) {
                    message = 'Password is required';
                } else if (value.length < 6) {
                    message = 'Password must be at least 6 characters';
                } else if (!passwordRegex.test(value)) {
                    message = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                }
                break;

            case 'confirmPassword':
                const passwordValue = currentFormData.password;
                if (!trimmed) {
                    message = 'Please confirm your password';
                } else if (trimmed !== passwordValue) {
                    message = 'Passwords do not match';
                }
                break;

            default:
                break;
        }

        return message;
    };

    const validateField = (fieldId, currentFormData) => {
        const message = getValidationError(fieldId, currentFormData);
        setFieldErrors((prev) => ({
            ...prev,
            [fieldId]: message || null
        }));
    };

    const validateForm = () => {
        const errors = {};
        const fields = [
            'username', 'firstName', 'lastName', 'email', 'phone',
            'address.street', 'address.city', 'address.state', 'address.postal_code', 'address.country',
            'password', 'confirmPassword'
        ];

        fields.forEach((fieldId) => {
            const message = getValidationError(fieldId, formData);
            if (message) {
                errors[fieldId] = message;
            }
        });

        setFieldErrors(errors);
        return errors;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;

        let newFormData = { ...formData };
        if (id.startsWith('address.')) {
            const addressField = id.split('.')[1];
            newFormData = {
                ...newFormData,
                address: {
                    ...newFormData.address,
                    [addressField]: value
                }
            };
        } else {
            newFormData = {
                ...newFormData,
                [id]: value
            };
        }

        setFormData(newFormData);
        validateField(id, newFormData);

        if (id === 'password') {
            validateField('confirmPassword', newFormData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setError("Please fill in all required fields correctly");
            return;
        }

        // Prepare data for submission
        const submitData = {
            username: formData.username.trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            address: {
                street: formData.address.street.trim(),
                city: formData.address.city.trim(),
                state: formData.address.state.trim(),
                postal_code: formData.address.postal_code.trim(),
                country: formData.address.country.trim()
            }
        };

        try {
            setLoading(true);
            setError(null);
            setFieldErrors({});

            // Step 1: Initiate signup and send OTP
            const res = await fetch('/api/auth/signup/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            const data = await res.json();

            if (data.success === false || !res.ok) {
                setLoading(false);
                if (data.errors) {
                    setFieldErrors(data.errors);
                }
                setError(data.message || "Signup failed");
                return;
            }

            setLoading(false);
            setError(null);
            
            // Store email for OTP verification
            localStorage.setItem("pendingRegistrationEmail", submitData.email);
            
            // Navigate to OTP verification page
            navigate("/verify-otp", { 
                state: { 
                    email: submitData.email,
                    message: "OTP sent to your email. Please verify to complete registration."
                }
            });
        } catch (err) {
            setLoading(false);
            setError(err.message || "An error occurred during sign up.");
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
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-50 mt-4 font-semibold transition-all duration-300 hover:shadow-lg"
                >
                    {loading ? "Sending OTP..." : "Create Account"}
                </button>
            </form>

            <div className="flex gap-2 mt-5 justify-center">
                <p>Already have an account?</p>
                <Link to="/sign-in">
                    <span className="text-blue-700 hover:underline font-medium">Sign In</span>
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mt-3">
                    {error}
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                    <strong>Note:</strong> After submitting, you'll receive a 6-digit OTP via email. 
                    You must verify your email to complete registration.
                </p>
            </div>
        </div>
    );
}
