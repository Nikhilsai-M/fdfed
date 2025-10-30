import React, { useState, useEffect } from 'react';
import SupervisorLayout from '../../components/supervisor/SupervisorLayout';
import '/src/styles/ManageInventory.css'; 

const ManageInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [createMessage, setCreateMessage] = useState('');
    const [formData, setFormData] = useState({
        itemType: 'phone',
        id: '',
        brand: '',
        price: '',
        discount: '0',
        image: ''
    });
    const [dynamicFields, setDynamicFields] = useState({});

    // Dynamic field definitions
    const fieldTemplates = {
        phone: {
            model: '', color: '', processor: '', display: '', battery: '', 
            camera: '', os: '', network: '', weight: '', ram: '', rom: '', condition: 'Used'
        },
        laptop: {
            series: '', processor_name: '', processor_generation: '', ram: '', 
            storage_type: '', storage_capacity: '', display_size: '', weight: '', 
            condition: 'Used', os: ''
        },
        earphones: {
            title: '', design: '', battery_life: ''
        },
        chargers: {
            title: '', wattage: '', Pin_type: '', output_current: ''
        },
        mouses: {
            title: '', type: '', connectivity: '', resolution: ''
        },
        smartwatches: {
            title: '', display_size: '', display_type: '', battery_runtime: ''
        }
    };

    // Initialize dynamic fields
    useEffect(() => {
        setDynamicFields(fieldTemplates[formData.itemType]);
    }, [formData.itemType]);

    // Fetch all inventory items
    const fetchInventory = async () => {
        try {
            const response = await fetch('/api/supervisor/inventory', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            if (data.success) {
                setInventory(data.items);
                setFilteredInventory(data.items);
            }
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    // Filter products
    const filterProducts = (filter) => {
        setActiveFilter(filter);
        if (filter === 'all') {
            setFilteredInventory(inventory);
        } else {
            const filtered = inventory.filter(product => product.type === filter);
            setFilteredInventory(filtered);
        }
    };

    // Show product details in modal
    const showProductDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle dynamic field changes
    const handleDynamicFieldChange = (e) => {
        const { name, value } = e.target;
        setDynamicFields(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Create new inventory item
    const createInventoryItem = async (e) => {
        e.preventDefault();
        
        const data = {
            type: formData.itemType,
            id: formData.id,
            brand: formData.brand,
            pricing: {
                originalPrice: parseFloat(formData.price),
                discount: parseFloat(formData.discount || '0')
            },
            image: formData.image,
            ...dynamicFields
        };

        try {
            const response = await fetch('/api/supervisor/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (result.success) {
                setCreateMessage('Item added successfully!');
                // Reset form
                setFormData({
                    itemType: 'phone',
                    id: '',
                    brand: '',
                    price: '',
                    discount: '0',
                    image: ''
                });
                setDynamicFields(fieldTemplates.phone);
                fetchInventory();
                
                // Clear message after 3 seconds
                setTimeout(() => setCreateMessage(''), 3000);
            } else {
                setCreateMessage(result.message || 'Failed to add item.');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            setCreateMessage('Error adding item.');
        }
    };

    // Update product
    const updateProduct = async () => {
        if (!selectedProduct) return;

        const form = document.getElementById('editForm');
        const formData = new FormData(form);
        
        const data = {
            type: selectedProduct.type,
            brand: formData.get('brand'),
            pricing: {
                originalPrice: parseFloat(formData.get('price')),
                discount: parseFloat(formData.get('discount') || '0')
            },
            image: formData.get('image')
        };

        // Add dynamic fields based on product type
        if (selectedProduct.type === 'phone') {
            Object.assign(data, {
                model: formData.get('model'),
                color: formData.get('color'),
                processor: formData.get('processor'),
                display: formData.get('display'),
                battery: parseInt(formData.get('battery')),
                camera: formData.get('camera'),
                os: formData.get('os'),
                network: formData.get('network'),
                weight: formData.get('weight'),
                ram: formData.get('ram'),
                rom: formData.get('rom'),
                condition: formData.get('condition')
            });
        } else if (selectedProduct.type === 'laptop') {
            Object.assign(data, {
                series: formData.get('series'),
                processor_name: formData.get('processor_name'),
                processor_generation: formData.get('processor_generation'),
                ram: formData.get('ram'),
                storage_type: formData.get('storage_type'),
                storage_capacity: formData.get('storage_capacity'),
                display_size: parseFloat(formData.get('display_size')),
                weight: parseFloat(formData.get('weight')),
                condition: formData.get('condition'),
                os: formData.get('os')
            });
        } else if (selectedProduct.type === 'earphones') {
            Object.assign(data, {
                title: formData.get('title'),
                design: formData.get('design'),
                battery_life: formData.get('battery_life')
            });
        } else if (selectedProduct.type === 'chargers') {
            Object.assign(data, {
                title: formData.get('title'),
                wattage: formData.get('wattage'),
                type: formData.get('type'),
                output_current: formData.get('output_current')
            });
        } else if (selectedProduct.type === 'mouses') {
            Object.assign(data, {
                title: formData.get('title'),
                type: formData.get('type'),
                connectivity: formData.get('connectivity'),
                resolution: formData.get('resolution')
            });
        } else if (selectedProduct.type === 'smartwatches') {
            Object.assign(data, {
                title: formData.get('title'),
                display_size: formData.get('display_size'),
                display_type: formData.get('display_type'),
                battery_runtime: formData.get('battery_runtime')
            });
        }

        try {
            const response = await fetch(`/api/supervisor/inventory/${selectedProduct.type}/${selectedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            });
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

    // Delete product
    const deleteProduct = async () => {
        if (!selectedProduct || !window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`/api/supervisor/inventory/${selectedProduct.type}/${selectedProduct.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
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

    // Initial fetch
    useEffect(() => {
        fetchInventory();
    }, []);

    // Render dynamic fields for create form
    const renderDynamicFields = () => {
        const fields = fieldTemplates[formData.itemType];
        return Object.keys(fields).map(field => {
            if (field === 'condition' && (formData.itemType === 'phone' || formData.itemType === 'laptop')) {
                return (
                    <div key={field} className="form-group">
                        <label>{field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)}:</label>
                        <select 
                            name={field} 
                            value={dynamicFields[field] || ''} 
                            onChange={handleDynamicFieldChange}
                            required
                        >
                            <option value="Used">Used</option>
                            <option value="Like New">Like New</option>
                            <option value="Refurbished">Refurbished</option>
                        </select>
                    </div>
                );
            }
            
            const inputType = typeof fields[field] === 'number' ? 'number' : 'text';
            const step = field.includes('size') || field.includes('weight') ? '0.1' : '1';
            
            return (
                <div key={field} className="form-group">
                    <label>{field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)}:</label>
                    <input
                        type={inputType}
                        name={field}
                        value={dynamicFields[field] || ''}
                        onChange={handleDynamicFieldChange}
                        required
                        step={step}
                    />
                </div>
            );
        });
    };

    // Render product details for modal
    const renderProductDetails = () => {
        if (!selectedProduct) return null;

        return (
            <form id="editForm">
                <p><strong>Type:</strong> {selectedProduct.type.charAt(0).toUpperCase() + selectedProduct.type.slice(1)}</p>
                <p><strong>ID:</strong> {selectedProduct.id}</p>
                
                <div className="form-group">
                    <label>Brand:</label>
                    <input type="text" name="brand" defaultValue={selectedProduct.brand || ''} required />
                </div>
                
                <div className="form-group">
                    <label>Original Price (₹):</label>
                    <input 
                        type="number" 
                        name="price" 
                        defaultValue={selectedProduct.originalPrice || selectedProduct.basePrice || selectedProduct.pricing?.basePrice || ''} 
                        min="0" 
                        step="1" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Discount (%):</label>
                    <input 
                        type="number" 
                        name="discount" 
                        defaultValue={selectedProduct.discount || selectedProduct.pricing.discount || '0'} 
                        min="0" 
                        max="100" 
                        step="1" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Image URL:</label>
                    <input type="text" name="image" defaultValue={selectedProduct.image || ''} required />
                </div>

                {/* Dynamic fields based on product type */}
                {selectedProduct.type === 'phones' && (
                    <>
                        <div className="form-group"><label>Model:</label><input type="text" name="model" defaultValue={selectedProduct.model || ''} required /></div>
                        <div className="form-group"><label>Color:</label><input type="text" name="color" defaultValue={selectedProduct.color || ''} required /></div>
                        <div className="form-group"><label>Processor:</label><input type="text" name="processor" defaultValue={selectedProduct.specs.processor || ''} required /></div>
                        <div className="form-group"><label>Display:</label><input type="text" name="display" defaultValue={selectedProduct.specs.display || ''} required /></div>
                        <div className="form-group"><label>Battery:</label><input type="number" name="battery" defaultValue={selectedProduct.specs.battery || ''} required /></div>
                        <div className="form-group"><label>Camera:</label><input type="text" name="camera" defaultValue={selectedProduct.specs.camera || ''} required /></div>
                        <div className="form-group"><label>OS:</label><input type="text" name="os" defaultValue={selectedProduct.specs.os || ''} required /></div>
                        <div className="form-group"><label>Network:</label><input type="text" name="network" defaultValue={selectedProduct.specs.network || ''} required /></div>
                        <div className="form-group"><label>Weight:</label><input type="text" name="weight" defaultValue={selectedProduct.specs.weight || ''} required /></div>
                        <div className="form-group"><label>RAM:</label><input type="text" name="ram" defaultValue={selectedProduct.ram || ''} required /></div>
                        <div className="form-group"><label>ROM:</label><input type="text" name="rom" defaultValue={selectedProduct.rom || ''} required /></div>
                        <div className="form-group">
                            <label>Condition:</label>
                            <select name="condition" defaultValue={selectedProduct.condition || 'Used'} required>
                                <option value="Used">Used</option>
                                <option value="Like New">Like New</option>
                                <option value="Refurbished">Refurbished</option>
                            </select>
                        </div>
                    </>
                )}

                {selectedProduct.type === 'laptops' && (
                    <>
                        <div className="form-group"><label>Series:</label><input type="text" name="series" defaultValue={selectedProduct.series || ''} required /></div>
                        <div className="form-group"><label>Processor Name:</label><input type="text" name="processor_name" defaultValue={selectedProduct.processor.name || ''} required /></div>
                        <div className="form-group"><label>Processor Generation:</label><input type="text" name="processor_generation" defaultValue={selectedProduct.processor.generation || ''} required /></div>
                        <div className="form-group"><label>RAM:</label><input type="text" name="ram" defaultValue={selectedProduct.memory.ram || ''} required /></div>
                        <div className="form-group"><label>Storage Type:</label><input type="text" name="storage_type" defaultValue={selectedProduct.memory.storage.type || ''} required /></div>
                        <div className="form-group"><label>Storage Capacity:</label><input type="text" name="storage_capacity" defaultValue={selectedProduct.memory.storage.capacity || ''} required /></div>
                        <div className="form-group"><label>Display Size:</label><input type="number" name="display_size" defaultValue={selectedProduct.displaysize || ''} step="0.1" required /></div>
                        <div className="form-group"><label>Weight:</label><input type="number" name="weight" defaultValue={selectedProduct.weight || ''} step="0.1" required /></div>
                        <div className="form-group">
                            <label>Condition:</label>
                            <select name="condition" defaultValue={selectedProduct.condition || 'Used'} required>
                                <option value="Used">Used</option>
                                <option value="Like New">Like New</option>
                                <option value="Refurbished">Refurbished</option>
                            </select>
                        </div>
                        <div className="form-group"><label>OS:</label><input type="text" name="os" defaultValue={selectedProduct.os || ''} required /></div>
                    </>
                )}

                {selectedProduct.type === 'earphones' && (
                    <>
                        <div className="form-group"><label>Title:</label><input type="text" name="title" defaultValue={selectedProduct.title || ''} required /></div>
                        <div className="form-group"><label>Design:</label><input type="text" name="design" defaultValue={selectedProduct.design || ''} required /></div>
                        <div className="form-group"><label>Battery Life:</label><input type="text" name="battery_life" defaultValue={selectedProduct.batteryLife || ''} required /></div>
                    </>
                )}

                {selectedProduct.type === 'chargers' && (
                    <>
                        <div className="form-group"><label>Title:</label><input type="text" name="title" defaultValue={selectedProduct.title || ''} required /></div>
                        <div className="form-group"><label>Wattage:</label><input type="text" name="wattage" defaultValue={selectedProduct.wattage || ''} required /></div>
                        <div className="form-group"><label>Type:</label><input type="text" name="type" defaultValue={selectedProduct.type || ''} required /></div>
                        <div className="form-group"><label>Output Current:</label><input type="text" name="output_current" defaultValue={selectedProduct.outputCurrent || ''} required /></div>
                    </>
                )}

                {selectedProduct.type === 'mouses' && (
                    <>
                        <div className="form-group"><label>Title:</label><input type="text" name="title" defaultValue={selectedProduct.title || ''} required /></div>
                        <div className="form-group"><label>Type:</label><input type="text" name="type" defaultValue={selectedProduct.type || ''} required /></div>
                        <div className="form-group"><label>Connectivity:</label><input type="text" name="connectivity" defaultValue={selectedProduct.connectivity || ''} required /></div>
                        <div className="form-group"><label>Resolution:</label><input type="text" name="resolution" defaultValue={selectedProduct.resolution || ''} required /></div>
                    </>
                )}

                {selectedProduct.type === 'smartwatches' && (
                    <>
                        <div className="form-group"><label>Title:</label><input type="text" name="title" defaultValue={selectedProduct.title || ''} required /></div>
                        <div className="form-group"><label>Display Size:</label><input type="text" name="display_size" defaultValue={selectedProduct.displaySize || ''} required /></div>
                        <div className="form-group"><label>Display Type:</label><input type="text" name="display_type" defaultValue={selectedProduct.displayType || ''} required /></div>
                        <div className="form-group"><label>Battery Runtime:</label><input type="text" name="battery_runtime" defaultValue={selectedProduct.batteryRuntime || ''} required /></div>
                    </>
                )}
            </form>
        );
    };

    return (
        <SupervisorLayout>
            <div className="manage-inventory">
                <h1>Manage Inventory</h1>
                
                {/* Create New Item Form */}
                <div className="create-section">
                    <h2>Add New Item</h2>
                    <form onSubmit={createInventoryItem} className="create-form">
                        <div className="form-group">
                            <label>Item Type:</label>
                            <select name="itemType" value={formData.itemType} onChange={handleInputChange} required>
                                <option value="phone">Phone</option>
                                <option value="laptop">Laptop</option>
                                <option value="earphones">Earphones</option>
                                <option value="chargers">Chargers</option>
                                <option value="mouses">Mouses</option>
                                <option value="smartwatches">Smartwatches</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>ID:</label>
                            <input type="text" name="id" value={formData.id} onChange={handleInputChange} required />
                        </div>

                        <div className="form-group">
                            <label>Brand:</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required />
                        </div>

                        <div className="form-group">
                            <label>Price (₹):</label>
                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="1" required />
                        </div>

                        <div className="form-group">
                            <label>Discount (%):</label>
                            <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} min="0" max="100" step="1" required />
                        </div>

                        <div className="form-group">
                            <label>Image URL:</label>
                            <input type="text" name="image" value={formData.image} onChange={handleInputChange} required />
                        </div>

                        {/* Dynamic Fields */}
                        <div className="dynamic-fields">
                            {renderDynamicFields()}
                        </div>

                        <button type="submit" className="btn-submit">Add Item</button>
                        
                        {createMessage && (
                            <div className={`message ${createMessage.includes('successfully') ? 'success' : 'error'}`}>
                                {createMessage}
                            </div>
                        )}
                    </form>
                </div>

                {/* Filter Buttons */}
                <div className="filter-section">
                    <button 
                        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => filterProducts('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'phone' ? 'active' : ''}`}
                        onClick={() => filterProducts('phones')}
                    >
                        Phones
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'laptop' ? 'active' : ''}`}
                        onClick={() => filterProducts('laptops')}
                    >
                        Laptops
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'earphones' ? 'active' : ''}`}
                        onClick={() => filterProducts('earphones')}
                    >
                        Earphones
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'chargers' ? 'active' : ''}`}
                        onClick={() => filterProducts('chargers')}
                    >
                        Chargers
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'mouses' ? 'active' : ''}`}
                        onClick={() => filterProducts('mouses')}
                    >
                        Mouses
                    </button>
                    <button 
                        className={`filter-btn ${activeFilter === 'smartwatches' ? 'active' : ''}`}
                        onClick={() => filterProducts('smartwatches')}
                    >
                        Smartwatches
                    </button>
                </div>

                {/* Inventory List */}
                <div className="inventory-container">
                    {filteredInventory.length === 0 ? (
                        <div className="no-items">
                            <i className="fas fa-info-circle"></i>
                            <div>No items found.</div>
                        </div>
                    ) : (
                        filteredInventory.map(product => (
                            <div key={`${product.type}-${product.id}`} className="inventory-card">
                                <h3>{product.type.charAt(0).toUpperCase() + product.type.slice(1)} #{product.id}</h3>
                                <p><strong>Brand:</strong> {product.brand}</p>
                                <p><strong>Price:</strong> ₹{product.originalPrice || product.base_price || product.pricing?.basePrice || 'N/A'}</p>
                                <p><strong>Discount:</strong> {product.discount || product.pricing?.discount || '0'}%</p>
                                {product.type === 'phone' && <p><strong>Model:</strong> {product.model || 'N/A'}</p>}
                                {product.type === 'laptop' && <p><strong>Series:</strong> {product.series || 'N/A'}</p>}
                                {['earphones', 'chargers', 'mouses', 'smartwatches'].includes(product.type) && 
                                    <p><strong>Title:</strong> {product.title || 'N/A'}</p>
                                }
                                <button 
                                    className="btn-view"
                                    onClick={() => showProductDetails(product)}
                                >
                                    <i className="fas fa-eye"></i> View/Manage
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Product Details</h2>
                                <span className="close" onClick={closeModal}>&times;</span>
                            </div>
                            <div className="modal-body">
                                {renderProductDetails()}
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