
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000";

export default function ForgotPassword() {
  const [step, setStep] = useState("request");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userUsername, setUserUsername] = useState("");
  
  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0 && step === "verify") {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && step === "verify") {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1 - Request OTP with username or email
  const handleSendOTP = async () => {
    if (!usernameOrEmail.trim()) {
      return setMessage("Please enter your username or email");
    }
    
    try {
      setLoading(true);
      setMessage("");
      
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`, 
        { usernameOrEmail: usernameOrEmail.trim() }
      );
      
      setMessage(res.data.message);
      setUserEmail(res.data.email);
      setUserUsername(res.data.username);
      setStep("verify");
      setTimer(300); // Reset timer
      setCanResend(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 - Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      return setMessage("Please enter a valid 6-digit OTP");
    }
    
    try {
      setLoading(true);
      setMessage("");
      
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/verify-otp`, 
        { email: userEmail, otp }
      );
      
      setMessage(res.data.message);
      setStep("reset");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!userEmail) {
      return setMessage("Email not found. Please start over.");
    }
    
    try {
      setLoading(true);
      setMessage("");
      
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/resend-forgot-password-otp`, 
        { email: userEmail }
      );
      
      setMessage(res.data.message);
      setTimer(300);
      setCanResend(false);
      setOtp(""); // Clear previous OTP
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3 - Reset Password + Auto-login
  const handleResetPassword = async () => {
    if (!newPassword) {
      return setMessage("Please enter a new password");
    }
    
    if (newPassword.length < 6) {
      return setMessage("Password must be at least 6 characters long");
    }
    
    if (!confirmPassword) {
      return setMessage("Please confirm your password");
    }
    
    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match");
    }
    
    try {
      setLoading(true);
      setMessage("");
      
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          email: userEmail,
          newPassword,
          otp, // Include OTP for additional verification
        },
        { withCredentials: true }
      );
      
      setMessage(res.data.message + " Redirecting to home page...");
      
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      
      // Redirect to home page after success
      setTimeout(() => {
        navigate("/", { 
          replace: true,
          state: { 
            successMessage: "Password reset successful! You are now logged in." 
          }
        });
      }, 2000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndicator = () => {
    const steps = [
      { key: "request", label: "Identify" },
      { key: "verify", label: "Verify" },
      { key: "reset", label: "Reset" }
    ];
    
    const currentIndex = steps.findIndex(s => s.key === step);
    
    return (
      <div className="flex justify-between items-center mb-8">
        {steps.map((s, idx) => (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  idx <= currentIndex
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110 shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${
                idx <= currentIndex ? "text-blue-600" : "text-gray-400"
              }`}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 mb-6 rounded-full overflow-hidden bg-gray-200">
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    idx < currentIndex
                      ? "w-full bg-gradient-to-r from-blue-600 to-purple-600"
                      : "w-0 bg-gray-200"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">Reset Password</h2>
            <p className="text-blue-100 mt-2 text-sm">Recover your account in 3 simple steps</p>
          </div>

          <div className="p-8">
            {getStepIndicator()}

            <div className="space-y-4">
              {step === "request" && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username or Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your username or email"
                      className="border-2 border-gray-200 p-3 w-full rounded-lg transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none pl-10"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the username or email you used to sign up
                  </p>
                  <button
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 w-full rounded-lg font-semibold transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending OTP...
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              )}

              {step === "verify" && (
                <div className="animate-fadeIn">
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                      OTP sent to: <span className="font-semibold text-blue-600">{userEmail}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      (Associated with username: <span className="font-medium">{userUsername}</span>)
                    </p>
                  </div>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      className="border-2 border-gray-200 p-3 w-full rounded-lg transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none pl-10 text-center text-lg tracking-widest font-semibold"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                      }}
                      maxLength={6}
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className={`text-sm ${timer < 60 ? 'text-red-500' : 'text-gray-600'}`}>
                        {formatTime(timer)} remaining
                      </span>
                    </div>
                    
                    <button
                      onClick={handleResendOTP}
                      disabled={!canResend || loading}
                      className={`text-sm font-medium ${canResend ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 cursor-not-allowed'}`}
                    >
                      Resend OTP
                    </button>
                  </div>
                  
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white p-3 w-full rounded-lg font-semibold transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              )}

              {step === "reset" && (
                <div className="animate-fadeIn">
                  <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-700 flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      OTP verified for: <span className="font-semibold ml-1">{userUsername}</span>
                    </p>
                  </div>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative mb-4">
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="border-2 border-gray-200 p-3 w-full rounded-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none pl-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="border-2 border-gray-200 p-3 w-full rounded-lg transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  
                  <button
                    onClick={handleResetPassword}
                    disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 w-full rounded-lg font-semibold transition-all duration-300 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Resetting Password...
                      </span>
                    ) : (
                      "Reset Password & Login"
                    )}
                  </button>
                </div>
              )}
            </div>

            {message && (
              <div className="mt-6 animate-slideIn">
                <div className={`p-4 rounded-lg shadow-sm ${
                  message.includes("Error") || message.includes("Invalid") || message.includes("failed")
                    ? "bg-red-50 border-l-4 border-red-500"
                    : "bg-green-50 border-l-4 border-green-500"
                }`}>
                  <div className="flex items-start">
                    <svg className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                      message.includes("Error") || message.includes("Invalid") || message.includes("failed")
                        ? "text-red-500"
                        : "text-green-500"
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium text-gray-700">{message}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Back to Login */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/sign-in")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
