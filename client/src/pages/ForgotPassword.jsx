import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000";

export default function ForgotPassword() {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1 - Request OTP
  const handleSendOTP = async () => {
    if (!email) return setMessage("Please enter your email");
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setStep("verify");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 - Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) return setMessage("Please enter OTP");
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, { email, otp });
      setMessage(res.data.message);
      setStep("reset");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 - Reset Password + Auto-login (cookie set in backend)
  const handleResetPassword = async () => {
    if (!newPassword) return setMessage("Please enter new password");
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        newPassword,
      }, { withCredentials: true });
      setMessage(res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-5">Forgot Password</h2>

      {step === "request" && (
        <>
          <input
            type="email"
            placeholder="Enter your registered email"
            className="border p-2 w-full rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="bg-blue-600 text-white p-2 w-full rounded hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {step === "verify" && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border p-2 w-full rounded mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="bg-green-600 text-white p-2 w-full rounded hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {step === "reset" && (
        <>
          <input
            type="password"
            placeholder="Enter new password"
            className="border p-2 w-full rounded mb-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="bg-purple-600 text-white p-2 w-full rounded hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}

      {message && (
        <p className="text-center text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-2 mt-4">
          {message}
        </p>
      )}
    </div>
  );
}
