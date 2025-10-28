import { useEffect, useState } from "react";
import SupervisorLayout from "../../components/supervisor/SupervisorLayout";

export default function Statistics() {
    const [statistics, setStatistics] = useState({
        totalItemsAdded: 0,
        listingsVerified: 0,
        pendingListings: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
        const interval = setInterval(fetchStatistics, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStatistics = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/supervisor/statistics', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch statistics');
            }

            const data = await res.json();
            
            if (data.success) {
                setStatistics(data.statistics);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentDate = new Date().toLocaleDateString('en-US', {
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
            <div className="mb-8">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                            Statistics
                        </h1>
                        <p className="text-gray-600">Track your performance and monitor key metrics.</p>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                        <i className="far fa-calendar-alt mr-2 text-blue-600"></i>
                        <span className="text-sm font-medium text-gray-700">{currentDate}</span>
                    </div>
                </div>
                
                <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg shadow-green-200">
                    <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
                            <i className="fas fa-trophy text-white text-2xl"></i>
                        </div>
                        <div>
                            <p className="text-white font-semibold text-lg">
                                Here's your performance overview
                            </p>
                            <p className="text-green-100 text-sm">
                                Keep up the great work! Your efforts make a difference.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                    <div className="flex items-center mb-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-200">
                            <i className="fas fa-box-open text-3xl"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-600 mb-1">Total Items Added</h3>
                            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {statistics.totalItemsAdded}
                            </p>
                        </div>
                    </div>
                    <a 
                        href="/supervisor/manage-inventory" 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg w-full justify-center group-hover:scale-105"
                    >
                        <i className="fas fa-eye mr-2"></i>
                        View Inventory
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                    <div className="flex items-center mb-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-200">
                            <i className="fas fa-check-circle text-3xl"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-600 mb-1">Listings Verified</h3>
                            <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                {statistics.listingsVerified}
                            </p>
                        </div>
                    </div>
                    <a 
                        href="/supervisor/verify-listings" 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg w-full justify-center group-hover:scale-105"
                    >
                        <i className="fas fa-search mr-2"></i>
                        View Listings
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                    <div className="flex items-center mb-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-200">
                            <i className="fas fa-hourglass-half text-3xl"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-600 mb-1">Pending Listings</h3>
                            <p className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                {statistics.pendingListings}
                            </p>
                        </div>
                    </div>
                    <a 
                        href="/supervisor/verify-listings" 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg w-full justify-center group-hover:scale-105"
                    >
                        <i className="fas fa-clipboard mr-2"></i>
                        Verify Now
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white mr-3">
                        <i className="fas fa-chart-line text-2xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Activity Summary</h3>
                </div>
                <div id="activitySummary">
                    {statistics.recentActivity.length > 0 ? (
                        <ul className="space-y-3">
                            {statistics.recentActivity.map((activity, index) => (
                                <li 
                                    key={index} 
                                    className="flex justify-between items-center p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-200 hover:border-blue-200 hover:shadow-md group"
                                >
                                    <div className="flex items-center flex-1">
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg mr-4">
                                            <i className="fas fa-bolt text-white text-sm"></i>
                                        </div>
                                        <span className="text-gray-700 font-medium">{activity.action}</span>
                                    </div>
                                    <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-lg border border-gray-200 group-hover:border-blue-200">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                                <i className="fas fa-inbox text-gray-400 text-3xl"></i>
                            </div>
                            <p className="text-gray-500 font-medium text-lg">No recent activity</p>
                            <p className="text-gray-400 text-sm mt-1">Your recent activities will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </SupervisorLayout>
    );
}