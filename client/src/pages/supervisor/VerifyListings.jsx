import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerifyListings = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/laptop-applications');
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id, status, reason = '') => {
    try {
      await axios.put(`http://localhost:3000/api/laptop-applications/${id}/status`, {
        status,
        rejection_reason: reason
      });
      fetchApplications(); // Refresh the list
      alert('Application status updated successfully');
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application status');
    }
  };

  if (loading) return <div className="p-8">Loading applications...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Verify Laptop Listings</h1>
      
      <div className="grid gap-6">
        {applications.map((app) => (
          <div key={app.id} className="border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{app.brand} {app.model}</h3>
                <p className="text-gray-600">RAM: {app.ram} | Storage: {app.storage} | Processor: {app.processor}</p>
                <p className="text-gray-600">Location: {app.location} | Contact: {app.phone}</p>
                <p className="text-gray-600">Status: <span className={`font-semibold ${
                  app.status === 'approved' ? 'text-green-600' : 
                  app.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                }`}>{app.status}</span></p>
                
                {app.image_path && (
                  <img 
                    src={`http://localhost:3000/${app.image_path}`} 
                    alt={`${app.brand} ${app.model}`}
                    className="mt-2 w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
              
              <div className="flex gap-2">
                {app.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'approved')}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason:');
                        if (reason) updateApplicationStatus(app.id, 'rejected', reason);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {app.rejection_reason && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <strong>Rejection Reason:</strong> {app.rejection_reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerifyListings;