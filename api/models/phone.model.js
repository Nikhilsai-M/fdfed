import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  color: { type: String },
  image: { type: String, required: true },
  processor: { type: String, required: true },
  display: { type: String, required: true },
  battery: { type: Number, required: true },
  camera: { type: String, required: true },
  os: { type: String, required: true },
  network: { type: String, required: true },
  weight: { type: String, required: true },
  ram: { type: String, required: true },
  rom: { type: String, required: true },
  base_price: { type: Number, required: true },
  discount: { type: Number },
  condition: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

phoneSchema.index({ brand: "text", model: "text", color: "text", processor: "text", os: "text" });

const Phone = mongoose.model("Phone", phoneSchema);
export default Phone;