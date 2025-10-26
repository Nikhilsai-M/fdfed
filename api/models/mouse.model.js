const mouseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  original_price: { type: Number, required: true },
  discount: { type: String, required: true },
  type: { type: String, required: true },
  connectivity: { type: String, required: true },
  resolution: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});
const Mouse = mongoose.model("Mouse", mouseSchema);

export default Mouse; 