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
        const interval = setInterval(fetchStatistics, 30000); // Refresh every 30 seconds
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
                    <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
                    <div className="text-sm text-gray-600 flex items-center">
                        <i className="far fa-calendar-alt mr-2"></i>
                        {currentDate}
                    </div>
                </div>
                
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                        Here's your performance overview. Keep up the great work!
                    </p>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <i className="fas fa-box-open text-xl"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Total Items Added</h3>
                            <p className="text-3xl font-bold text-gray-900">{statistics.totalItemsAdded}</p>
                        </div>
                    </div>
                    <a 
                        href="/supervisor/manage-inventory" 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <i className="fas fa-eye mr-2"></i>
                        View Inventory
                    </a>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <i className="fas fa-check-circle text-xl"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Listings Verified</h3>
                            <p className="text-3xl font-bold text-gray-900">{statistics.listingsVerified}</p>
                        </div>
                    </div>
                    <a 
                        href="/supervisor/verify-listings" 
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <i className="fas fa-search mr-2"></i>
                        View Listings
                    </a>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                            <i className="fas fa-hourglass-half text-xl"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Pending Listings</h3>
                            <p className="text-3xl font-bold text-gray-900">{statistics.pendingListings}</p>
                        </div>
                    </div>
                    <a 
                        href="/supervisor/verify-listings" 
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        <i className="fas fa-clipboard mr-2"></i>
                        Verify Now
                    </a>
                </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <i className="fas fa-chart-line mr-2"></i>
                    Activity Summary
                </h3>
                <div id="activitySummary">
                    {statistics.recentActivity.length > 0 ? (
                        <ul className="space-y-3">
                            {statistics.recentActivity.map((activity, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">{activity.action}</span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                </div>
            </div>
        </SupervisorLayout>
    );
}