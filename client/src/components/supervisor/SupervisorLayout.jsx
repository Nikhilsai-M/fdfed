import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../utils/api";

export default function SupervisorLayout({ children }) {
    const [supervisor, setSupervisor] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Supervisor data from localStorage:', userData); // Debug line
    if (!userData || userData.role !== 'supervisor') {
        navigate('/sign-in');
        return;
    }
    setSupervisor(userData);
}, [navigate]);
    const handleLogout = async () => {
        try {
            const res = await fetch(buildApiUrl('/api/supervisor/logout'), {
                method: 'GET',
                credentials: 'include'
            });
            
            const data = await res.json();
            if (data.success) {
                localStorage.removeItem('user');
                document.cookie = 'supervisor_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                navigate('/sign-in');
            }
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('user');
            navigate('/sign-in');
        }
    };

    if (!supervisor) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 active:scale-95"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <Link to="/supervisor-dashboard" className="flex items-center group">
                                <img src="/src/assets/images/icons/logo1.png" alt="Logo" className="h-9 w-auto transition-transform duration-200 group-hover:scale-105" />
                                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Supervisor Portal
                                </span>
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-100">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm mr-2">
                                    {supervisor.first_name.charAt(0)}{supervisor.last_name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {supervisor.first_name} {supervisor.last_name}
                                </span>
                            </div>
                            <Link 
                                to="/supervisor/profile" 
                                className={`p-2.5 rounded-lg transition-all duration-200 ${
                                    isActive('/supervisor/profile') 
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <i className="fas fa-user-cog text-lg"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar - Fixed on Desktop */}
                <aside className={`bg-white shadow-xl w-64 fixed top-16 bottom-0 left-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 border-r border-gray-200 overflow-y-auto`}>
                    <nav className="mt-8 px-4 pb-8">
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    to="/supervisor-dashboard" 
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                        isActive('/supervisor-dashboard') 
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:translate-x-1'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <i className={`fas fa-house w-5 mr-3 ${isActive('/supervisor-dashboard') ? 'animate-pulse' : ''}`}></i>
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/supervisor/verify-listings" 
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                        isActive('/supervisor/verify-listings') 
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:translate-x-1'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <i className="fas fa-clipboard-check w-5 mr-3"></i>
                                    Verify Listings
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/supervisor/manage-inventory" 
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                        isActive('/supervisor/manage-inventory') 
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:translate-x-1'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <i className="fas fa-boxes w-5 mr-3"></i>
                                    Manage Inventory
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/supervisor/statistics" 
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                        isActive('/supervisor/statistics') 
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:translate-x-1'
                                    }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <i className="fas fa-chart-bar w-5 mr-3"></i>
                                    Statistics
                                </Link>
                            </li>
                            <li className="pt-4 mt-4 border-t border-gray-200">
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 rounded-xl text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 transition-all duration-200 font-medium hover:shadow-lg hover:shadow-red-200"
                                >
                                    <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <main className="flex-1 md:ml-0 w-full">
                    <div className="p-6 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
