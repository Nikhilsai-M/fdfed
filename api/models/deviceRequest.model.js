import mongoose from "mongoose";

const deviceRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: String, // UUID from auth
      required: true,
      index: true,
    },

    device_type: {
      type: String,
      required: true,
      enum: [
        "phone",
        "laptop",
        "charger",
        "earphone",
        "smartwatch",
        "mouse",
      ],
    },

    // Flexible criteria (minimal fields only)
    criteria: {
      type: Object,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    fulfilled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

deviceRequestSchema.index({ user_id: 1, device_type: 1, active: 1 });

const DeviceRequest = mongoose.model("DeviceRequest", deviceRequestSchema);
export default DeviceRequest;
