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
                return;
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
        { key: 'all', label: 'All Listings', icon: 'fas fa-list', color: 'gray' },
        { key: 'pending', label: 'Pending', icon: 'fas fa-clock', color: 'blue' },
        { key: 'processing', label: 'Processing', icon: 'fas fa-spinner', color: 'yellow' },
        { key: 'verified', label: 'Verified', icon: 'fas fa-check', color: 'green' },
        { key: 'added_to_inventory', label: 'In Inventory', icon: 'fas fa-box', color: 'purple' },
        { key: 'rejected', label: 'Rejected', icon: 'fas fa-times', color: 'red' }
    ];

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
                            Verify Product Listings
                        </h1>
                        <p className="text-gray-600">Review and approve product submissions.</p>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                        <i className="far fa-calendar-alt mr-2 text-blue-600"></i>
                        <span className="text-sm font-medium text-gray-700">
                            {new Date().toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
                {filters.map(filter => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`px-5 py-3 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md flex items-center space-x-2 ${
                            activeFilter === filter.key
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        <i className={filter.icon}></i>
                        <span>{filter.label}</span>
                    </button>
                ))}
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6">
                            <i className="fas fa-info-circle text-4xl text-gray-400"></i>
                        </div>
                        <p className="text-gray-500 text-xl font-semibold mb-2">No applications found</p>
                        <p className="text-gray-400">Try adjusting your filters to see more results.</p>
                    </div>
                ) : (
                    filteredApplications.map(app => (
                        <div key={`${app.type}-${app.id}`} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-xl mr-3 ${
                                        app.type === 'phone' 
                                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                                            : 'bg-gradient-to-br from-purple-500 to-pink-600'
                                    } text-white shadow-md`}>
                                        <i className={`fas ${app.type === 'phone' ? 'fa-mobile-alt' : 'fa-laptop'} text-xl`}></i>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {app.type === 'phone' ? 'Phone' : 'Laptop'}
                                        </h3>
                                        <p className="text-sm text-gray-500">ID #{app.id}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-5">
                                <div className="flex items-center text-gray-700">
                                    <i className="fas fa-tag w-5 mr-2 text-gray-400"></i>
                                    <span className="font-semibold mr-2">Brand:</span>
                                    <span>{app.brand}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <i className="fas fa-cube w-5 mr-2 text-gray-400"></i>
                                    <span className="font-semibold mr-2">Model:</span>
                                    <span>{app.model}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <i className="fas fa-info-circle w-5 mr-2 text-gray-400"></i>
                                        <span className="font-semibold mr-2 text-gray-700">Status:</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold shadow-sm ${
                                        app.status === 'rejected' 
                                            ? 'bg-red-100 text-red-700 border border-red-200'
                                            : app.status === 'approved'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : app.status === 'processing'
                                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                            : app.status === 'added_to_inventory'
                                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                                    }`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <i className="far fa-calendar w-5 mr-2 text-gray-400"></i>
                                    <span className="font-semibold mr-2">Submitted:</span>
                                    <span className="text-sm">{new Date(app.created_at).toLocaleDateString()}</span>
                                </div>
                                {app.price && (
                                    <div className="flex items-center text-gray-700">
                                        <i className="fas fa-rupee-sign w-5 mr-2 text-gray-400"></i>
                                        <span className="font-semibold mr-2">Price:</span>
                                        <span className="text-green-600 font-bold">₹{app.price}</span>
                                    </div>
                                )}
                            </div>
                            
                            <button
                                onClick={() => showApplicationDetails(app)}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center font-medium shadow-md hover:shadow-lg group-hover:scale-105"
                            >
                                <i className="fas fa-eye mr-2"></i>
                                View Details
                                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {modalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-3xl">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="bg-white bg-opacity-20 p-3 rounded-xl mr-4">
                                        <i className={`fas ${selectedApplication.type === 'phone' ? 'fa-mobile-alt' : 'fa-laptop'} text-white text-2xl`}></i>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Application Details</h2>
                                        <p className="text-blue-100 text-sm">
                                            {selectedApplication.type.charAt(0).toUpperCase() + selectedApplication.type.slice(1)} - ID #{selectedApplication.id}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-xl transition-all duration-200"
                                >
                                    <i className="fas fa-times text-2xl"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Basic Info */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                    <p className="text-gray-600 text-sm mb-1">Brand</p>
                                    <p className="font-bold text-gray-900">{selectedApplication.brand}</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                    <p className="text-gray-600 text-sm mb-1">Model</p>
                                    <p className="font-bold text-gray-900">{selectedApplication.model}</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                    <p className="text-gray-600 text-sm mb-1">RAM</p>
                                    <p className="font-bold text-gray-900">{selectedApplication.ram}</p>
                                </div>
                                
                                {selectedApplication.type === 'phone' ? (
                                    <>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">ROM</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.rom}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">Processor</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.processor}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">Battery</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.battery} mAh</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">Camera</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.camera}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">OS</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.os || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">Network</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.network}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">Storage</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.storage}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">Processor</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.processor}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">Generation</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.generation || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600 text-sm mb-1">Display Size</p>
                                            <p className="font-bold text-gray-900">{selectedApplication.display_size || 'N/A'}</p>
                                        </div>
                                    </>
                                )}
                                
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                    <p className="text-gray-600 text-sm mb-1">Location</p>
                                    <p className="font-bold text-gray-900">{selectedApplication.location}</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                    <p className="text-gray-600 text-sm mb-1">Email</p>
                                    <p className="font-bold text-gray-900 text-sm">{selectedApplication.email}</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                    <p className="text-gray-600 text-sm mb-1">Phone</p>
                                    <p className="font-bold text-gray-900">{selectedApplication.phone}</p>
                                </div>
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                                    <p className="text-gray-600 text-sm mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold ${
                                        selectedApplication.status === 'rejected' 
                                            ? 'bg-red-100 text-red-700'
                                            : selectedApplication.status === 'approved'
                                            ? 'bg-green-100 text-green-700'
                                            : selectedApplication.status === 'processing'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {selectedApplication.status}
                                    </span>
                                </div>
                                {selectedApplication.price && (
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
                                        <p className="text-green-600 text-sm mb-1">Price</p>
                                        <p className="font-bold text-green-700 text-xl">₹{selectedApplication.price}</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="border-t-2 border-gray-200 pt-6">
                                {selectedApplication.status === 'pending' && (
                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() => updateStatus('rejected')}
                                            disabled={actionLoading}
                                            className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <i className="fas fa-times-circle mr-2 text-lg"></i>
                                            Reject Application
                                        </button>
                                        <button
                                            onClick={() => updateStatus('processing')}
                                            disabled={actionLoading}
                                            className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-4 rounded-xl hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <i className="fas fa-hourglass-half mr-2 text-lg"></i>
                                            Process for Verification
                                        </button>
                                    </div>
                                )}

                                {selectedApplication.status === 'processing' && (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => updateStatus('rejected')}
                                            disabled={actionLoading}
                                            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <i className="fas fa-times-circle mr-2 text-lg"></i>
                                            Reject Application
                                        </button>
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                                Set Price (₹):
                                            </label>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                min="1"
                                                step="1"
                                                className="w-full p-4 border-2 border-green-300 rounded-xl mb-4 text-lg font-semibold focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none"
                                                placeholder="Enter price"
                                            />
                                            <button
                                                onClick={() => updateStatus('approved')}
                                                disabled={actionLoading || !price}
                                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <i className="fas fa-check-circle mr-2 text-lg"></i>
                                                Approve with Price
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {selectedApplication.status === 'approved' && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200">
                                        <div className="mb-6 bg-white p-4 rounded-xl border border-blue-200">
                                            <p className="text-gray-600 text-sm mb-1">Approved Price</p>
                                            <p className="text-3xl font-bold text-green-600">₹{selectedApplication.price || 'Not set'}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Discount (%):
                                                </label>
                                                <input
                                                    type="number"
                                                    value={discount}
                                                    onChange={(e) => setDiscount(e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    step="1"
                                                    className="w-full p-3 border-2 border-blue-300 rounded-xl font-semibold focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    Condition:
                                                </label>
                                                <select
                                                    value={condition}
                                                    onChange={(e) => setCondition(e.target.value)}
                                                    className="w-full p-3 border-2 border-blue-300 rounded-xl font-semibold focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none"
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
                                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <i className="fas fa-plus-circle mr-2"></i>
                                                    Add to Inventory
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedApplication.status === 'added_to_inventory' && (
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-2xl text-center">
                                        <i className="fas fa-check-circle text-white text-4xl mb-3"></i>
                                        <p className="text-white font-bold text-xl">Already Added to Inventory</p>
                                        <p className="text-green-100 mt-2">This item is now available in the inventory.</p>
                                    </div>
                                )}

                                {selectedApplication.status === 'rejected' && (
                                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-2xl">
                                        <div className="flex items-center">
                                            <i className="fas fa-times-circle text-white text-3xl mr-4"></i>
                                            <div>
                                                <p className="text-white font-bold text-xl">Application Rejected</p>
                                                {selectedApplication.rejection_reason && (
                                                    <p className="text-red-100 mt-2">Reason: {selectedApplication.rejection_reason}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SupervisorLayout>
    );
}