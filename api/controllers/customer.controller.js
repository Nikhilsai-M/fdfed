import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

import { getPhoneApplicationsByUserId, getLaptopApplicationsByUserId } from "../crud/applications.js";

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

export const getCustomerListings = async (req, res, next) => {
  try {
    console.log('User from token:', req.user); // Debug log
    
    // Use req.user.user_id from JWT token, not session
    const userId = req.user.user_id;
    if (!userId) {
      return next(errorHandler(401, 'User ID not found in token'));
    }

    console.log('Fetching listings for user:', userId); // Debug log

    const laptopApplications = await getLaptopApplicationsByUserId(userId);
    const phoneApplications = await getPhoneApplicationsByUserId(userId);
    const listings = [
      ...laptopApplications.map(app => ({ ...app, type: 'laptop' })),
      ...phoneApplications.map(app => ({ ...app, type: 'phone' })),
    ];

    console.log(`Found ${listings.length} listings total`); // Debug log
    
    res.json({ success: true, listings });
  } catch (error) {
    console.error('Error fetching customer listings:', error);
    next(errorHandler(500, 'Error fetching listings: ' + error.message));
  }
};
