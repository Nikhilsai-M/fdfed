import mongoose from "mongoose";
const chargerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  wattage: { type: String, required: true },
  type: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, required: true },
  outputCurrent: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});
const Charger = mongoose.model("Charger", chargerSchema);

export default Charger;