import mongoose from "mongoose";

const laptopApplicationSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  user_id: { type: String },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  ram: { type: String, required: true },
  storage: { type: String, required: true },
  processor: { type: String, required: true },
  generation: { type: String },
  display_size: { type: String },
  weight: { type: String },
  os: { type: String },
  device_age: { type: String },
  battery_issues: { type: String },
  location: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  image_path: { type: String },
  cloudinary_public_id: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  assigned_supervisor_id: { type: String, default: null },
  assigned_at: { type: Date, default: null },
  rejection_reason: { type: String },
  price: { type: Number },
  created_at: { type: Date, default: Date.now },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000 
  },
});

const LaptopApplication = mongoose.model("LaptopApplication", laptopApplicationSchema);
export default LaptopApplication;
