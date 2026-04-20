
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { getPhoneApplicationsByUserId, getLaptopApplicationsByUserId } from "../crud/applications.js";
import PhoneApplication from "../models/phoneApplication.model.js";
import LaptopApplication from "../models/laptopApplication.model.js";
import Notification from "../models/notification.model.js"; 
import { v4 as uuidv4 } from 'uuid';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{10,15}$/;

function isNonEmptyText(value, minLength = 1) {
    return typeof value === "string" && value.trim().length >= minLength;
}

function isCompleteAddress(address) {
    return Boolean(
        address &&
        isNonEmptyText(address.street) &&
        isNonEmptyText(address.city) &&
        isNonEmptyText(address.state) &&
        isNonEmptyText(address.postal_code) &&
        isNonEmptyText(address.country)
    );
}

// Get customer profile
export const getCustomerProfile = async (req, res, next) => {
    try {
        const user = await User.findOne({ user_id: req.user.user_id }).select('-password');
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                username: user.username,
                address: user.address,
                orders_count: user.orders_count,
                items_sold_count: user.items_sold_count,
                password_last_changed: user.password_last_changed,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        next(errorHandler(500, 'Error fetching profile: ' + error.message));
    }
}

// Update customer profile
export const updateCustomerProfile = async (req, res, next) => {
    try {
        const { first_name, last_name, email, phone, address } = req.body;
        const userId = req.user.user_id;

        if (!isNonEmptyText(first_name, 2)) {
            return next(errorHandler(400, 'First name must be at least 2 characters'));
        }

        if (!isNonEmptyText(last_name, 2)) {
            return next(errorHandler(400, 'Last name must be at least 2 characters'));
        }

        if (!EMAIL_REGEX.test(String(email || "").trim())) {
            return next(errorHandler(400, 'Please enter a valid email address'));
        }

        if (!PHONE_REGEX.test(String(phone || "").trim())) {
            return next(errorHandler(400, 'Please enter a valid phone number'));
        }

        if (!isCompleteAddress(address)) {
            return next(errorHandler(400, 'Complete address is required'));
        }

        // Check if email already exists for another user
        const emailCheck = await User.findOne({ email, user_id: { $ne: userId } });
        if (emailCheck) {
            return next(errorHandler(400, 'Email already in use by another user'));
        }
        
        await User.updateOne(
            { user_id: userId },
            {
                $set: {
                    first_name,
                    last_name,
                    email,
                    phone,
                    'address.street': address.street,
                    'address.city': address.city,
                    'address.state': address.state,
                    'address.postal_code': address.postal_code,
                    'address.country': address.country,
                },
            }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error('Error updating customer:', error);
        next(errorHandler(500, 'Error updating profile: ' + error.message));
    }
}

// Update customer password
export const updateCustomerPassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.user_id;

        const user = await User.findOne({ user_id: userId });
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return next(errorHandler(400, 'Current password is incorrect'));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await User.updateOne(
            { user_id: userId },
            { $set: { password: hashedPassword, password_last_changed: new Date() } }
        );

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Error updating customer password:', error);
        next(errorHandler(500, 'Error updating password'));
    }
}

// Get customer listings (phones and laptops)
export const getCustomerListings = async (req, res, next) => {
  try {
    console.log('\n=== 📋 GET CUSTOMER LISTINGS START ===');
    console.log('👤 User from token:', req.user);
    
    const userId = req.user?.user_id;
    
    if (!userId) {
      console.error('❌ User ID not found in token');
      return next(errorHandler(401, 'User ID not found in token'));
    }

    console.log('🔍 Fetching listings for user_id:', userId);

    // Fetch both laptop and phone applications in parallel
    const [laptopApplications, phoneApplications] = await Promise.all([
      getLaptopApplicationsByUserId(userId),
      getPhoneApplicationsByUserId(userId)
    ]);

    console.log('💻 Laptop applications found:', laptopApplications.length);
    console.log('📱 Phone applications found:', phoneApplications.length);

    // Combine and add type field
    const listings = [
      ...laptopApplications.map(app => {
        const plainApp = app.toObject ? app.toObject() : app;
        return {
          ...plainApp,
          type: 'laptop',
          _id: plainApp._id.toString()
        };
      }),
      ...phoneApplications.map(app => {
        const plainApp = app.toObject ? app.toObject() : app;
        return {
          ...plainApp,
          type: 'phone',
          _id: plainApp._id.toString()
        };
      })
    ];

    // Sort by creation date (newest first)
    listings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    console.log('✅ Total listings returned:', listings.length);
    console.log('=== GET CUSTOMER LISTINGS END ===\n');
    
    res.status(200).json({ 
      success: true, 
      listings,
      count: listings.length
    });
  } catch (error) {
    console.error('❌ Error fetching customer listings:', error);
    next(errorHandler(500, 'Error fetching listings: ' + error.message));
  }
};


const syncNotificationsFromApplications = async (userId) => {
    try {
        console.log(`🔄 Syncing notifications for user ${userId}`);
        
        // Get all applications
        const [phoneApps, laptopApps] = await Promise.all([
            PhoneApplication.find({ user_id: userId }),
            LaptopApplication.find({ user_id: userId })
        ]);

        const allApps = [
            ...phoneApps.map(app => ({ ...app.toObject(), type: 'phone' })),
            ...laptopApps.map(app => ({ ...app.toObject(), type: 'laptop' }))
        ];

        // Create/update notifications for each application
        for (const app of allApps) {
            const notificationData = {
                notification_id: uuidv4(),
                user_id: userId,
                application_id: app._id.toString(),
                application_type: app.type,
                type: 'listing_update',
                title: `${app.brand} ${app.model} Status Update`,
                message: `Your ${app.brand} ${app.model} ${app.type} listing status has been updated to ${app.status}`,
                status: app.status,
                price: app.price || 0,
                rejection_reason: app.rejection_reason || '',
                device_data: {
                    brand: app.brand,
                    model: app.model,
                    storage: app.storage,
                    ram: app.ram
                },
                created_at: app.updated_at || app.created_at || new Date()
            };

            // Upsert notification
            await Notification.findOneAndUpdate(
                {
                    user_id: userId,
                    application_id: app._id.toString(),
                    application_type: app.type
                },
                notificationData,
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );
        }

        console.log(`✅ Synced ${allApps.length} applications to notifications`);
    } catch (error) {
        console.error('❌ Error syncing notifications:', error);
    }
};

// Format time ago helper function
const formatTimeAgo = (date) => {
    if (!date) return 'just now';
    
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
};

// Get notifications
export const getNotifications = async (req, res, next) => {
    try {
        console.log('\n=== 🔔 GET NOTIFICATIONS START ===');
        const userId = req.user.user_id;
        console.log('👤 User ID:', userId);

        // First sync notifications from applications
        await syncNotificationsFromApplications(userId);

        // Get non-archived notifications
        const notifications = await Notification.find({
            user_id: userId,
            archived: false
        }).sort({ created_at: -1 });

        console.log(`📊 Found ${notifications.length} notifications`);

        // Format for frontend
        const formattedNotifications = notifications.map(notif => ({
            id: notif.notification_id || notif._id.toString(),
            type: notif.type,
            device_type: notif.application_type,
            brand: notif.device_data?.brand || 'Unknown',
            model: notif.device_data?.model || 'Unknown',
            status: notif.status,
            price: notif.price || 0,
            rejection_reason: notif.rejection_reason || '',
            storage: notif.device_data?.storage,
            ram: notif.device_data?.ram,
            created_at: notif.created_at,
               title: notif.title,
                message: notif.message,
            updated_at: notif.updated_at || notif.created_at,
            read: notif.read,
            time: formatTimeAgo(notif.updated_at || notif.created_at),
            date: new Date(notif.created_at).toLocaleDateString(),
            _id: notif._id.toString()
        }));

        const unreadCount = formattedNotifications.filter(n => !n.read).length;

        console.log(`✅ Returning ${formattedNotifications.length} notifications, ${unreadCount} unread`);
        console.log('=== GET NOTIFICATIONS END ===\n');
        
        res.status(200).json({
            success: true,
            notifications: formattedNotifications,
            unreadCount: unreadCount,
            totalCount: formattedNotifications.length
        });
        
    } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        next(errorHandler(500, 'Error fetching notifications: ' + error.message));
    }
};

// Mark a single notification as read
export const markNotificationAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.user_id;

        console.log(`\n=== 📝 MARK NOTIFICATION AS READ START ===`);
        console.log(`Notification ID: ${id}, User ID: ${userId}`);

        // Find the notification by notification_id or _id
        const notification = await Notification.findOne({
            $or: [
                { notification_id: id },
                { _id: id }
            ],
            user_id: userId
        });

        if (!notification) {
            return next(errorHandler(404, 'Notification not found'));
        }

        // Update the notification as read
        await Notification.updateOne(
            { _id: notification._id },
            { 
                $set: { 
                    read: true, 
                    updated_at: new Date() 
                } 
            }
        );

        console.log(`✅ Notification marked as read: ${notification._id}`);
        console.log('=== MARK NOTIFICATION AS READ END ===\n');
        
        res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
        
    } catch (error) {
        console.error('❌ Error marking notification as read:', error);
        next(errorHandler(500, 'Error marking notification as read: ' + error.message));
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        console.log(`\n=== 📝 MARK ALL NOTIFICATIONS AS READ START ===`);
        console.log(`User ID: ${userId}`);

        // Update all non-archived notifications for this user
        const result = await Notification.updateMany(
            { 
                user_id: userId, 
                read: false,
                archived: false 
            },
            { 
                $set: { 
                    read: true, 
                    updated_at: new Date() 
                } 
            }
        );

        console.log(`✅ Marked ${result.modifiedCount} notifications as read`);
        console.log('=== MARK ALL NOTIFICATIONS AS READ END ===\n');
        
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            updatedCount: result.modifiedCount
        });
        
    } catch (error) {
        console.error('❌ Error marking all notifications as read:', error);
        next(errorHandler(500, 'Error marking all notifications as read: ' + error.message));
    }
};

// Delete a notification (archive it)
export const deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.user_id;

        console.log(`\n=== 🗑️ DELETE NOTIFICATION START ===`);
        console.log(`Notification ID: ${id}, User ID: ${userId}`);

        // Try to find by notification_id first, then by _id
        let notification = await Notification.findOne({
            notification_id: id,
            user_id: userId
        });

        // If not found by notification_id, try by _id
        if (!notification) {
            try {
                notification = await Notification.findOne({
                    _id: id,
                    user_id: userId
                });
            } catch (err) {
                // If _id is invalid format, it will throw error
                console.log('Invalid _id format, trying as string...');
            }
        }

        // If still not found, try as string _id
        if (!notification) {
            notification = await Notification.findOne({
                _id: { $eq: id },
                user_id: userId
            });
        }

        if (!notification) {
            console.log(`❌ Notification not found for ID: ${id}`);
            return next(errorHandler(404, 'Notification not found'));
        }

        console.log(`🔍 Found notification:`, {
            _id: notification._id,
            notification_id: notification.notification_id,
            archived: notification.archived
        });

        // Archive the notification (soft delete)
        const result = await Notification.updateOne(
            { _id: notification._id },
            { 
                $set: { 
                    archived: true, 
                    read: true, 
                    updated_at: new Date() 
                } 
            }
        );

        console.log(`✅ Notification archived: ${notification._id}, Modified count: ${result.modifiedCount}`);
        console.log('=== DELETE NOTIFICATION END ===\n');
        
        res.status(200).json({
            success: true,
            message: 'Notification removed',
            notificationId: id
        });
        
    } catch (error) {
        console.error('❌ Error deleting notification:', error);
        next(errorHandler(500, 'Error deleting notification: ' + error.message));
    }
};
        

// Clear all notifications (archive all)
export const clearAllNotifications = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        console.log(`\n=== 🗑️ CLEAR ALL NOTIFICATIONS START ===`);
        console.log(`User ID: ${userId}`);

        // Archive all notifications for this user
        const result = await Notification.updateMany(
            { 
                user_id: userId, 
                archived: false 
            },
            { 
                $set: { 
                    archived: true, 
                    read: true, 
                    updated_at: new Date() 
                } 
            }
        );

        console.log(`✅ Archived ${result.modifiedCount} notifications`);
        console.log('=== CLEAR ALL NOTIFICATIONS END ===\n');
        
        res.status(200).json({
            success: true,
            message: 'All notifications cleared',
            clearedCount: result.modifiedCount
        });
        
    } catch (error) {
        console.error('❌ Error clearing all notifications:', error);
        next(errorHandler(500, 'Error clearing all notifications: ' + error.message));
    }
};

// If you need dummy data for testing, use this version:
export const getNotificationsDummy = async (req, res, next) => {
    try {
        console.log('\n=== 🔔 GET DUMMY NOTIFICATIONS START ===');
        
        const dummyNotifications = [
            {
                id: 'phone_123',
                type: 'listing',
                device_type: 'phone',
                brand: 'iPhone',
                model: '13 Pro',
                status: 'approved',
                price: 45000,
                time: '2 hours ago',
                date: 'Today',
                read: false,
                storage: '256GB',
                ram: '6GB'
            },
            {
                id: 'laptop_456',
                type: 'listing',
                device_type: 'laptop',
                brand: 'Dell',
                model: 'XPS 13',
                status: 'rejected',
                rejection_reason: 'Device age exceeds our acceptance criteria',
                time: '1 day ago',
                date: 'Yesterday',
                read: false,
                storage: '512GB SSD',
                ram: '16GB'
            },
            {
                id: 'phone_789',
                type: 'listing',
                device_type: 'phone',
                brand: 'Samsung',
                model: 'Galaxy S23',
                status: 'processing',
                time: '3 days ago',
                date: 'Mar 12',
                read: true,
                storage: '128GB',
                ram: '8GB'
            },
            {
                id: 'laptop_101',
                type: 'listing',
                device_type: 'laptop',
                brand: 'MacBook',
                model: 'Air M2',
                status: 'approved',
                price: 62000,
                time: '1 week ago',
                date: 'Mar 8',
                read: true,
                storage: '256GB SSD',
                ram: '8GB'
            },
            {
                id: 'phone_202',
                type: 'listing',
                device_type: 'phone',
                brand: 'OnePlus',
                model: '11R',
                status: 'pending',
                time: '2 weeks ago',
                date: 'Mar 1',
                read: true,
                storage: '256GB',
                ram: '16GB'
            }
        ];
        
        const unreadCount = dummyNotifications.filter(n => !n.read).length;
        
        console.log(`✅ Returning ${dummyNotifications.length} dummy notifications, ${unreadCount} unread`);
        console.log('=== GET DUMMY NOTIFICATIONS END ===\n');
        
        res.status(200).json({
            success: true,
            notifications: dummyNotifications,
            unreadCount: unreadCount,
            totalCount: dummyNotifications.length,
            message: 'Using dummy data for testing'
        });
        
    } catch (error) {
        console.error('❌ Error fetching dummy notifications:', error);
        next(errorHandler(500, 'Error fetching notifications: ' + error.message));
    }
};
