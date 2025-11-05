import React from 'react';
import { Link } from 'react-router-dom';

const SupervisorDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Supervisor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          to="/supervisor/verify-listings" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Verify Listings</h2>
          <p className="text-gray-600">Review and approve/reject laptop applications</p>
        </Link>
        
        <Link 
          to="/supervisor/manage-inventory" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Inventory</h2>
          <p className="text-gray-600">Manage accessories and products</p>
        </Link>
        
        <Link 
          to="/supervisor/statistics" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p className="text-gray-600">View sales and application statistics</p>
        </Link>
        
        <Link 
          to="/supervisor/profile" 
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-gray-600">Manage your supervisor profile</p>
        </Link>
      </div>
    </div>
  );
};

export default SupervisorDashboard;