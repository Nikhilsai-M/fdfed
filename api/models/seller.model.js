import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  storeName: {
    type: String,
    required: true,
  },

  businessAddress: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "seller",
  }
},
{ timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema);

export const create = (data) => Seller.create(data);
export const findOne = (query) => Seller.findOne(query);