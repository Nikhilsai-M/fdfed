import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  brand: { type: String, required: true },
  series: { type: String, required: true },
  processor_name: { type: String, required: true },
  processor_generation: { type: String, default: '' }, 
  base_price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  ram: { type: String, required: true },
  storage_type: { type: String, required: true },
  storage_capacity: { type: String, required: true },
  display_size: { type: Number, required: true },
  weight: { type: Number, required: true },
  condition: { type: String, required: true },
  os: { type: String, required: true },
  image: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  
});

laptopSchema.index({ brand: "text", series: "text", processor_name: "text", os: "text" });

const Laptop = mongoose.model("Laptop", laptopSchema);
export default Laptop;