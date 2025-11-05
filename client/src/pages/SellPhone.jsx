import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import axios from 'axios'; // ADD THIS IMPORT

const FormRow = ({ children }) => (
  <div className="flex flex-col gap-4 md:flex-row mb-2">{children}</div>
);

const FormGroup = ({ label, required, children, className = '' }) => (
  <div className={`flex-1 flex flex-col ${className}`}>
    <label className="text-sm font-semibold text-gray-800 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputClasses =
  'w-full p-3 border border-gray-200 rounded-xl shadow-sm bg-gray-50 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out placeholder-gray-400 focus:bg-white';
const selectClasses = `${inputClasses} appearance-none pr-8 bg-white cursor-pointer`;

const SellPhoneForm = () => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    ram: '',
    rom: '',
    processor: '',
    network: '',
    size: '',
    weight: '',
    device_age: '', // Changed to match backend
    battery: '',
    camera: '',
    os: '',
    switching_on: '', // Changed to match backend
    phone_calls: '', // Changed to match backend
    cameras_working: '', // Changed to match backend
    battery_issues: '', // Changed to match backend
    physically_damaged: '', // Changed to match backend
    sound_issues: '', // Changed to match backend
    location: '',
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
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'brand' ? value.toUpperCase() : value,
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    setDeviceImage(file);

    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
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
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    if (deviceImage) {
      formPayload.append('image_path', deviceImage); // Changed to match backend
    }

    try {
      const response = await axios.post('http://localhost:3000/api/phone-applications/submit', formPayload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert('Phone application submitted successfully!');
        // Reset form
        setFormData({
          brand: '',
          model: '',
          ram: '',
          rom: '',
          processor: '',
          network: '',
          size: '',
          weight: '',
          device_age: '',
          battery: '',
          camera: '',
          os: '',
          switching_on: '',
          phone_calls: '',
          cameras_working: '',
          battery_issues: '',
          physically_damaged: '',
          sound_issues: '',
          location: '',
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
      alert(
        error.response?.data?.message ||
          'An error occurred while submitting the form.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <Header />

      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-12 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          📱 Sell Your Phone
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* PHONE DETAILS */}
          <section className="p-6 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-6">
            <h2 className="text-2xl font-bold text-indigo-800 border-b pb-3 mb-4">
              🔧 Phone Details
            </h2>

            <FormRow>
              <FormGroup label="Brand (All Caps)" required>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="SAMSUNG"
                  className={inputClasses}
                  required
                />
              </FormGroup>
              <FormGroup label="Model" required>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Galaxy S22"
                  className={inputClasses}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="RAM" required>
                <select
                  name="ram"
                  value={formData.ram}
                  onChange={handleInputChange}
                  className={selectClasses}
                  required
                >
                  <option value="">Select RAM</option>
                  {[2, 3, 4, 6, 8, 12, 16].map((r) => (
                    <option key={r} value={`${r}GB`}>
                      {r} GB
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label="Storage" required>
                <select
                  name="rom"
                  value={formData.rom}
                  onChange={handleInputChange}
                  className={selectClasses}
                  required
                >
                  <option value="">Select Storage</option>
                  {[16, 32, 64, 128, 256, 512, 1024].map((r) => (
                    <option key={r} value={`${r === 1024 ? '1TB' : r + 'GB'}`}>
                      {r === 1024 ? '1 TB' : `${r} GB`}
                    </option>
                  ))}
                </select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Processor" required>
                <input
                  type="text"
                  name="processor"
                  value={formData.processor}
                  onChange={handleInputChange}
                  placeholder="Snapdragon 8 Gen 1"
                  className={inputClasses}
                  required
                />
              </FormGroup>

              <FormGroup label="Network" required>
                <select
                  name="network"
                  value={formData.network}
                  onChange={handleInputChange}
                  className={selectClasses}
                  required
                >
                  <option value="">Select Network</option>
                  <option value="4G">4G</option>
                  <option value="5G">5G</option>
                </select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Approximate Size (inches)">
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="6.1"
                  className={inputClasses}
                />
              </FormGroup>
              <FormGroup label="Approximate Weight (grams)">
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="167"
                  className={inputClasses}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Device Age" required>
                <select
                  name="device_age"
                  value={formData.device_age}
                  onChange={handleInputChange}
                  className={selectClasses}
                  required
                >
                  <option value="">Select Age</option>
                  <option value="less-than-6-months">Less than 6 months</option>
                  <option value="6-12-months">6–12 months</option>
                  <option value="1-2-years">1–2 years</option>
                  <option value="2-3-years">2–3 years</option>
                  <option value="more-than-3-years">More than 3 years</option>
                </select>
              </FormGroup>
              <FormGroup label="Battery (mAh)" required>
                <input
                  type="number"
                  name="battery"
                  value={formData.battery}
                  onChange={handleInputChange}
                  placeholder="4500"
                  min="1000"
                  max="10000"
                  required
                  className={inputClasses}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup label="Camera Resolution" required>
                <input
                  type="text"
                  name="camera"
                  value={formData.camera}
                  onChange={handleInputChange}
                  placeholder="48MP + 8MP"
                  required
                  className={inputClasses}
                />
              </FormGroup>

              <FormGroup label="Operating System" required>
                <select
                  name="os"
                  value={formData.os}
                  onChange={handleInputChange}
                  required
                  className={selectClasses}
                >
                  <option value="">Select OS</option>
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                  <option value="Other">Other</option>
                </select>
              </FormGroup>
            </FormRow>
          </section>

          {/* DEVICE CONDITION */}
          <section className="p-6 bg-yellow-50/50 rounded-xl border border-yellow-100 space-y-6">
            <h2 className="text-2xl font-bold text-yellow-800 border-b pb-3 mb-4">
              ⚙️ Device Condition
            </h2>

            {[
              ['switching_on', 'Is the device switching on?'],
              ['phone_calls', 'Can make/receive phone calls?'],
              ['cameras_working', 'Are cameras working?'],
              ['battery_issues', 'Any battery issues?'],
              ['physically_damaged', 'Is the device physically damaged?'],
              ['sound_issues', 'Any sound issues?'],
            ].map(([key, label]) => (
              <FormGroup key={key} label={label} required>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={key}
                      value="yes"
                      checked={formData[key] === 'yes'}
                      onChange={handleInputChange}
                      required
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={key}
                      value="no"
                      checked={formData[key] === 'no'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </FormGroup>
            ))}
          </section>

          {/* CONTACT INFO */}
          <section className="p-6 bg-blue-50/50 rounded-xl border border-blue-100 space-y-6">
            <h2 className="text-2xl font-bold text-blue-800 border-b pb-3 mb-4">
              📞 Contact Information
            </h2>

            <FormRow>
              <FormGroup label="Location" required>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="City, State"
                  className={inputClasses}
                />
              </FormGroup>
              <FormGroup label="Email" required>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                  className={inputClasses}
                />
              </FormGroup>
            </FormRow>

            <FormGroup label="Phone Number" required>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="8500515005"
                className={inputClasses}
              />
            </FormGroup>
          </section>

          {/* IMAGE UPLOAD */}
          <section className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
              📸 Device Image
            </h2>

            <FormGroup label="Upload Device Image" required>
              <div className="flex flex-col space-y-3">
                <label
                  htmlFor="device-image"
                  className="flex items-center justify-center space-x-2 py-3 px-6 bg-green-500 text-white font-bold rounded-full shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-[1.01] cursor-pointer"
                >
                  <span>Upload Photo</span>
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
                <span
                  className={`text-sm font-medium ${
                    previewUrl ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {fileName}
                </span>
              </div>

              {previewUrl && (
                <div className="mt-4 border-4 border-dashed border-gray-200 bg-white rounded-xl p-4 max-w-sm shadow-md">
                  <img
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
              {isSubmitting
                ? 'Processing Your Request...'
                : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SellPhoneForm;