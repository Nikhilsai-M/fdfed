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

earphoneSchema.index({ sellerId: 1, isActive: 1, created_at: -1 });
earphoneSchema.index({ isActive: 1, created_at: -1 });

earphoneSchema.index({ title: "text", brand: "text", design: "text" });

const Earphone = mongoose.model("Earphone", earphoneSchema);

export default Earphone;
