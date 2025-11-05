import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid'; // Install: npm install uuid

export const signup = async(req, res, next) => {
    const { username, firstName, lastName, email, phone, address, password } = req.body;
    
    try {
        console.log('\n=== 📝 SIGNUP REQUEST ===');
        console.log('Username:', username);
        console.log('Email:', email);

        // Check if user already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            console.log('❌ Email already registered');
            return next(errorHandler(400, 'Email already registered'));
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            console.log('❌ Username already taken');
            return next(errorHandler(400, 'Username already taken'));
        }

        // Validate required fields
        if (!username || !firstName || !lastName || !email || !phone || !password) {
            console.log('❌ Missing required fields');
            return next(errorHandler(400, 'All fields are required'));
        }

        if (!address || !address.street || !address.city || !address.state || !address.postal_code || !address.country) {
            console.log('❌ Incomplete address');
            return next(errorHandler(400, 'Complete address is required'));
        }

        // Generate user_id as UUID (matching your database format)
        const userId = uuidv4(); // e.g., "fed4805a-f728-41bb-82d3-64216642cde3"
        console.log('✅ Generated user_id:', userId);
        
        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        // Create new user
        const newUser = new User({
            user_id: userId,
            username,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            address: {
                street: address.street,
                city: address.city,
                state: address.state,
                postal_code: address.postal_code,
                country: address.country
            },
            password: hashedPassword,
            orders_count: 0,
            items_sold_count: 0,
            password_last_changed: new Date(),
            created_at: new Date()
        });

        await newUser.save();
        console.log('✅ User created successfully');
        console.log('=== SIGNUP END ===\n');
        
        res.status(201).json({ 
            success: true,
            message: "User created successfully",
            userId: userId
        });
    } catch (error) {
        console.error('❌ Signup error:', error);
        
        if (error.name === 'ValidationError') {
            const errorMessages = [];
            for (const field in error.errors) {
                errorMessages.push(error.errors[field].message);
            }
            return next(errorHandler(400, errorMessages.join(', ')));
        }
        
        next(errorHandler(500, 'Error creating user: ' + error.message));
    }
}

export const signin = async (req, res, next) => {
    const { username, password } = req.body;
    
    try {
        console.log('\n=== 🔐 SIGNIN REQUEST ===');
        console.log('Login attempt for:', username);

        // Validate input
        if (!username || !password) {
            console.log('❌ Missing credentials');
            return next(errorHandler(400, 'Username and password are required'));
        }

        // Find user by username or email
        const validUser = await User.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!validUser) {
            console.log('❌ User not found');
            return next(errorHandler(404, "User not found!"));
        }

        console.log('✅ User found:', validUser.user_id);

        // Verify password
        const validPassword = bcrypt.compareSync(password, validUser.password);

        if (!validPassword) {
            console.log('❌ Invalid password');
            return next(errorHandler(400, "Invalid credentials!"));
        }

        console.log('✅ Password verified');

        // Generate JWT token with user_id (UUID format)
        const token = jwt.sign(
            { 
                id: validUser._id,           // MongoDB ObjectId
                user_id: validUser.user_id,  // UUID from your database
                email: validUser.email,
                username: validUser.username,
                role: 'customer'
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        console.log('✅ JWT token generated');
        console.log('   Token payload:', {
            user_id: validUser.user_id,
            email: validUser.email
        });

        // Remove password from response
        const { password: pass, ...rest } = validUser._doc;

        // Send response with cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }).status(200).json({
            success: true,
            user: rest,
            token // Also send in response body for debugging
        });

        console.log('✅ Login successful');
        console.log('=== SIGNIN END ===\n');

    } catch(error) {
        console.error('❌ Signin error:', error);
        next(errorHandler(500, 'Error during signin: ' + error.message));
    }
}

// Additional function to get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        console.log('\n=== 👤 GET USER PROFILE ===');
        console.log('Requesting profile for user_id:', req.user.user_id);

        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            console.log('❌ User not found');
            return next(errorHandler(404, "User not found"));
        }

        console.log('✅ Profile fetched successfully');
        console.log('=== GET PROFILE END ===\n');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('❌ Get profile error:', error);
        next(errorHandler(500, 'Error fetching profile: ' + error.message));
    }
}

// Function to update user profile
export const updateUserProfile = async (req, res, next) => {
    try {
        console.log('\n=== 📝 UPDATE USER PROFILE ===');
        console.log('Updating profile for user_id:', req.user.user_id);

        const { firstName, lastName, phone, address } = req.body;
        
        const updateData = {};
        if (firstName) updateData.first_name = firstName;
        if (lastName) updateData.last_name = lastName;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        console.log('✅ Profile updated successfully');
        console.log('=== UPDATE PROFILE END ===\n');

        res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error('❌ Update profile error:', error);
        next(errorHandler(500, 'Error updating profile: ' + error.message));
    }
}

// Logout function
export const signout = async (req, res, next) => {
    try {
        console.log('\n=== 🚪 SIGNOUT REQUEST ===');
        console.log('User signing out:', req.user?.user_id);

        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        console.log('✅ User signed out successfully');
        console.log('=== SIGNOUT END ===\n');

        res.status(200).json({
            success: true,
            message: 'Signed out successfully'
        });
    } catch (error) {
        console.error('❌ Signout error:', error);
        next(errorHandler(500, 'Error during signout'));
    }
}