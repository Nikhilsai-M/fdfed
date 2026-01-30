
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Shield, Clock, RotateCcw, CheckCircle, XCircle } from "lucide-react";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [userEmail, setUserEmail] = useState("");
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingRegistrationEmail");
    const stateEmail = location.state?.email;
    
    if (stateEmail) {
      setUserEmail(stateEmail);
      localStorage.setItem("pendingRegistrationEmail", stateEmail);
    } else if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      // No email found, redirect to signup
      navigate("/sign-up");
    }
  }, [location, navigate]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all fields filled
    if (newOtp.every(digit => digit !== "") && index === 5) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus last input
      setTimeout(() => {
        const lastEmptyIndex = newOtp.findIndex(digit => digit === "");
        const focusIndex = lastEmptyIndex === -1 ? 5 : Math.min(lastEmptyIndex, 5);
        inputRefs.current[focusIndex]?.focus();
      }, 0);
    }
  };

  const handleSubmit = async (otpValue = otp.join("")) => {
    if (otpValue.length !== 6) {
      setMessage({ type: "error", text: "Please enter all 6 digits" });
      return;
    }

    if (!userEmail) {
      setMessage({ type: "error", text: "Email not found. Please start over." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/auth/signup/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setMessage({
        type: "success",
        text: "Account verified successfully! Redirecting..."
      });

      // Clear localStorage
      localStorage.removeItem("pendingRegistrationEmail");

      // Store user data and token
      if (data.token) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
      }

      // Redirect after success
      setTimeout(() => {
        navigate("/", { 
          replace: true,
          state: { 
            welcomeMessage: "Welcome to SmartExchange! Your account has been verified." 
          }
        });
      }, 2000);

    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to verify OTP. Please try again."
      });
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!userEmail) {
      setMessage({ type: "error", text: "Email not found" });
      return;
    }

    setResendLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/auth/signup/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      // Reset timer
      setTimer(300);
      
      // Clear OTP fields
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      setMessage({
        type: "success",
        text: "New OTP sent to your email!"
      });

    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to resend OTP"
      });
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg">
              <Shield className="w-10 h-10" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Verify Your Email
          </h1>

          <p className="text-gray-600 text-center mb-8">
            Enter the 6-digit OTP sent to
            <span className="font-semibold text-blue-600 ml-1">{userEmail}</span>
          </p>

          {/* OTP Input */}
          <div className="mb-8">
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-2xl text-center font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className={`font-medium ${timer < 60 ? "text-red-500" : "text-gray-700"}`}>
                {formatTime(timer)}
              </span>
              <span className="text-gray-500">remaining</span>
            </div>

            {/* Resend OTP Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={handleResendOTP}
                disabled={timer > 0 || resendLoading || loading}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl font-semibold uppercase hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verify Account
              </>
            )}
          </button>

          {/* Messages */}
          {message.text && (
            <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${
              message.type === "success" 
                ? "bg-green-50 border-2 border-green-300 text-green-700" 
                : "bg-red-50 border-2 border-red-300 text-red-700"
            }`}>
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Didn't receive the email? Check your spam folder
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}