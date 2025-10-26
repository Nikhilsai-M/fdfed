import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postal_code: { type: String, required: true },
        country: { type: String, required: true }
    },
    orders_count: {
        type: Number,
        default: 0
    },
    items_sold_count: {
        type: Number,
        default: 0
    },
    password_last_changed: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema); 

export default User;