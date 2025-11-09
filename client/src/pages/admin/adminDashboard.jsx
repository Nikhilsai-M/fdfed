import React, { useState, useEffect } from 'react';
// REMOVE { useNavigate } from 'react-router-dom';
import AdminSidebar from "../../components/admin/AdminSidebar"; // ⬅️ UPDATE IMPORT PATH AS NEEDED

export default function AdminDashboard() {
    // REMOVED: const navigate = useNavigate();
    
    const [statistics, setStatistics] = useState({
        totalSalesRevenue: 0,
        approvedListings: 0,
        trends: { totalSalesRevenue: 0, approvedListings: 0 },
        salesByCategory: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await fetch('/api/admin/statistics', {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.success) {
                setStatistics(data.statistics);
            } else {
                throw new Error(data.message || 'Unknown server error');
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            // Alert should ideally be handled by a global error system in production
            alert(`Failed to load statistics: ${error.message}`); 
        } finally {
            setLoading(false);
        }
    };
    
    // REMOVED: handleLogout function
    
    const getTrendIcon = (trend) => {
        if (trend > 0) return '↑';
        if (trend < 0) return '↓';
        return '';
    };

    const getTrendText = (trend) => {
        if (trend > 0) return `+${trend}% (Last Week)`;
        if (trend < 0) return `${trend}% (Last Week)`;
        return 'No Change';
    };

    const categoryData = [
        { name: 'Phones', value: statistics.salesByCategory?.phones || 0, color: 'bg-red-400' },
        { name: 'Laptops', value: statistics.salesByCategory?.laptops || 0, color: 'bg-blue-400' },
        { name: 'Chargers', value: statistics.salesByCategory?.chargers || 0, color: 'bg-yellow-400' },
        { name: 'Earphones', value: statistics.salesByCategory?.earphones || 0, color: 'bg-teal-400' },
        { name: 'Mouses', value: statistics.salesByCategory?.mouses || 0, color: 'bg-purple-400' },
        { name: 'Smartwatches', value: statistics.salesByCategory?.smartwatches || 0, color: 'bg-orange-400' }
    ];

    const total = categoryData.reduce((sum, cat) => sum + cat.value, 0);

    // Get current path for sidebar active state (now passed down)
    const currentPath = window.location.pathname; 

    return (
        <div className="flex min-h-screen bg-gray-100">
            
            {/* ⬅️ NEW SIDEBAR COMPONENT */}
            <AdminSidebar activePath={currentPath} /> 

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm p-6 flex justify-end">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Sales Revenue Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-sm text-gray-500 font-semibold mb-2">SALES REVENUE</div>
                            <div className="text-3xl font-bold text-gray-800 mb-3">
                                {loading ? '₹ Loading...' : `₹ ${Number(statistics.totalSalesRevenue || 0).toLocaleString('en-IN')}`}
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${
                                statistics.trends?.totalSalesRevenue > 0 ? 'text-green-600' : 
                                statistics.trends?.totalSalesRevenue < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                                <span className="font-bold">{getTrendIcon(statistics.trends?.totalSalesRevenue)}</span>
                                <span>{loading ? 'Calculating...' : getTrendText(statistics.trends?.totalSalesRevenue)}</span>
                            </div>
                        </div>

                        {/* Approved Listings Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="text-sm text-gray-500 font-semibold mb-2">APPROVED LISTINGS</div>
                            <div className="text-3xl font-bold text-gray-800 mb-3">
                                {loading ? 'Loading...' : (statistics.approvedListings?.toLocaleString('en-IN') ?? '0')}
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${
                                statistics.trends?.approvedListings > 0 ? 'text-green-600' : 
                                statistics.trends?.approvedListings < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                                <span className="font-bold">{getTrendIcon(statistics.trends?.approvedListings)}</span>
                                <span>{loading ? 'Calculating...' : getTrendText(statistics.trends?.approvedListings)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sales by Category Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sales by Category</h2>
                        
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            {/* Pie Chart */}
                            <div className="relative w-64 h-64">
                                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                    {categoryData.map((cat, index) => {
                                        const prevTotal = categoryData.slice(0, index).reduce((sum, c) => sum + c.value, 0);
                                        const percentage = total > 0 ? (cat.value / total) * 100 : 0;
                                        const prevPercentage = total > 0 ? (prevTotal / total) * 100 : 0;
                                        
                                        const colorMap = {
                                            'bg-red-400': '#f87171',
                                            'bg-blue-400': '#60a5fa',
                                            'bg-yellow-400': '#facc15',
                                            'bg-teal-400': '#2dd4bf',
                                            'bg-purple-400': '#c084fc',
                                            'bg-orange-400': '#fb923c'
                                        };
                                        
                                        return (
                                            <circle
                                                key={cat.name}
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke={colorMap[cat.color]}
                                                strokeWidth="20"
                                                strokeDasharray={`${percentage * 2.513} ${100 * 2.513}`}
                                                strokeDashoffset={-prevPercentage * 2.513}
                                            />
                                        );
                                    })}
                                </svg>
                            </div>

                            {/* Legend */}
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                {categoryData.map(cat => (
                                    <div key={cat.name} className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded ${cat.color}`}></div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-700">{cat.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {cat.value.toLocaleString('en-IN')} items
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}