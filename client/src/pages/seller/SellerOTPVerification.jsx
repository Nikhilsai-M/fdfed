import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";

export default function SellerOTPVerification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/seller/signup");
    }
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [email, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(buildApiUrl("/api/seller/signup/verify"), { email, otp });
      alert("Verification successful! You can now log in.");
      navigate("/seller/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      const res = await axios.post(buildApiUrl("/api/seller/signup/resend-otp"), { email });
      setMessage(res.data.message || "A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  if (!email) return null; 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center">{message}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              required
              maxLength={6}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg text-center tracking-[0.5em] font-bold"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
        <div className="text-center mt-4">
          <button onClick={handleResend} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
            Didn't receive a code? Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}
