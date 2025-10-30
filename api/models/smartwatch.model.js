import mongoose from "mongoose";

const smartwatchSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, required: true },
 displaySize: { type: String, required: true },
displayType: { type: String, required: true },
 batteryRuntime: { type: String, required: true },
created_at: { type: Date, default: Date.now },
});

const Smartwatch = mongoose.model("Smartwatch", smartwatchSchema);

export default Smartwatch;
