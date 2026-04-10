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

  sellerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Seller",
  required: true
},

stock: {
  type: Number,
  default: 0
},

isActive: {
  type: Boolean,
  default: true
},
  created_at: { type: Date, default: Date.now },
});
chargerSchema.index({ sellerId: 1, isActive: 1, created_at: -1 });

chargerSchema.index({ title: "text", brand: "text", type: "text", wattage: "text" });

const Charger = mongoose.model("Charger", chargerSchema);

export default Charger;