import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/admin-auth/admin-signout', {
                method: 'POST',
                credentials: 'include'
            });
            
            localStorage.removeItem('user');
            navigate('/sign-in');
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('user');
            navigate('/sign-in');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Welcome, {user.name || user.admin_id}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Admin Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
                            <p className="text-3xl font-bold text-blue-600">1,234</p>
                            <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Orders</h3>
                            <p className="text-3xl font-bold text-green-600">567</p>
                            <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Revenue</h3>
                            <p className="text-3xl font-bold text-purple-600">$12,345</p>
                            <p className="text-sm text-gray-500 mt-2">+15% from last month</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Actions</h3>
                            <p className="text-3xl font-bold text-orange-600">23</p>
                            <p className="text-sm text-gray-500 mt-2">Requires attention</p>
                        </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link 
                            to="/admin/manage-users" 
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-blue-500"
                        >
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Manage Users</h3>
                                    <p className="text-sm text-gray-600">View and manage all users</p>
                                </div>
                            </div>
                        </Link>

                        <Link 
                            to="/admin/reports" 
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-green-500"
                        >
                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Reports</h3>
                                    <p className="text-sm text-gray-600">View system reports</p>
                                </div>
                            </div>
                        </Link>

                        <Link 
                            to="/admin/system-settings" 
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-purple-500"
                        >
                            <div className="flex items-center">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>
                                    <p className="text-sm text-gray-600">Configure system</p>
                                </div>
                            </div>
                        </Link>

                        <Link 
                            to="/admin/audit-logs" 
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-orange-500"
                        >
                            <div className="flex items-center">
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Audit Logs</h3>
                                    <p className="text-sm text-gray-600">View system logs</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="mt-8 bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">New user registration</p>
                                        <p className="text-sm text-gray-600">John Doe registered as customer</p>
                                    </div>
                                    <span className="text-sm text-gray-500">2 minutes ago</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">Order completed</p>
                                        <p className="text-sm text-gray-600">Order #ORD-1234 was completed</p>
                                    </div>
                                    <span className="text-sm text-gray-500">1 hour ago</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">System backup</p>
                                        <p className="text-sm text-gray-600">Daily system backup completed</p>
                                    </div>
                                    <span className="text-sm text-gray-500">3 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}