import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SupervisorLayout from "../../components/supervisor/SupervisorLayout";

export default function SupervisorDashboard() {
    const [dashboardData, setDashboardData] = useState({
        pendingListings: 0,
        itemsAdded: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/supervisor/dashboard', {
                credentials: 'include'
            });
            const data = await res.json();
            
            if (data.success) {
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (loading) {
        return (
            <SupervisorLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </SupervisorLayout>
        );
    }

    return (
        <SupervisorLayout>
            {/* Page Header */}
            <div className="mb-8 animate-fadeIn">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                            Dashboard
                        </h1>
                        <p className="text-gray-600">Welcome back! Here's your overview for today.</p>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                        <i className="far fa-calendar-alt mr-2 text-blue-600"></i>
                        <span className="text-sm font-medium text-gray-700">{currentDate}</span>
                    </div>
                </div>
                
                <div className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-blue-200">
                    <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
                            <i className="fas fa-sparkles text-white text-2xl"></i>
                        </div>
                        <div>
                            <p className="text-white font-semibold text-lg">
                                Have a productive day!
                            </p>
                            <p className="text-blue-100 text-sm">
                                Monitor your tasks and keep everything running smoothly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-200">
                                <i className="fas fa-clipboard-list text-3xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-1">Pending Listings</h3>
                                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {dashboardData.pendingListings}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link 
                        to="/supervisor/verify-listings" 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg group-hover:scale-105"
                    >
                        <i className="fas fa-check-circle mr-2"></i>
                        Verify Now
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-200">
                                <i className="fas fa-box-open text-3xl"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-600 mb-1">Items Added</h3>
                                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {dashboardData.itemsAdded}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Link 
                        to="/supervisor/manage-inventory" 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg group-hover:scale-105"
                    >
                        <i className="fas fa-search mr-2"></i>
                        View Inventory
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white mr-3">
                        <i className="fas fa-history text-xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                    {dashboardData.recentActivity.length > 0 ? (
                        dashboardData.recentActivity.map((activity, index) => (
                            <div 
                                key={index} 
                                className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-200 hover:border-blue-200"
                            >
                                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg mr-4 flex-shrink-0">
                                    <i className="fas fa-check-circle text-white"></i>
                                </div>
                                <span className="text-gray-700 font-medium flex-1">{activity}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <i className="fas fa-circle-notch text-gray-400 text-2xl"></i>
                            </div>
                            <p className="text-gray-500 font-medium">No recent activity available.</p>
                            <p className="text-gray-400 text-sm mt-1">Your activities will appear here once you start working.</p>
                        </div>
                    )}
                </div>
            </div>
        </SupervisorLayout>
    );
}