import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SellerDashboard(){

    // const [dashboardData, setDashboardData] = useState({

    //     itemsAdded: 0,
    //     recentActivity: []
    // });
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetchDashboardData();
    // }, []);

    // const fetchDashboardData = async () => {
    //     try {
    //         const res = await fetch('http://localhost:3000/api/supervisor/dashboard', {
    //             credentials: 'include'
    //         });
    //         const data = await res.json();
            
    //         if (data.success) {
    //             setDashboardData(data);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching dashboard data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const currentDate = new Date().toLocaleDateString('en-IN', {
    //     weekday: 'long',
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric'
    // });

    // if (loading) {
    //     return (
    //         <SupervisorLayout>
    //             <div className="flex justify-center items-center h-64">
    //                 <div className="relative">
    //                     <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
    //                     <div className="absolute inset-0 flex items-center justify-center">
    //                         <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </SupervisorLayout>
    //     );
    // }

    const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

return (

<div className="min-h-screen bg-gray-50 flex">

    {/* Sidebar */}
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
                Seller Panel
            </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
            <Link to="/seller/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium">
                <i className="fas fa-chart-line text-sm"></i>
                Dashboard
            </Link>

            <Link to="/seller/manage-products" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <i className="fas fa-box text-sm"></i>
                Products
            </Link>

            <Link to="/seller/orders" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <i className="fas fa-shopping-cart text-sm"></i>
                Orders
            </Link>

            <Link to="/seller/settings" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                <i className="fas fa-cog text-sm"></i>
                Settings
            </Link>
        </nav>
    </aside>


    {/* Main Content */}
    <div className="flex-1 flex flex-col">

        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
            <h1 className="text-lg font-semibold text-gray-900">
                Seller Dashboard
            </h1>

            <div className="flex items-center gap-6">
                <span className="text-sm text-gray-500">
                    {currentDate}
                </span>

                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    S
                </div>
            </div>
        </header>


        {/* Page Content */}
        <main className="p-8 space-y-8">

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
                    <p className="text-sm font-medium text-gray-500">
                        Total Products
                    </p>
                    <h2 className="text-4xl font-semibold text-gray-900 mt-2">
                        128
                    </h2>
                    <p className="text-sm text-green-600 mt-2">
                        ↑ 12% from last month
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
                    <p className="text-sm font-medium text-gray-500">
                        Monthly Revenue
                    </p>
                    <h2 className="text-4xl font-semibold text-gray-900 mt-2">
                        ₹45,200
                    </h2>
                    <p className="text-sm text-green-600 mt-2">
                        ↑ 8% growth
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
                    <p className="text-sm font-medium text-gray-500">
                        Orders This Month
                    </p>
                    <h2 className="text-4xl font-semibold text-gray-900 mt-2">
                        126
                    </h2>
                    <p className="text-sm text-red-500 mt-2">
                        ↓ 3% decrease
                    </p>
                </div>

            </div>


            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Activity
                        </h3>
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            View all
                        </button>
                    </div>

                    <div className="text-center py-10">
                        <p className="text-gray-400 text-sm">
                            No recent activity yet.
                        </p>
                    </div>
                </div>


                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Quick Actions
                    </h3>

                    <div className="space-y-4">
                        <Link
                            to="/seller/add-product"
                            className="block w-full text-center py-3 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
                        >
                            Add New Product
                        </Link>

                        <Link
                            to="/seller-manage-inventory"
                            className="block w-full text-center py-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                        >
                            Manage Products
                        </Link>

                        <Link
                            to="/seller/orders"
                            className="block w-full text-center py-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                        >
                            View Orders
                        </Link>
                    </div>
                </div>

            </div>

        </main>

    </div>

</div>

);
}