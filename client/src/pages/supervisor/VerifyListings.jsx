import { useEffect, useState } from "react";
import SupervisorLayout from "../../components/supervisor/SupervisorLayout";

export default function VerifyListings() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('0');
    const [condition, setCondition] = useState('Good');

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        filterApplications();
    }, [applications, activeFilter]);

    const fetchApplications = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/supervisor/verify-applications', {
                credentials: 'include'
            });
            const data = await res.json();
            
            if (data.success) {
                setApplications(data.applications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        let filtered = applications;
        
        if (activeFilter !== 'all') {
            filtered = applications.filter(app => {
                switch (activeFilter) {
                    case 'pending': return app.status === 'pending';
                    case 'processing': return app.status === 'processing';
                    case 'verified': return app.status === 'approved';
                    case 'added_to_inventory': return app.status === 'added_to_inventory';
                    case 'rejected': return app.status === 'rejected';
                    default: return true;
                }
            });
        }
        
        setFilteredApplications(filtered);
    };

    const showApplicationDetails = async (app) => {
        try {
            const res = await fetch(`http://localhost:3000/api/supervisor/application/${app.type}/${app.id}`, {
                credentials: 'include'
            });
            const data = await res.json();
            
            if (data.success) {
                setSelectedApplication({ ...data.application, type: data.type });
                setModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching application details:', error);
            alert('Error loading application details.');
        }
    };

    const updateStatus = async (status) => {
        if (!selectedApplication) return;
        
        setActionLoading(true);
        let rejectionReason = null;
        
        if (status === 'rejected') {
            rejectionReason = prompt('Please provide a reason for rejection (optional):');
            if (rejectionReason === null) {
                setActionLoading(false);
                return; // User cancelled
            }
        }

        try {
            const payload = { status, rejectionReason };
            if (status === 'approved' && price) {
                payload.price = parseFloat(price);
            }

            const res = await fetch(
                `http://localhost:3000/api/supervisor/application/${selectedApplication.type}/${selectedApplication.id}/status`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                }
            );
            
            const data = await res.json();
            
            if (data.success) {
                alert(`Status updated to ${status} successfully!`);
                setModalOpen(false);
                fetchApplications();
            } else {
                alert('Error updating status: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status.');
        } finally {
            setActionLoading(false);
        }
    };

    const addToInventory = async () => {
        if (!selectedApplication) return;
        
        setActionLoading(true);
        
        try {
            const res = await fetch(
                `http://localhost:3000/api/supervisor/add-to-inventory/${selectedApplication.type}/${selectedApplication.id}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ discount: parseInt(discount) || 0, condition })
                }
            );
            
            const data = await res.json();
            
            if (data.success) {
                alert('Item added to inventory successfully!');
                setModalOpen(false);
                fetchApplications();
            } else {
                alert('Error adding to inventory: ' + data.message);
            }
        } catch (error) {
            console.error('Error adding to inventory:', error);
            alert('Error adding to inventory.');
        } finally {
            setActionLoading(false);
        }
    };

    const filters = [
        { key: 'all', label: 'All Listings' },
        { key: 'pending', label: 'Pending' },
        { key: 'processing', label: 'On Processing' },
        { key: 'verified', label: 'Verified' },
        { key: 'added_to_inventory', label: 'Added to Inventory' },
        { key: 'rejected', label: 'Rejected' }
    ];

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
                    <h1 className="text-3xl font-bold text-gray-900">Verify Product Listings</h1>
                    <div className="text-sm text-gray-600 flex items-center">
                        <i className="far fa-calendar-alt mr-2"></i>
                        {new Date().toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            activeFilter === filter.key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <i className="fas fa-info-circle text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-500 text-lg">No applications found.</p>
                    </div>
                ) : (
                    filteredApplications.map(app => (
                        <div key={`${app.type}-${app.id}`} className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {app.type === 'phone' ? 'Phone' : 'Laptop'} Application #{app.id}
                            </h3>
                            <div className="space-y-2 mb-4">
                                <p><strong>Brand:</strong> {app.brand}</p>
                                <p><strong>Model:</strong> {app.model}</p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        app.status === 'rejected' 
                                            ? 'bg-red-100 text-red-800'
                                            : app.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : app.status === 'processing'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {app.status}
                                    </span>
                                </p>
                                <p><strong>Submitted:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                                {app.price && <p><strong>Price:</strong> ₹{app.price}</p>}
                            </div>
                            <button
                                onClick={() => showApplicationDetails(app)}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <i className="fas fa-eye mr-2"></i>
                                View Details
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {modalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <p><strong>Type:</strong> {selectedApplication.type.charAt(0).toUpperCase() + selectedApplication.type.slice(1)}</p>
                                <p><strong>ID:</strong> {selectedApplication.id}</p>
                                <p><strong>Brand:</strong> {selectedApplication.brand}</p>
                                <p><strong>Model:</strong> {selectedApplication.model}</p>
                                <p><strong>RAM:</strong> {selectedApplication.ram}</p>
                                
                                {selectedApplication.type === 'phone' ? (
                                    <>
                                        <p><strong>ROM:</strong> {selectedApplication.rom}</p>
                                        <p><strong>Processor:</strong> {selectedApplication.processor}</p>
                                        <p><strong>Battery:</strong> {selectedApplication.battery} mAh</p>
                                        <p><strong>Camera:</strong> {selectedApplication.camera}</p>
                                        <p><strong>OS:</strong> {selectedApplication.os || 'N/A'}</p>
                                        <p><strong>Network:</strong> {selectedApplication.network}</p>
                                        <p><strong>Size:</strong> {selectedApplication.size || 'N/A'}</p>
                                        <p><strong>Weight:</strong> {selectedApplication.weight || 'N/A'}</p>
                                        <p><strong>Device Age:</strong> {selectedApplication.device_age}</p>
                                        <p><strong>Switching On:</strong> {selectedApplication.switching_on}</p>
                                        <p><strong>Phone Calls:</strong> {selectedApplication.phone_calls}</p>
                                        <p><strong>Cameras Working:</strong> {selectedApplication.cameras_working}</p>
                                        <p><strong>Battery Issues:</strong> {selectedApplication.battery_issues}</p>
                                        <p><strong>Physically Damaged:</strong> {selectedApplication.physically_damaged}</p>
                                        <p><strong>Sound Issues:</strong> {selectedApplication.sound_issues}</p>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Storage:</strong> {selectedApplication.storage}</p>
                                        <p><strong>Processor:</strong> {selectedApplication.processor}</p>
                                        <p><strong>Generation:</strong> {selectedApplication.generation || 'N/A'}</p>
                                        <p><strong>Display Size:</strong> {selectedApplication.display_size || 'N/A'}</p>
                                        <p><strong>Weight:</strong> {selectedApplication.weight || 'N/A'}</p>
                                        <p><strong>OS:</strong> {selectedApplication.os || 'N/A'}</p>
                                        <p><strong>Device Age:</strong> {selectedApplication.device_age || 'N/A'}</p>
                                        <p><strong>Battery Issues:</strong> {selectedApplication.battery_issues || 'N/A'}</p>
                                    </>
                                )}
                                
                                <p><strong>Location:</strong> {selectedApplication.location}</p>
                                <p><strong>Email:</strong> {selectedApplication.email}</p>
                                <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                                <p><strong>Image:</strong> {selectedApplication.image_path ? (
                                    <a href={selectedApplication.image_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        View Image
                                    </a>
                                ) : 'N/A'}</p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    <span className={`px-2 py-1 rounded text-sm ${
                                        selectedApplication.status === 'rejected' 
                                            ? 'bg-red-100 text-red-800'
                                            : selectedApplication.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : selectedApplication.status === 'processing'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {selectedApplication.status}
                                    </span>
                                </p>
                                {selectedApplication.rejection_reason && (
                                    <p><strong>Rejection Reason:</strong> {selectedApplication.rejection_reason}</p>
                                )}
                                {selectedApplication.price && <p><strong>Price:</strong> ₹{selectedApplication.price}</p>}
                                <p><strong>Submitted:</strong> {new Date(selectedApplication.created_at).toLocaleString()}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="border-t pt-4">
                                {selectedApplication.status === 'pending' && (
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => updateStatus('rejected')}
                                            disabled={actionLoading}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                                        >
                                            <i className="fas fa-times mr-2"></i>
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => updateStatus('processing')}
                                            disabled={actionLoading}
                                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center"
                                        >
                                            <i className="fas fa-hourglass-half mr-2"></i>
                                            Proceed to Physical Verification
                                        </button>
                                    </div>
                                )}

                                {selectedApplication.status === 'processing' && (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => updateStatus('rejected')}
                                            disabled={actionLoading}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                                        >
                                            <i className="fas fa-times mr-2"></i>
                                            Reject
                                        </button>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Price (₹):
                                            </label>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                min="1"
                                                step="1"
                                                className="w-full p-2 border rounded-lg mb-3"
                                                placeholder="Enter price"
                                            />
                                            <button
                                                onClick={() => updateStatus('approved')}
                                                disabled={actionLoading || !price}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                                            >
                                                <i className="fas fa-check mr-2"></i>
                                                Approve with Price
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {selectedApplication.status === 'approved' && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="mb-3"><strong>Price already set:</strong> ₹{selectedApplication.price || 'Not set'}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Discount (%):
                                                </label>
                                                <input
                                                    type="number"
                                                    value={discount}
                                                    onChange={(e) => setDiscount(e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    className="w-full p-2 border rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Condition:
                                                </label>
                                                <select
                                                    value={condition}
                                                    onChange={(e) => setCondition(e.target.value)}
                                                    className="w-full p-2 border rounded-lg"
                                                >
                                                    <option value="Good">Good</option>
                                                    <option value="Very Good">Very Good</option>
                                                    <option value="Superb">Superb</option>
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    onClick={addToInventory}
                                                    disabled={actionLoading}
                                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                                                >
                                                    <i className="fas fa-plus mr-2"></i>
                                                    Add to Inventory
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedApplication.status === 'added_to_inventory' && (
                                    <p className="text-green-600 font-semibold">
                                        <i className="fas fa-check-circle mr-2"></i>
                                        Already added to inventory
                                    </p>
                                )}

                                {selectedApplication.status === 'rejected' && (
                                    <p className="text-red-600 font-semibold">
                                        <strong>Status:</strong> Rejected 
                                        {selectedApplication.rejection_reason && ` - ${selectedApplication.rejection_reason}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SupervisorLayout>
    );
}