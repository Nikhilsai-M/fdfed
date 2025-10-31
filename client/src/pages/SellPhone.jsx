import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function SellPhoneForm() {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    ram: '',
    rom: '',
    processor: '',
    network: '',
    size: '',
    weight: '',
    deviceAge: '',
    battery: '',
    camera: '',
    os: '',
    switchingOn: '',
    phoneCalls: '',
    camerasWorking: '',
    batteryIssues: '',
    physicallyDamaged: '',
    soundIssues: '',
    location: '',
    email: '',
    phone: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
      case 'phone':
        return /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits';
      case 'battery':
        return value >= 1000 && value <= 10000 ? '' : 'Battery must be between 1000-10000 mAh';
      case 'size':
        return !value || /^\d+(\.\d+)?$/.test(value) ? '' : 'Invalid size format';
      case 'weight':
        return !value || /^\d+$/.test(value) ? '' : 'Weight must be a number';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const processedValue = name === 'brand' ? value.toUpperCase() : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      setImageFile(file);
      setFileName(file.name);
      setErrors(prev => ({ ...prev, image: '' }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setFileName('No file chosen');
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['model', 'ram', 'rom', 'processor', 'network', 'deviceAge', 
                           'battery', 'camera', 'os', 'location', 'email', 'phone',
                           'switchingOn', 'phoneCalls', 'camerasWorking', 'batteryIssues',
                           'physicallyDamaged', 'soundIssues'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      } else {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    if (!imageFile) {
      newErrors.image = 'Please upload a device image';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (imageFile) {
      formDataToSend.append('device-image', imageFile);
    }

    try {
      const response = await fetch('/api/sell-phone', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (response.ok) {
        // Success - show success message and reset form
        alert('✅ Application submitted successfully! We will contact you soon.');
        
        // Reset form
        setFormData({
          brand: '', model: '', ram: '', rom: '', processor: '', network: '',
          size: '', weight: '', deviceAge: '', battery: '', camera: '', os: '',
          switchingOn: '', phoneCalls: '', camerasWorking: '', batteryIssues: '',
          physicallyDamaged: '', soundIssues: '', location: '', email: '', phone: ''
        });
        setImageFile(null);
        setImagePreview(null);
        setFileName('No file chosen');
        setErrors({});
        setTouchedFields({});
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorData = await response.json();
        alert('❌ Submission failed: ' + (errorData.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ An error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component for input fields
  const InputField = ({ label, name, required, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        onBlur={handleBlur}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
          errors[name] && touchedFields[name] ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {errors[name] && touchedFields[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  // Helper component for select fields
  const SelectField = ({ label, name, options, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        onBlur={handleBlur}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
          errors[name] && touchedFields[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {errors[name] && touchedFields[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  // Helper component for radio fields
  const RadioField = ({ label, name, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={name}
            value="yes"
            checked={formData[name] === 'yes'}
            onChange={handleInputChange}
            required={required}
            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-gray-700 group-hover:text-indigo-600 transition">Yes</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name={name}
            value="no"
            checked={formData[name] === 'no'}
            onChange={handleInputChange}
            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-gray-700 group-hover:text-indigo-600 transition">No</span>
        </label>
      </div>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">1</span>
              Phone Info
            </span>
            <span className="w-12 h-1 bg-gray-300"></span>
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">2</span>
              Condition
            </span>
            <span className="w-12 h-1 bg-gray-300"></span>
            <span className="flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">3</span>
              Contact
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Sell Your Phone
            </h1>
            <p className="text-gray-600">Get the best price for your device in minutes</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Phone Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Phone Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Brand"
                  name="brand"
                  placeholder="SAMSUNG"
                />
                <InputField
                  label="Model"
                  name="model"
                  placeholder="Galaxy S22"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="RAM"
                  name="ram"
                  required
                  options={[
                    { value: '', label: 'Select RAM' },
                    { value: '2', label: '2 GB' },
                    { value: '3', label: '3 GB' },
                    { value: '4', label: '4 GB' },
                    { value: '6', label: '6 GB' },
                    { value: '8', label: '8 GB' },
                    { value: '12', label: '12 GB' },
                    { value: '16', label: '16 GB' }
                  ]}
                />
                <SelectField
                  label="Storage"
                  name="rom"
                  required
                  options={[
                    { value: '', label: 'Select Storage' },
                    { value: '16', label: '16 GB' },
                    { value: '32', label: '32 GB' },
                    { value: '64', label: '64 GB' },
                    { value: '128', label: '128 GB' },
                    { value: '256', label: '256 GB' },
                    { value: '512', label: '512 GB' },
                    { value: '1024', label: '1 TB' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Processor"
                  name="processor"
                  placeholder="Snapdragon 8 Gen 1"
                  required
                />
                <SelectField
                  label="Network"
                  name="network"
                  required
                  options={[
                    { value: '', label: 'Select Network' },
                    { value: '4G', label: '4G' },
                    { value: '5G', label: '5G' }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Approximate Size (inches)"
                  name="size"
                  type="text"
                  placeholder="6.1"
                />
                <InputField
                  label="Approximate Weight (grams)"
                  name="weight"
                  type="text"
                  placeholder="167"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Device Age"
                  name="deviceAge"
                  required
                  options={[
                    { value: '', label: 'Select Age' },
                    { value: 'less-than-6-months', label: 'Less than 6 months' },
                    { value: '6-12-months', label: '6-12 months' },
                    { value: '1-2-years', label: '1-2 years' },
                    { value: '2-3-years', label: '2-3 years' },
                    { value: 'more-than-3-years', label: 'More than 3 years' }
                  ]}
                />
                <InputField
                  label="Battery (mAh)"
                  name="battery"
                  type="number"
                  placeholder="4500"
                  min="1000"
                  max="10000"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Camera Resolution"
                  name="camera"
                  placeholder="48MP + 8MP"
                  required
                />
                <SelectField
                  label="Operating System"
                  name="os"
                  required
                  options={[
                    { value: '', label: 'Select OS' },
                    { value: 'Android', label: 'Android' },
                    { value: 'iOS', label: 'iOS' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
              </div>
            </section>

            <div className="border-t border-gray-200"></div>

            {/* Device Condition */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Device Condition</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RadioField label="Is the device switching on?" name="switchingOn" required />
                <RadioField label="Can make/receive phone calls?" name="phoneCalls" required />
                <RadioField label="Are cameras working?" name="camerasWorking" required />
                <RadioField label="Any battery issues?" name="batteryIssues" required />
                <RadioField label="Is the device physically damaged?" name="physicallyDamaged" required />
                <RadioField label="Any sound issues?" name="soundIssues" required />
              </div>
            </section>

            <div className="border-t border-gray-200"></div>

            {/* Contact Information */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📧</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Location"
                  name="location"
                  placeholder="City, State"
                  required
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="8500515005"
                  required
                />
              </div>
            </section>

            <div className="border-t border-gray-200"></div>

            {/* Device Image */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Device Image</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Device Image <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-3">
                  <label className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full md:w-auto">
                    <span className="mr-2">⬆️</span>
                    Choose File
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{fileName}</span>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFileName('No file chosen');
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Maximum file size: 5MB</p>
                </div>
                
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
                
                {imagePreview && (
                  <div className="mt-6 border-2 border-indigo-200 rounded-xl p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Device Preview"
                      className="max-w-full h-auto max-h-96 mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  '🚀 Submit Application'
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                By submitting, you agree to our terms and conditions
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}