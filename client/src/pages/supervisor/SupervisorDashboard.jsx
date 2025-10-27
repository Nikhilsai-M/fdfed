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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </SupervisorLayout>
        );
    }

    return (
        <SupervisorLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <div className="text-sm text-gray-600 flex items-center">
                        <i className="far fa-calendar-alt mr-2"></i>
                        {currentDate}
                    </div>
                </div>
                
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                        Hello! Here's your overview for today. Have a productive day!
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <i className="fas fa-clipboard-list text-xl"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Pending Listings</h3>
                            <p className="text-3xl font-bold text-gray-900">{dashboardData.pendingListings}</p>
                        </div>
                    </div>
                    <Link 
                        to="/supervisor/verify-listings" 
                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <i className="fas fa-check-circle mr-2"></i>
                        Verify Now
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <i className="fas fa-box-open text-xl"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Items Added</h3>
                            <p className="text-3xl font-bold text-gray-900">{dashboardData.itemsAdded}</p>
                        </div>
                    </div>
                    <Link 
                        to="/supervisor/manage-inventory" 
                        className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <i className="fas fa-search mr-2"></i>
                        View Inventory
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-history mr-2"></i>
                    Recent Activity
                </h3>
                <ul className="space-y-3">
                    {dashboardData.recentActivity.length > 0 ? (
                        dashboardData.recentActivity.map((activity, index) => (
                            <li key={index} className="flex items-start">
                                <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                                <span className="text-gray-700">{activity}</span>
                            </li>
                        ))
                    ) : (
                        <li className="flex items-center text-gray-500">
                            <i className="fas fa-circle-notch mr-3"></i>
                            No recent activity available.
                        </li>
                    )}
                </ul>
            </div>
        </SupervisorLayout>
    );
}