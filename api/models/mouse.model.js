import mongoose from "mongoose";

const mouseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },

  title: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },

  originalPrice: { type: Number, required: true },
  discount: { type: Number, required: true },

  type: { type: String, required: true },
  connectivity: { type: String, required: true },
  resolution: { type: String, required: true },

  // NEW FIELDS
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

mouseSchema.index({ sellerId: 1, isActive: 1, created_at: -1 });

mouseSchema.index({ title: "text", brand: "text", type: "text", connectivity: "text" });

const Mouse = mongoose.model("Mouse", mouseSchema);

export default Mouse;