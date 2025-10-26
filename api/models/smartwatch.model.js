const smartwatchSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  original_price: { type: Number, required: true },
  discount: { type: String, required: true },
  display_size: { type: String, required: true },
  display_type: { type: String, required: true },
  battery_runtime: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});
const Smartwatch = mongoose.model("Smartwatch", smartwatchSchema);

export default Smartwatch;