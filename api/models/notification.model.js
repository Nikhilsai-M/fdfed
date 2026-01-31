
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    notification_id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true
    },
    application_id: {
        type: String,
        required: true
    },
    application_type: {
        type: String,
        required: true,
        enum: ['phone', 'laptop']
    },
    type: {
        type: String,
        default: 'listing_update'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'approved', 'rejected']
    },
    price: {
        type: Number,
        default: 0
    },
    rejection_reason: {
        type: String,
        default: ''
    },
    device_data: {
        brand: String,
        model: String,
        storage: String,
        ram: String
    },
    read: {
        type: Boolean,
        default: false
    },
    archived: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false
});

// Create index for faster queries
notificationSchema.index({ user_id: 1, archived: 1, read: 1 });
notificationSchema.index({ user_id: 1, application_id: 1, application_type: 1 }, { unique: true });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
