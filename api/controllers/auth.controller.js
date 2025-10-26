import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async(req, res, next) => {
    const { username, firstName, lastName, email, phone, address, password } = req.body;
    
    try {
        // Check if user already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return next(errorHandler(400, 'Email already registered'));
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return next(errorHandler(400, 'Username already taken'));
        }

        // Validate required fields
        if (!username || !firstName || !lastName || !email || !phone || !password) {
            return next(errorHandler(400, 'All fields are required'));
        }

        if (!address || !address.street || !address.city || !address.state || !address.postal_code || !address.country) {
            return next(errorHandler(400, 'Complete address is required'));
        }

        // Generate user_id
        const userId = 'user_' + Date.now();
        
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
        
        res.status(201).json({ 
            success: true,
            message: "User created successfully",
            userId: userId
        });
    } catch (error) {
        console.error('Signup error:', error);
        
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
        // Validate input
        if (!username || !password) {
            return next(errorHandler(400, 'Username and password are required'));
        }

        // Find user by username or email
        const validUser = await User.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!validUser) {
            return next(errorHandler(404, "User not found!"));
        }

        // Verify password
        const validPassword = bcrypt.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandler(400, "Invalid credentials!"));
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: validUser._id, user_id: validUser.user_id }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Remove password from response
        const { password: pass, ...rest } = validUser._doc;

        // Send response with cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }).status(200).json({
            success: true,
            user: rest
        });

    } catch(error) {
        console.error('Signin error:', error);
        next(errorHandler(500, 'Error during signin: ' + error.message));
    }
}

// Additional function to get user profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        next(errorHandler(500, 'Error fetching profile: ' + error.message));
    }
}

// Function to update user profile
export const updateUserProfile = async (req, res, next) => {
    try {
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

        res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        next(errorHandler(500, 'Error updating profile: ' + error.message));
    }
}