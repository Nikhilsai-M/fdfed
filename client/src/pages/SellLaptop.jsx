import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import axios from 'axios';
import { buildApiUrl } from '../utils/api';

const FormRow = ({ children }) => (
    <div className="flex flex-col gap-4 md:flex-row mb-2">
        {children}
    </div>
);

const FormGroup = ({ label, required, children, className = '' }) => (
    <div className={`flex-1 flex flex-col ${className}`}>
        <label className="text-sm font-semibold text-gray-800 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
    </div>
);

const inputClasses = "w-full p-3 border border-gray-200 rounded-xl shadow-sm bg-gray-50 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out placeholder-gray-400 focus:bg-white";
const selectClasses = `${inputClasses} appearance-none pr-8 bg-white cursor-pointer`;

const SellLaptopForm = () => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        ram: '',
        storage: '',
        processor: '',
        generation: '',
        display_size: '',
        weight: '',
        os: '',
        device_age: '',
        battery_issues: 'None',
        location: '',
        description: '',
        name: '',
        email: '',
        phone: '',
    });

    const [deviceImage, setDeviceImage] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
  
        setFormData(prevData => ({
            ...prevData,
            [name]: name === 'brand' ? value.toUpperCase() : value,
        }));
    }, []); 

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        setDeviceImage(file);
        
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFileName('No file chosen');
            setPreviewUrl('');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formPayload = new FormData();

        Object.keys(formData).forEach(key => {
            formPayload.append(key, formData[key]);
        });

        if (deviceImage) {
            formPayload.append('image_path', deviceImage); 
        }

        try {
            const response = await axios.post(
                buildApiUrl('/api/laptop-applications/submit'),
                formPayload,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data.success) {
                alert('Laptop application submitted successfully! We will review your application.');
             
                setFormData({
                    brand: '',
                    model: '',
                    ram: '',
                    storage: '',
                    processor: '',
                    generation: '',
                    display_size: '',
                    weight: '',
                    os: '',
                    device_age: '',
                    battery_issues: 'None',
                    location: '',
                    description: '',
                    name: '',
                    email: '',
                    phone: '',
                });
                setDeviceImage(null);
                setFileName('No file chosen');
                setPreviewUrl('');
                
                navigate('/listings');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            if (error.response && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('An error occurred. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <Header />

            <header className="flex justify-between items-center max-w-4xl mx-auto mb-8 py-3 border-b border-gray-200">
            
            </header>
            
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-12 border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Sell Your Laptop </h1>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                    <section className="p-6 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-6">
                        <h2 className="text-2xl font-bold text-indigo-800 border-b pb-3 mb-4">💻 Laptop Details</h2>
                        
                        <FormGroup label="Brand" required>
                            <input 
                                type="text" 
                                name="brand" 
                                value={formData.brand}
                                onChange={handleInputChange} 
                                required 
                                placeholder="E.g. DELL, HP, ASUS" 
                                className={inputClasses}
                            />
                        </FormGroup>

                        <FormGroup label="Model" required>
                            <input 
                                type="text" 
                                name="model" 
                                value={formData.model}
                                onChange={handleInputChange} 
                                required 
                                placeholder="E.g. XPS 13, MacBook Pro" 
                                className={inputClasses}
                            />
                        </FormGroup>

                        <FormRow>
                            <FormGroup label="RAM" required>
                                <select name="ram" value={formData.ram} onChange={handleInputChange} required className={selectClasses}>
                                    <option value="" disabled>Select RAM</option>
                                    <option value="4GB">4GB</option>
                                    <option value="8GB">8GB</option>
                                    <option value="16GB">16GB</option>
                                    <option value="32GB">32GB</option>
                                    <option value="64GB">64GB</option>
                                </select>
                            </FormGroup>
                            
                            <FormGroup label="Storage" required>
                                <select name="storage" value={formData.storage} onChange={handleInputChange} required className={selectClasses}>
                                    <option value="" disabled>Select Storage</option>
                                    <option value="128GB">128GB</option>
                                    <option value="256GB">256GB</option>
                                    <option value="512GB">512GB</option>
                                    <option value="1TB">1TB</option>
                                    <option value="2TB">2TB</option>
                                </select>
                            </FormGroup>
                        </FormRow>

                        <FormRow>
                            <FormGroup label="Processor" required>
                                <input type="text" name="processor" value={formData.processor} onChange={handleInputChange} required placeholder="E.g. Intel Core i7, AMD Ryzen 5" className={inputClasses}/>
                            </FormGroup>
                            
                            <FormGroup label="Generation">
                                <input type="text" name="generation" value={formData.generation} onChange={handleInputChange} placeholder="E.g. 11th Gen, Ryzen 5000" className={inputClasses}/>
                            </FormGroup>
                        </FormRow>

                        <FormRow>
                            <FormGroup label="Approximate Display Size (inches)">
                                <select name="display_size" value={formData.display_size} onChange={handleInputChange} className={selectClasses}>
                                    <option value="" disabled>Select Size</option>
                                    <option value="11-12">11-12 inches</option>
                                    <option value="13-14">13-14 inches</option>
                                    <option value="15-16">15-16 inches</option>
                                    <option value="17+">17+ inches</option>
                                </select>
                            </FormGroup>
                            
                            <FormGroup label="Approximate Weight">
                                <select name="weight" value={formData.weight} onChange={handleInputChange} className={selectClasses}>
                                    <option value="" disabled>Select Weight</option>
                                    <option value="<1kg">Less than 1kg</option>
                                    <option value="1-1.5kg">1-1.5kg</option>
                                    <option value="1.6-2kg">1.6-2kg</option>
                                    <option value="2.1-3kg">2.1-3kg</option>
                                    <option value=">3kg">More than 3kg</option>
                                </select>
                            </FormGroup>
                        </FormRow>

                        <FormRow>
                            <FormGroup label="Operating System">
                                <select name="os" value={formData.os} onChange={handleInputChange} className={selectClasses}>
                                    <option value="" disabled>Select OS</option>
                                    <option value="Windows 11">Windows 11</option>
                                    <option value="Windows 10">Windows 10</option>
                                    <option value="macOS">macOS</option>
                                    <option value="Linux">Linux</option>
                                    <option value="Chrome OS">Chrome OS</option>
                                    <option value="Other">Other</option>
                                </select>
                            </FormGroup>
                            
                            <FormGroup label="Device Age (Years)">
                                <select name="device_age" value={formData.device_age} onChange={handleInputChange} className={selectClasses}>
                                    <option value="" disabled>Select Age</option>
                                    <option value="<1">Less than 1 year</option>
                                    <option value="1-2">1-2 years</option>
                                    <option value="3-4">3-4 years</option>
                                    <option value="5+">5+ years</option>
                                </select>
                            </FormGroup>
                        </FormRow>

                        <FormGroup label="Battery Issues">
                            <select name="battery_issues" value={formData.battery_issues} onChange={handleInputChange} className={selectClasses}>
                                <option value="None">No issues</option>
                                <option value="Minor">Minor issues (quick discharge)</option>
                                <option value="Major">Major issues (needs replacement)</option>
                            </select>
                        </FormGroup>

                        <FormGroup label="Your Location" required>
                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} required placeholder="City, State" className={inputClasses}/>
                        </FormGroup>
                    </section>
                    <section className="p-6 bg-yellow-50/50 rounded-xl border border-yellow-100 space-y-6">
  <h2 className="text-2xl font-bold text-yellow-800 border-b pb-3 mb-4">📝 Laptop Defects</h2>

  <FormGroup label="Describe Your Laptop Defects (Max 300 words)" required>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleInputChange}
      required
      placeholder="Mention physical condition, performance issues, scratches, keyboard/touchpad condition, etc."
      rows="6"
      maxLength={2000} 
      className={`${inputClasses} resize-none`}
    />
    <span className="text-sm text-gray-500 mt-1">
      {formData.description.split(/\s+/).filter(Boolean).length} / 300 words
    </span>
  </FormGroup>
</section>
                    
                    <section className="p-6 bg-blue-50/50 rounded-xl border border-blue-100 space-y-6">
                        <h2 className="text-2xl font-bold text-blue-800 border-b pb-3 mb-4">📞 Contact Information</h2>
                        
                        <FormRow>
                            <FormGroup label="Full Name" required>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className={inputClasses}/>
                            </FormGroup>
                            
                            <FormGroup label="Email" required>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputClasses}/>
                            </FormGroup>
                        </FormRow>

                        <FormGroup label="Phone Number" required>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className={inputClasses}/>
                        </FormGroup>
                    </section>

                    <section className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">📸 Device Image</h2>

                        <FormGroup label="Upload Device Image" required>
                            <div className="flex flex-col space-y-3">
                                <label htmlFor="device-image" className="custom-upload flex items-center justify-center space-x-2 py-3 px-6 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-[1.01] cursor-pointer">
                                    <span>Upload Photo</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </label>
                                <input 
                                    type="file" 
                                    id="device-image" 
                                    name="device-image" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    required 
                                    className="hidden" 
                                />
                                <span className={`text-sm font-medium ${previewUrl ? 'text-green-600' : 'text-gray-500'}`} id="file-name">
                                    {fileName}
                                </span>
                            </div>

                            {/* Image Preview */}
                            {previewUrl && (
                                <div className="mt-4 border-4 border-dashed border-gray-200 bg-white rounded-xl p-4 max-w-sm shadow-md transition duration-500" id="image-preview">
                                    <img 
                                        id="preview-img" 
                                        src={previewUrl} 
                                        alt="Device Preview" 
                                        className="w-full h-auto max-h-72 object-contain rounded-lg" 
                                    />
                                </div>
                            )}
                        </FormGroup>
                    </section>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="w-full py-4 bg-indigo-600 text-white font-extrabold text-xl rounded-xl shadow-xl hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400 disabled:shadow-none"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing Your Request...' : 'Get Your Quote'}
                        </button>
                    </div>
                </form>
            </div>
            
            <footer className="mt-10 text-center text-gray-400 text-sm">
               
            </footer>
            <Footer />
        </div>
    );
};

export default SellLaptopForm;
