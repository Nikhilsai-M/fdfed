import React, { useState, useEffect } from 'react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import '/src/styles/ManageInventory.css';

const ManageInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editData, setEditData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [supervisorType, setSupervisorType] = useState(null);

    // Fetch supervisor type from API
    const fetchSupervisorType = async () => {
        try {
            const res = await fetch('/api/supervisor/dashboard', { credentials: 'include' });
            const data = await res.json();
            if (data.success) setSupervisorType(data.supervisorType);
        } catch (error) {
            console.error('Error fetching supervisor type:', error);
        }
    };

    // Fetch inventory
    const fetchInventory = async () => {
        try {
            const response = await fetch('/api/supervisor/inventory', { credentials: 'include' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            if (data.success) setInventory(data.items);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    // Filter by supervisor type whenever inventory or supervisorType changes
    useEffect(() => {
        if (!supervisorType) return;
        const typeFilter = supervisorType === 'phone'
            ? (t) => t === 'phone' || t === 'phones'
            : (t) => t === 'laptop' || t === 'laptops';
        setFilteredInventory(inventory.filter(p => typeFilter(p.type)));
    }, [inventory, supervisorType]);

    // Initial fetch
    useEffect(() => {
        fetchSupervisorType();
        fetchInventory();
    }, []);

    // Open modal and populate editData from the product
    const showProductDetails = (product) => {
        setSelectedProduct(product);
        const isPhone = product.type === 'phone' || product.type === 'phones';
        const isLaptop = product.type === 'laptop' || product.type === 'laptops';

        const base = {
            brand: product.brand || '',
            price: product.pricing?.basePrice || product.base_price || '',
            discount: product.pricing?.discount || product.discount || '0',
            image: product.image || '',
        };

        if (isPhone) {
            setEditData({
                ...base,
                model: product.model || '',
                color: product.color || '',
                processor: product.specs?.processor || product.processor || '',
                display: product.specs?.display || product.display || '',
                battery: product.specs?.battery || product.battery || '',
                camera: product.specs?.camera || product.camera || '',
                os: product.specs?.os || product.os || '',
                network: product.specs?.network || product.network || '',
                weight: product.specs?.weight || product.weight || '',
                ram: product.ram || '',
                rom: product.rom || '',
                condition: product.condition || 'Used',
            });
        } else if (isLaptop) {
            setEditData({
                ...base,
                series: product.series || '',
                processor_name: product.processor?.name || product.processor_name || '',
                processor_generation: product.processor?.generation || product.processor_generation || '',
                ram: product.memory?.ram || product.ram || '',
                storage_type: product.memory?.storage?.type || product.storage_type || '',
                storage_capacity: product.memory?.storage?.capacity || product.storage_capacity || '',
                display_size: product.displaysize || product.display_size || '',
                weight: product.weight || '',
                condition: product.condition || 'Used',
                os: product.os || '',
            });
        } else {
            setEditData(base);
        }

        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
        setEditData({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const updateProduct = async () => {
        if (!selectedProduct) return;

        const isPhone = selectedProduct.type === 'phone' || selectedProduct.type === 'phones';
        const isLaptop = selectedProduct.type === 'laptop' || selectedProduct.type === 'laptops';

        const data = {
            type: selectedProduct.type,
            brand: editData.brand,
            pricing: {
                basePrice: parseFloat(editData.price),
                discount: parseFloat(editData.discount || '0'),
            },
            image: editData.image,
        };

        if (isPhone) {
            Object.assign(data, {
                model: editData.model,
                color: editData.color,
                processor: editData.processor,
                display: editData.display,
                battery: parseInt(editData.battery),
                camera: editData.camera,
                os: editData.os,
                network: editData.network,
                weight: editData.weight,
                ram: editData.ram,
                rom: editData.rom,
                condition: editData.condition,
            });
        } else if (isLaptop) {
            Object.assign(data, {
                series: editData.series,
                processor_name: editData.processor_name,
                processor_generation: editData.processor_generation,
                ram: editData.ram,
                storage_type: editData.storage_type,
                storage_capacity: editData.storage_capacity,
                display_size: parseFloat(editData.display_size),
                weight: parseFloat(editData.weight),
                condition: editData.condition,
                os: editData.os,
            });
        }

        try {
            const response = await fetch(
                `/api/supervisor/inventory/${selectedProduct.type}/${selectedProduct.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(data),
                }
            );
            const result = await response.json();

            if (result.success) {
                alert('Item updated successfully!');
                closeModal();
                fetchInventory();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item.');
        }
    };

    const deleteProduct = async () => {
        if (!selectedProduct || !window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(
                `/api/supervisor/inventory/${selectedProduct.type}/${selectedProduct.id}`,
                { method: 'DELETE', credentials: 'include' }
            );
            const result = await response.json();

            if (result.success) {
                alert('Item deleted successfully!');
                closeModal();
                fetchInventory();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item.');
        }
    };

    const renderEditForm = () => {
        if (!selectedProduct) return null;
        const isPhone = selectedProduct.type === 'phone' || selectedProduct.type === 'phones';
        const isLaptop = selectedProduct.type === 'laptop' || selectedProduct.type === 'laptops';

        return (
            <div>
                <p><strong>Type:</strong> {selectedProduct.type}</p>
                <p><strong>ID:</strong> {selectedProduct.id}</p>

                <div className="form-group">
                    <label>Brand:</label>
                    <input type="text" name="brand" value={editData.brand || ''} onChange={handleEditChange} />
                </div>
                <div className="form-group">
                    <label>Base Price (₹):</label>
                    <input type="number" name="price" value={editData.price || ''} onChange={handleEditChange} min="0" step="1" />
                </div>
                <div className="form-group">
                    <label>Discount (%):</label>
                    <input type="number" name="discount" value={editData.discount || '0'} onChange={handleEditChange} min="0" max="100" step="1" />
                </div>
                <div className="form-group">
                    <label>Image URL:</label>
                    <input type="text" name="image" value={editData.image || ''} onChange={handleEditChange} />
                </div>

                {isPhone && (
                    <>
                        <div className="form-group"><label>Model:</label><input type="text" name="model" value={editData.model || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Color:</label><input type="text" name="color" value={editData.color || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Processor:</label><input type="text" name="processor" value={editData.processor || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Display:</label><input type="text" name="display" value={editData.display || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Battery:</label><input type="number" name="battery" value={editData.battery || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Camera:</label><input type="text" name="camera" value={editData.camera || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>OS:</label><input type="text" name="os" value={editData.os || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Network:</label><input type="text" name="network" value={editData.network || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Weight:</label><input type="text" name="weight" value={editData.weight || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>RAM:</label><input type="text" name="ram" value={editData.ram || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>ROM:</label><input type="text" name="rom" value={editData.rom || ''} onChange={handleEditChange} /></div>
                        <div className="form-group">
                            <label>Condition:</label>
                            <select name="condition" value={editData.condition || 'Used'} onChange={handleEditChange}>
                                <option value="Used">Used</option>
                                <option value="Like New">Like New</option>
                                <option value="Refurbished">Refurbished</option>
                            </select>
                        </div>
                    </>
                )}

                {isLaptop && (
                    <>
                        <div className="form-group"><label>Series:</label><input type="text" name="series" value={editData.series || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Processor Name:</label><input type="text" name="processor_name" value={editData.processor_name || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Processor Generation:</label><input type="text" name="processor_generation" value={editData.processor_generation || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>RAM:</label><input type="text" name="ram" value={editData.ram || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Storage Type:</label><input type="text" name="storage_type" value={editData.storage_type || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Storage Capacity:</label><input type="text" name="storage_capacity" value={editData.storage_capacity || ''} onChange={handleEditChange} /></div>
                        <div className="form-group"><label>Display Size:</label><input type="number" name="display_size" value={editData.display_size || ''} onChange={handleEditChange} step="0.1" /></div>
                        <div className="form-group"><label>Weight:</label><input type="number" name="weight" value={editData.weight || ''} onChange={handleEditChange} step="0.1" /></div>
                        <div className="form-group">
                            <label>Condition:</label>
                            <select name="condition" value={editData.condition || 'Used'} onChange={handleEditChange}>
                                <option value="Used">Used</option>
                                <option value="Like New">Like New</option>
                                <option value="Refurbished">Refurbished</option>
                            </select>
                        </div>
                        <div className="form-group"><label>OS:</label><input type="text" name="os" value={editData.os || ''} onChange={handleEditChange} /></div>
                    </>
                )}
            </div>
        );
    };

    const typeLabel = supervisorType === 'phone' ? 'Phone' : supervisorType === 'laptop' ? 'Laptop' : '';

    return (
        <SupervisorLayout>
            <div className="manage-inventory">
                <h1>Manage Inventory {typeLabel && `— ${typeLabel}s`}</h1>

                <div className="inventory-container">
                    {filteredInventory.length === 0 ? (
                        <div className="no-items">
                            <i className="fas fa-info-circle"></i>
                            <div>No {typeLabel.toLowerCase()} items found in inventory.</div>
                        </div>
                    ) : (
                        filteredInventory.map(product => (
                            <div key={`${product.type}-${product.id}`} className="inventory-card">
                                <h3>{product.type.charAt(0).toUpperCase() + product.type.slice(1)} #{product.id}</h3>
                                <p><strong>Brand:</strong> {product.brand}</p>
                                <p><strong>Base Price:</strong> ₹{product.pricing?.basePrice || product.base_price || 'N/A'}</p>
                                <p><strong>Discount:</strong> {product.pricing?.discount || product.discount || '0'}%</p>
                                {(product.type === 'phone' || product.type === 'phones') &&
                                    <p><strong>Model:</strong> {product.model || 'N/A'}</p>}
                                {(product.type === 'laptop' || product.type === 'laptops') &&
                                    <p><strong>Series:</strong> {product.series || 'N/A'}</p>}
                                <button className="btn-view" onClick={() => showProductDetails(product)}>
                                    <i className="fas fa-eye"></i> View/Manage
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Product Details</h2>
                                <span className="close" onClick={closeModal}>&times;</span>
                            </div>
                            <div className="modal-body">
                                {renderEditForm()}
                            </div>
                            <div className="modal-footer">
                                <button className="btn update" onClick={updateProduct}>
                                    <i className="fas fa-save"></i> Update
                                </button>
                                <button className="btn delete" onClick={deleteProduct}>
                                    <i className="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SupervisorLayout>
    );
};

export default ManageInventory;