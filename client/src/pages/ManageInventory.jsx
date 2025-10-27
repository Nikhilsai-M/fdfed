import SupervisorLayout from "../../components/supervisor/SupervisorLayout";

export default function ManageInventory() {
    const currentDate = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <SupervisorLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Inventory</h1>
                    <div className="text-sm text-gray-600 flex items-center">
                        <i className="far fa-calendar-alt mr-2"></i>
                        {currentDate}
                    </div>
                </div>
            </div>

            {/* Coming Soon Section */}
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="text-6xl text-blue-500 mb-4">
                        <i className="fas fa-tools"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
                    <p className="text-gray-600 mb-6">
                        The inventory management system is currently under development. 
                        You'll be able to manage all inventory items from this page soon.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                            <strong>Note:</strong> You can still add items to inventory through the 
                            "Verify Product Listings" page when approving applications.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <div className="text-3xl text-gray-400 mb-2">
                        <i className="fas fa-box"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-500">Total Items</h3>
                    <p className="text-2xl font-bold text-gray-400">--</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <div className="text-3xl text-gray-400 mb-2">
                        <i className="fas fa-tags"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-500">Categories</h3>
                    <p className="text-2xl font-bold text-gray-400">--</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <div className="text-3xl text-gray-400 mb-2">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-500">Inventory Value</h3>
                    <p className="text-2xl font-bold text-gray-400">--</p>
                </div>
            </div>
        </SupervisorLayout>
    );
}