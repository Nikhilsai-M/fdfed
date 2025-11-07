import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const adminSignin = async (req, res, next) => {
    const { username, password, securityToken } = req.body;
    
    try {
        console.log('\n=== 🔐 ADMIN SIGNIN REQUEST ===');
        console.log('Admin login attempt for:', username);

        // Validate input
        if (!username || !password || !securityToken) {
            console.log('❌ Missing credentials');
            return next(errorHandler(400, 'Admin ID, password and security token are required'));
        }

        // Find admin by admin_id
        const validAdmin = await Admin.findOne({ admin_id: username });

        if (!validAdmin) {
            console.log('❌ Admin not found');
            return next(errorHandler(404, "Admin not found!"));
        }

        console.log('✅ Admin found:', validAdmin.admin_id);

        // Verify password
        const validPassword = bcrypt.compareSync(password, validAdmin.password);

        if (!validPassword) {
            console.log('❌ Invalid password');
            return next(errorHandler(400, "Invalid credentials!"));
        }

        // Verify security token
        if (validAdmin.security_token !== securityToken) {
            console.log('❌ Invalid security token');
            return next(errorHandler(400, "Invalid security token!"));
        }

        console.log('✅ Password and security token verified');

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: validAdmin._id,
                admin_id: validAdmin.admin_id,
                name: validAdmin.name,
                role: 'admin'
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        console.log('✅ Admin JWT token generated');

        // Remove password from response
        const { password: pass, ...rest } = validAdmin._doc;

        // Send response with cookie
        res.cookie('admin_access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }).status(200).json({
            success: true,
            admin: rest,
            token
        });

        console.log('✅ Admin login successful');
        console.log('=== ADMIN SIGNIN END ===\n');

    } catch(error) {
        console.error('❌ Admin signin error:', error);
        next(errorHandler(500, 'Error during admin signin: ' + error.message));
    }
}

export const adminSignout = async (req, res, next) => {
    try {
        console.log('\n=== 🚪 ADMIN SIGNOUT REQUEST ===');

        res.clearCookie('admin_access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        console.log('✅ Admin signed out successfully');
        console.log('=== ADMIN SIGNOUT END ===\n');

        res.status(200).json({
            success: true,
            message: 'Admin signed out successfully'
        });
    } catch (error) {
        console.error('❌ Admin signout error:', error);
        next(errorHandler(500, 'Error during admin signout'));
    }
}