import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SupervisorLayout({ children }) {
    const [supervisor, setSupervisor] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || userData.role !== 'supervisor') {
            navigate('/sign-in');
            return;
        }
        setSupervisor(userData);
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/supervisor/logout', {
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
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <Link to="/supervisor-dashboard" className="flex items-center ml-4 md:ml-0">
                                <img src="src//assets/images/icons/logo1.png" alt="Logo" className="h-8 w-auto" />
                                <span className="ml-2 text-xl font-semibold text-gray-900">Supervisor Portal</span>
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {supervisor.first_name} {supervisor.last_name}
                            </span>
                            <Link 
                                to="/supervisor/profile" 
                                className={`p-2 rounded-lg ${isActive('/supervisor/profile') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                            >
                                <i className="fas fa-user-cog"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`bg-white shadow-sm w-64 min-h-screen fixed md:static transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}>
                    <nav className="mt-8 px-4">
                        <ul className="space-y-2">
                            <li>
                                <Link 
                                    to="/supervisor-dashboard" 
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive('/supervisor') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <i className="fas fa-house w-5 mr-3"></i>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/supervisor/verify-listings" 
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive('/supervisor/verify-listings') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <i className="fas fa-clipboard-check w-5 mr-3"></i>
                                    Verify Product Listings
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/supervisor/manage-inventory" 
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive('/supervisor/manage-inventory') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <i className="fas fa-boxes w-5 mr-3"></i>
                                    Manage Inventory
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/supervisor/statistics" 
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive('/supervisor/statistics') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <i className="fas fa-chart-bar w-5 mr-3"></i>
                                    Statistics
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                                >
                                    <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-0">
                    {sidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        ></div>
                    )}
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}