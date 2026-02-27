import React, { useState, useEffect } from 'react';

const ManageInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [createMessage, setCreateMessage] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        itemType: 'earphones',
        id: '',
        brand: '',
        price: '',
        discount: '0',
        image: ''
    });
    const [dynamicFields, setDynamicFields] = useState({});

    const categoryConfig = {
        all:         { icon: '▦', color: '#1a1a2e', light: '#f0f0f8' },
        earphones:   { icon: '◉', color: '#e85d26', light: '#fff3ee' },
        chargers:    { icon: '⚡', color: '#c9920a', light: '#fffbee' },
        mouses:      { icon: '⬡', color: '#0e7a6e', light: '#edfaf8' },
        smartwatches:{ icon: '◷', color: '#6b3fa0', light: '#f5effe' },
    };

    const fieldTemplates = {
        earphones:    { title: '', design: '', battery_life: '' },
        chargers:     { title: '', wattage: '', Pin_type: '', output_current: '' },
        mouses:       { title: '', type: '', connectivity: '', resolution: '' },
        smartwatches: { title: '', display_size: '', display_type: '', battery_runtime: '' }
    };

    useEffect(() => {
        setDynamicFields({ ...fieldTemplates[formData.itemType] });
    }, [formData.itemType]);

    const fetchInventory = async () => {
        try {
            const response = await fetch('/api/supervisor/inventory', { credentials: 'include' });
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

    const filterProducts = (filter) => {
        setActiveFilter(filter);
        setFilteredInventory(filter === 'all' ? inventory : inventory.filter(p => p.type === filter));
    };

    const showProductDetails = (product) => { setSelectedProduct(product); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setSelectedProduct(null); };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDynamicFieldChange = (e) => {
        const { name, value } = e.target;
        setDynamicFields(prev => ({ ...prev, [name]: value }));
    };

    const createInventoryItem = async (e) => {
        e.preventDefault();
        const data = {
            type: formData.itemType,
            id: formData.id,
            brand: formData.brand,
            pricing: { originalPrice: parseFloat(formData.price), discount: parseFloat(formData.discount || '0') },
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
                setFormData({ itemType: 'earphones', id: '', brand: '', price: '', discount: '0', image: '' });
                setDynamicFields({ ...fieldTemplates.earphones });
                fetchInventory();
                setTimeout(() => setCreateMessage(''), 3000);
            } else {
                setCreateMessage(result.message || 'Failed to add item.');
            }
        } catch (error) {
            setCreateMessage('Error adding item.');
        }
    };

    const updateProduct = async () => {
        if (!selectedProduct) return;
        const form = document.getElementById('editForm');
        const fd = new FormData(form);
        const data = {
            type: selectedProduct.type,
            brand: fd.get('brand'),
            pricing: { originalPrice: parseFloat(fd.get('price')), discount: parseFloat(fd.get('discount') || '0') },
            image: fd.get('image')
        };
        if (selectedProduct.type === 'earphones') Object.assign(data, { title: fd.get('title'), design: fd.get('design'), battery_life: fd.get('battery_life') });
        else if (selectedProduct.type === 'chargers') Object.assign(data, { title: fd.get('title'), wattage: fd.get('wattage'), type: fd.get('type'), output_current: fd.get('output_current') });
        else if (selectedProduct.type === 'mouses') Object.assign(data, { title: fd.get('title'), type: fd.get('type'), connectivity: fd.get('connectivity'), resolution: fd.get('resolution') });
        else if (selectedProduct.type === 'smartwatches') Object.assign(data, { title: fd.get('title'), display_size: fd.get('display_size'), display_type: fd.get('display_type'), battery_runtime: fd.get('battery_runtime') });

        try {
            const response = await fetch(`/api/supervisor/inventory/${selectedProduct.type}/${selectedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) { alert('Item updated successfully!'); closeModal(); fetchInventory(); }
            else alert('Error: ' + result.message);
        } catch (error) { alert('Error updating item.'); }
    };

    const deleteProduct = async () => {
        if (!selectedProduct || !window.confirm('Are you sure you want to delete this item?')) return;
        try {
            const response = await fetch(`/api/supervisor/inventory/${selectedProduct.type}/${selectedProduct.id}`, {
                method: 'DELETE', credentials: 'include'
            });
            const result = await response.json();
            if (result.success) { alert('Item deleted successfully!'); closeModal(); fetchInventory(); }
            else alert('Error: ' + result.message);
        } catch (error) { alert('Error deleting item.'); }
    };

    useEffect(() => { fetchInventory(); }, []);

    const renderProductDetails = () => {
        if (!selectedProduct) return null;
        const cfg = categoryConfig[selectedProduct.type] || categoryConfig.all;
        const baseFields = [
            { label: 'Brand', name: 'brand', value: selectedProduct.brand, type: 'text' },
            { label: 'Original Price (₹)', name: 'price', value: selectedProduct.originalPrice || selectedProduct.base_price || selectedProduct.pricing?.basePrice, type: 'number' },
            { label: 'Discount (%)', name: 'discount', value: selectedProduct.discount || selectedProduct.pricing?.discount || '0', type: 'number' },
            { label: 'Image URL', name: 'image', value: selectedProduct.image, type: 'text', full: true },
        ];
        return (
            <form id="editForm">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, padding: '10px 14px', background: cfg.light, borderRadius: 10, border: `1px solid ${cfg.color}22` }}>
                    <span style={{ fontSize: 22 }}>{cfg.icon}</span>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: cfg.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{selectedProduct.type}</p>
                        <p style={{ fontSize: 12, color: '#aaa', marginTop: 1 }}>ID: {selectedProduct.id}</p>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {baseFields.map(f => (
                        <div key={f.name} style={f.full ? { gridColumn: '1/-1' } : {}}>
                            <label style={S.label}>{f.label}</label>
                            <input type={f.type} name={f.name} defaultValue={f.value || ''} required className="inv-input" />
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0ede6' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#bbb', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Specifications</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        {selectedProduct.type === 'earphones' && <>
                            <div style={{ gridColumn: '1/-1' }}><label style={S.label}>Title</label><input type="text" name="title" defaultValue={selectedProduct.title || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Design</label><input type="text" name="design" defaultValue={selectedProduct.design || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Battery Life</label><input type="text" name="battery_life" defaultValue={selectedProduct.batteryLife || ''} required className="inv-input" /></div>
                        </>}
                        {selectedProduct.type === 'chargers' && <>
                            <div style={{ gridColumn: '1/-1' }}><label style={S.label}>Title</label><input type="text" name="title" defaultValue={selectedProduct.title || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Wattage</label><input type="text" name="wattage" defaultValue={selectedProduct.wattage || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Type</label><input type="text" name="type" defaultValue={selectedProduct.type || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Output Current</label><input type="text" name="output_current" defaultValue={selectedProduct.outputCurrent || ''} required className="inv-input" /></div>
                        </>}
                        {selectedProduct.type === 'mouses' && <>
                            <div style={{ gridColumn: '1/-1' }}><label style={S.label}>Title</label><input type="text" name="title" defaultValue={selectedProduct.title || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Type</label><input type="text" name="type" defaultValue={selectedProduct.type || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Connectivity</label><input type="text" name="connectivity" defaultValue={selectedProduct.connectivity || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Resolution</label><input type="text" name="resolution" defaultValue={selectedProduct.resolution || ''} required className="inv-input" /></div>
                        </>}
                        {selectedProduct.type === 'smartwatches' && <>
                            <div style={{ gridColumn: '1/-1' }}><label style={S.label}>Title</label><input type="text" name="title" defaultValue={selectedProduct.title || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Display Size</label><input type="text" name="display_size" defaultValue={selectedProduct.displaySize || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Display Type</label><input type="text" name="display_type" defaultValue={selectedProduct.displayType || ''} required className="inv-input" /></div>
                            <div><label style={S.label}>Battery Runtime</label><input type="text" name="battery_runtime" defaultValue={selectedProduct.batteryRuntime || ''} required className="inv-input" /></div>
                        </>}
                    </div>
                </div>
            </form>
        );
    };

    const filters = ['all', 'earphones', 'chargers', 'mouses', 'smartwatches'];
    const countFor = (f) => f === 'all' ? inventory.length : inventory.filter(p => p.type === f).length;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Mulish:wght@300;400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .inv-root {
                    min-height: 100vh;
                    background: #f7f6f2;
                    font-family: 'Mulish', sans-serif;
                    color: #1a1a2e;
                }
                .inv-header {
                    background: #fff;
                    border-bottom: 1px solid #ece9e0;
                    padding: 28px 40px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 20px;
                }
                .inv-body { padding: 36px 40px; }

                .create-panel {
                    background: #fff;
                    border: 1px solid #ece9e0;
                    border-radius: 16px;
                    margin-bottom: 32px;
                    overflow: hidden;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                }
                .create-toggle {
                    padding: 18px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    user-select: none;
                    transition: background 0.15s;
                }
                .create-toggle:hover { background: #faf9f7; }

                .inv-input {
                    width: 100%;
                    border: 1.5px solid #e8e5dc;
                    border-radius: 10px;
                    padding: 10px 14px;
                    font-family: 'Mulish', sans-serif;
                    font-size: 14px;
                    color: #1a1a2e;
                    background: #faf9f7;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    appearance: none;
                }
                .inv-input:focus {
                    border-color: #1a1a2e;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(26,26,46,0.06);
                }
                .inv-input::placeholder { color: #ccc; }

                .filter-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }
                .pill {
                    padding: 7px 16px;
                    border-radius: 100px;
                    border: 1.5px solid #e8e5dc;
                    background: #fff;
                    font-family: 'Mulish', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    color: #999;
                    cursor: pointer;
                    transition: all 0.18s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .pill:hover { border-color: #1a1a2e; color: #1a1a2e; }
                .pill.active { background: #1a1a2e; border-color: #1a1a2e; color: #fff; }

                .inv-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 18px;
                }
                .inv-card {
                    background: #fff;
                    border: 1.5px solid #ece9e0;
                    border-radius: 16px;
                    padding: 22px;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s;
                    position: relative;
                    overflow: hidden;
                }
                .inv-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.09);
                    border-color: var(--card-color, #1a1a2e);
                }

                .modal-bg {
                    position: fixed;
                    inset: 0;
                    background: rgba(247,246,242,0.8);
                    backdrop-filter: blur(10px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .modal-box {
                    background: #fff;
                    border: 1.5px solid #ece9e0;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 580px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 24px 80px rgba(0,0,0,0.12);
                    animation: slideUp 0.25s ease;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(14px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .modal-box::-webkit-scrollbar { width: 4px; }
                .modal-box::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

                .btn-save {
                    background: #1a1a2e; color: #fff; border: none; border-radius: 10px;
                    padding: 11px 26px; font-family: 'Mulish', sans-serif; font-size: 14px;
                    font-weight: 700; cursor: pointer; transition: opacity 0.15s;
                }
                .btn-save:hover { opacity: 0.85; }
                .btn-del {
                    background: #fff; color: #d93025; border: 1.5px solid #fad2cf;
                    border-radius: 10px; padding: 11px 26px; font-family: 'Mulish', sans-serif;
                    font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s;
                }
                .btn-del:hover { background: #fff5f4; border-color: #d93025; }
                .btn-add {
                    background: #1a1a2e; color: #fff; border: none; border-radius: 10px;
                    padding: 11px 28px; font-family: 'Mulish', sans-serif; font-size: 14px;
                    font-weight: 700; cursor: pointer; transition: opacity 0.15s;
                }
                .btn-add:hover { opacity: 0.85; }

                .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
                @media (max-width: 540px) {
                    .form-2col { grid-template-columns: 1fr; }
                    .inv-header { padding: 20px; flex-direction: column; align-items: flex-start; }
                    .inv-body { padding: 20px; }
                }
            `}</style>

            <div className="inv-root">
                {/* Header */}
                <div className="inv-header">
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#bbb', textTransform: 'uppercase', marginBottom: 6 }}>
                            Supervisor · Stock Control
                        </p>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.01em' }}>
                            Manage Inventory
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                        {filters.slice(1).map(f => {
                            const cfg = categoryConfig[f];
                            return (
                                <div key={f} style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: 22, fontWeight: 800, color: cfg.color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{countFor(f)}</p>
                                    <p style={{ fontSize: 10, color: '#bbb', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>{f}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="inv-body">
                    {/* Add Form */}
                    <div className="create-panel">
                        <div className="create-toggle" onClick={() => setShowCreateForm(p => !p)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 30, height: 30, borderRadius: 8, background: '#f0ede6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: '#1a1a2e' }}>+</div>
                                <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Add New Item</span>
                            </div>
                            <span style={{ color: '#ccc', fontSize: 18, display: 'inline-block', transition: 'transform 0.2s', transform: showCreateForm ? 'rotate(180deg)' : 'none' }}>⌄</span>
                        </div>

                        {showCreateForm && (
                            <form onSubmit={createInventoryItem} style={{ padding: '24px', borderTop: '1px solid #f0ede6' }}>
                                <div className="form-2col">
                                    <div>
                                        <label style={S.label}>Item Type</label>
                                        <select name="itemType" value={formData.itemType} onChange={handleInputChange} required className="inv-input" style={{ cursor: 'pointer' }}>
                                            <option value="earphones">Earphones</option>
                                            <option value="chargers">Chargers</option>
                                            <option value="mouses">Mouses</option>
                                            <option value="smartwatches">Smartwatches</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={S.label}>Item ID</label>
                                        <input className="inv-input" type="text" name="id" value={formData.id} onChange={handleInputChange} required placeholder="e.g. SKU-001" />
                                    </div>
                                    <div>
                                        <label style={S.label}>Brand</label>
                                        <input className="inv-input" type="text" name="brand" value={formData.brand} onChange={handleInputChange} required placeholder="e.g. Sony" />
                                    </div>
                                    <div>
                                        <label style={S.label}>Price (₹)</label>
                                        <input className="inv-input" type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="1" required placeholder="0" />
                                    </div>
                                    <div>
                                        <label style={S.label}>Discount (%)</label>
                                        <input className="inv-input" type="number" name="discount" value={formData.discount} onChange={handleInputChange} min="0" max="100" step="1" required placeholder="0" />
                                    </div>
                                    <div>
                                        <label style={S.label}>Image URL</label>
                                        <input className="inv-input" type="text" name="image" value={formData.image} onChange={handleInputChange} required placeholder="https://..." />
                                    </div>
                                </div>

                                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0ede6' }}>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: '#bbb', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                                        {formData.itemType} details
                                    </p>
                                    <div className="form-2col">
                                        {Object.keys(fieldTemplates[formData.itemType]).map(field => (
                                            <div key={field}>
                                                <label style={S.label}>{field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
                                                <input className="inv-input" type="text" name={field} value={dynamicFields[field] || ''} onChange={handleDynamicFieldChange} required placeholder={`Enter ${field.replace(/_/g, ' ')}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <button type="submit" className="btn-add">Add to Inventory</button>
                                    {createMessage && (
                                        <span style={{ fontSize: 13, fontWeight: 600, color: createMessage.includes('successfully') ? '#1a8a4a' : '#d93025' }}>
                                            {createMessage.includes('successfully') ? '✓ ' : '✗ '}{createMessage}
                                        </span>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="filter-pills">
                        {filters.map(f => {
                            const cfg = categoryConfig[f];
                            return (
                                <button key={f} className={`pill ${activeFilter === f ? 'active' : ''}`} onClick={() => filterProducts(f)}>
                                    <span>{cfg.icon}</span>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                    <span style={{
                                        fontSize: 11,
                                        background: activeFilter === f ? 'rgba(255,255,255,0.18)' : '#f0ede6',
                                        color: activeFilter === f ? '#fff' : '#aaa',
                                        padding: '1px 7px',
                                        borderRadius: 20,
                                        fontWeight: 700
                                    }}>{countFor(f)}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Grid */}
                    {filteredInventory.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#ccc' }}>
                            <div style={{ fontSize: 52, marginBottom: 16 }}>◫</div>
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#bbb' }}>No items found</p>
                            <p style={{ fontSize: 14, marginTop: 8, color: '#ccc' }}>Try a different filter or add new items above</p>
                        </div>
                    ) : (
                        <div className="inv-grid">
                            {filteredInventory.map(product => {
                                const cfg = categoryConfig[product.type] || categoryConfig.all;
                                const price = product.originalPrice || product.base_price || product.pricing?.basePrice || 0;
                                const disc = product.discount || product.pricing?.discount || 0;
                                return (
                                    <div
                                        key={`${product.type}-${product.id}`}
                                        className="inv-card"
                                        style={{ '--card-color': cfg.color }}
                                        onClick={() => showProductDetails(product)}
                                    >
                                        {/* Top color stripe */}
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cfg.color }} />

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, marginTop: 4 }}>
                                            <span style={{
                                                fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                                                color: cfg.color, background: cfg.light, padding: '3px 9px', borderRadius: 6
                                            }}>
                                                {cfg.icon} {product.type}
                                            </span>
                                            <span style={{ fontSize: 11, color: '#ccc', fontWeight: 500 }}>#{product.id}</span>
                                        </div>

                                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                                            {product.brand || 'Unknown'}
                                        </h3>
                                        {['earphones', 'chargers', 'mouses', 'smartwatches'].includes(product.type) && (
                                            <p style={{ fontSize: 13, color: '#aaa', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {product.title || '—'}
                                            </p>
                                        )}

                                        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f5f3ee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: '#1a1a2e' }}>
                                                ₹{Number(price).toLocaleString('en-IN')}
                                            </p>
                                            {disc > 0 && (
                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#1a8a4a', background: '#e8f8ef', padding: '3px 8px', borderRadius: 6 }}>
                                                    −{disc}%
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>Manage →</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-bg" onClick={closeModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0ede6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#bbb', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>Edit Product</p>
                                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 22, color: '#1a1a2e' }}>{selectedProduct?.brand}</h2>
                            </div>
                            <button onClick={closeModal} style={{ background: '#f7f6f2', border: '1px solid #ece9e0', color: '#999', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                        <div style={{ padding: '28px' }}>{renderProductDetails()}</div>
                        <div style={{ padding: '20px 28px', borderTop: '1px solid #f0ede6', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button className="btn-del" onClick={deleteProduct}>Delete</button>
                            <button className="btn-save" onClick={updateProduct}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const S = {
    label: {
        display: 'block',
        fontSize: 11,
        fontWeight: 700,
        color: '#aaa',
        marginBottom: 6,
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
    }
};

export default ManageInventory;