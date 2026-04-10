import mongoose from "mongoose";

const phoneApplicationSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  user_id: { type: String },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  ram: { type: String, required: true },
  rom: { type: String, required: true },
  processor: { type: String, required: true },
  network: { type: String, required: true },
  size: { type: String },
  weight: { type: String },
  device_age: { type: String, required: true },
  battery: { type: String, required: true },
  camera: { type: String, required: true },
  os: { type: String, required: true },
  switching_on: { type: String, required: true },
  phone_calls: { type: String, required: true },
  cameras_working: { type: String, required: true },
  battery_issues: { type: String, required: true },
  physically_damaged: { type: String, required: true },
  sound_issues: { type: String, required: true },
  location: { type: String, required: true },
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
});

phoneApplicationSchema.index({ user_id: 1, created_at: -1 });
phoneApplicationSchema.index({ status: 1, created_at: -1 });
phoneApplicationSchema.index({ assigned_supervisor_id: 1, status: 1, created_at: -1 });
phoneApplicationSchema.index({ status: 1, assigned_supervisor_id: 1, id: 1 });

const PhoneApplication = mongoose.model("PhoneApplication", phoneApplicationSchema);
export default PhoneApplication;
