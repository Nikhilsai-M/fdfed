import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SupervisorDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || userData.role !== 'supervisor') {
            navigate('/sign-in');
            return;
        }
        setUser(userData);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        // Clear supervisor cookie
        document.cookie = 'supervisor_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/sign-in');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-blue-700">Supervisor Dashboard</h1>
                <button 
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
            
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Welcome, {user.first_name} {user.last_name}!</h2>
                    <p className="text-gray-600">Supervisor ID: {user.user_id}</p>
                    <p className="text-gray-600">Email: {user.email}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800 mb-2">User Management</h3>
                        <p className="text-blue-600 text-sm">Manage customer accounts and activities</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-2">Order Monitoring</h3>
                        <p className="text-green-600 text-sm">Monitor and manage customer orders</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-800 mb-2">Reports</h3>
                        <p className="text-purple-600 text-sm">View sales and performance reports</p>
                    </div>
                </div>
            </div>
        </div>
    );
}