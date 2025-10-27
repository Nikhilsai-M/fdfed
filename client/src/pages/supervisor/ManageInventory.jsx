import React from 'react';

const ManageInventory = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Inventory</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inventory summary cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Items</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Available Items</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600">0</p>
        </div>
      </div>

      {/* Inventory table */}
      <div className="mt-8 bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Inventory Items</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-500">No inventory items found.</p>
          {/* Add inventory table here later */}
        </div>
      </div>
    </div>
  );
};

export default ManageInventory;