import mongoose from "mongoose";

const earphoneSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  
  originalPrice: { type: Number, required: true },
  discount: { type: Number, required: true },
  design: { type: String, required: true },
 
  batteryLife: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Earphone = mongoose.model("Earphone", earphoneSchema);

export default Earphone;
