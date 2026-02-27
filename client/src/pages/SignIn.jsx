import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, Shield, AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { useAppDispatch, useAppSelector } from "/src/hooks/redux";
import { loginUser, checkSupervisorExists, setUserType, clearError } from "/src/store/slices/authSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    securityToken: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showToken, setShowToken] = useState(false);
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const debounceTimer = useRef(null);
  const lastCheckedUsername = useRef('');

  const { 
    userType, 
    loading, 
    error, 
    supervisorExists 
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const detectUserType = async (username) => {
      if (!username || username.trim() === '') {
        dispatch(setUserType('customer'));
        return;
      }
      
      const adminPattern = /^ADMIN\d+$/i;
      if (adminPattern.test(username)) {
        dispatch(setUserType('admin'));
        return;
      }
      
      const supervisorPattern = /^supervisor\d*@se\.com$/i;
      if (supervisorPattern.test(username)) {
        dispatch(setUserType('supervisor'));
        return;
      }
      
      lastCheckedUsername.current = username;
      dispatch(checkSupervisorExists(username));
    };

    const username = formData.username;
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    
    const adminPattern = /^ADMIN\d+$/i;
    const supervisorPattern = /^supervisor\d*@se\.com$/i;
    
    if (adminPattern.test(username)) {
      dispatch(setUserType('admin'));
    } else if (supervisorPattern.test(username)) {
      dispatch(setUserType('supervisor'));
    } else if (username.trim() === '') {
      dispatch(setUserType('customer'));
    } else {
    
      dispatch(setUserType('customer'));
      
      debounceTimer.current = setTimeout(() => {
        detectUserType(username);
      }, 500);
    }
  }, [formData.username, dispatch]);


  useEffect(() => {
    if (supervisorExists && formData.username === lastCheckedUsername.current) {

      const adminPattern = /^ADMIN\d+$/i;
      const supervisorPattern = /^supervisor\d*@se\.com$/i;
      
      if (!adminPattern.test(formData.username) && !supervisorPattern.test(formData.username)) {
        dispatch(setUserType('supervisor'));
      }
    } else if (!supervisorExists && userType === 'supervisor') {
      
      const supervisorPattern = /^supervisor\d*@se\.com$/i;
      const adminPattern = /^ADMIN\d+$/i;
      
      if (!supervisorPattern.test(formData.username) && !adminPattern.test(formData.username)) {
        dispatch(setUserType('customer'));
      }
    }
  }, [supervisorExists, userType, formData.username, dispatch]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    

    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      console.error("Please fill in all fields");
      return;
    }

    if (userType === 'admin' && !formData.securityToken) {
      console.error("Security token required for admin login");
      return;
    }

    try {
      const result = await dispatch(loginUser({
        username: formData.username,
        password: formData.password,
        securityToken: formData.securityToken,
        userType
      })).unwrap();

      
      if (result.role === "supervisor") {
        navigate("/supervisor-dashboard");
      } else if (result.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
     
      console.error('Login error:', error);
    }
  };

  const getUserTypeConfig = () => {
    switch(userType) {
      case 'admin':
        return {
          gradient: 'from-red-500 to-pink-600',
          bgGradient: 'from-red-50 to-pink-50',
          color: 'red'
        };
      case 'supervisor':
        return {
          gradient: 'from-green-500 to-emerald-600',
          bgGradient: 'from-green-50 to-emerald-50',
          color: 'green'
        };
      default:
        return {
          gradient: 'from-blue-500 to-purple-600',
          bgGradient: 'from-blue-50 to-purple-50',
          color: 'blue'
        };
    }
  };

  const config = getUserTypeConfig();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 transform transition-all duration-500 hover:shadow-3xl">
          <div className="flex justify-center mb-6">
            <div className={`bg-gradient-to-br ${config.gradient} p-4 rounded-2xl text-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3`}>
              <LogIn className="w-10 h-10" />
            </div>
          </div>

          <h1 className={`text-4xl font-bold text-center mb-8 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
            Sign In
          </h1>

          <div className={`mb-6 p-4 bg-gradient-to-r ${config.bgGradient} border-2 rounded-xl animate-slideIn ${
            userType === 'admin' ? 'border-red-200' : userType === 'supervisor' ? 'border-green-200' : 'border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                <strong>Detected User Type:</strong>
              </p>
              <span className={`ml-2 font-bold px-3 py-1 rounded-full text-sm ${
                userType === "admin"
                  ? "text-red-600 bg-red-100"
                  : userType === "supervisor"
                  ? "text-green-600 bg-green-100"
                  : "text-blue-600 bg-blue-100"
              }`}>
                {userType.toUpperCase()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                id="username"
                placeholder="Username or Email"
                className="border-2 border-gray-200 p-3 pl-12 rounded-xl w-full focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none hover:border-gray-300"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="border-2 border-gray-200 p-3 pl-12 pr-12 rounded-xl w-full focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 outline-none hover:border-gray-300"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              
            </div>

            {userType === "customer" && (
              <div className="text-right animate-slideIn">
                <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200">
                  Forgot Password?
                </a>
              </div>
            )}

            {userType === "admin" && (
              <div className="relative group animate-slideIn">
                <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                <input
                  type={showToken ? "text" : "password"}
                  id="securityToken"
                  placeholder="Security Token (for Admin)"
                  className="border-2 border-red-300 p-3 pl-12 pr-12 rounded-xl w-full bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 outline-none"
                  value={formData.securityToken}
                  onChange={handleChange}
                  required={userType === 'admin'}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-600 transition-colors"
                >
                  {showToken ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`bg-gradient-to-r ${config.gradient} text-white p-4 rounded-xl font-semibold uppercase hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
             

          </form>
          <Link to="/seller/login">
           <button
            className={`bg-gradient-to-r ${config.gradient} text-white p-4 rounded-xl font-semibold uppercase hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
            >
            Sign In As Seller
            </button>
          </Link>
          

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mt-4 animate-slideIn flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-2 mt-6 justify-center text-gray-600">
            <p>Don't have an account?</p>
            <Link to="/sign-up" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all duration-200">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}