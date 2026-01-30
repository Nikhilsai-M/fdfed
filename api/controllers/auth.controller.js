import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { errorHandler } from "../utils/error.js";
import { sendOTPEmail } from "../utils/mailer.js";

// Temporary stores for OTPs and pending registrations
const otpStore = {}; // For password reset (key: email)
const pendingRegistrations = {}; // For signup verification

// 🟢 INITIATE SIGNUP (Send OTP)
export const initiateSignup = async (req, res, next) => {
  const { username, firstName, lastName, email, phone, address, password } = req.body;

  try {
    console.log('\n=== 📝 INITIATE SIGNUP REQUEST ===');

    // Check for existing users
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) return next(errorHandler(400, 'Email already registered'));

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) return next(errorHandler(400, 'Username already taken'));

    // Validate required fields
    if (!username || !firstName || !lastName || !email || !phone || !password)
      return next(errorHandler(400, 'All fields are required'));

    if (!address || !address.street || !address.city || !address.state || !address.postal_code || !address.country)
      return next(errorHandler(400, 'Complete address is required'));

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store registration data temporarily
    pendingRegistrations[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      userData: {
        username,
        firstName,
        lastName,
        email,
        phone,
        address,
        password: bcrypt.hashSync(password, 10), // Hash password now
      }
    };

    // Send OTP email
    await sendOTPEmail(email, otp, "verification");

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
      email,
    });
  } catch (error) {
    console.error("Signup initiation error:", error);
    next(errorHandler(500, "Error initiating signup: " + error.message));
  }
};

// 🟢 VERIFY OTP AND COMPLETE SIGNUP
export const verifySignupOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    const pendingData = pendingRegistrations[email];
    
    if (!pendingData) {
      return next(errorHandler(400, "No pending registration found or OTP expired"));
    }
    
    if (Date.now() > pendingData.expires) {
      delete pendingRegistrations[email];
      return next(errorHandler(400, "OTP has expired. Please start registration again."));
    }
    
    if (pendingData.otp.toString() !== otp.toString()) {
      return next(errorHandler(400, "Invalid OTP"));
    }
    
    // OTP verified, create user
    const { userData } = pendingData;
    
    // Generate UUID for user
    const userId = uuidv4();
    
    const newUser = new User({
      user_id: userId,
      username: userData.username,
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      password: userData.password,
      orders_count: 0,
      items_sold_count: 0,
      password_last_changed: new Date(),
      created_at: new Date(),
    });

    await newUser.save();
    
    // Clean up
    delete pendingRegistrations[email];
    
    // Generate JWT token for immediate login
    const token = jwt.sign(
      {
        id: newUser._id,
        user_id: newUser.user_id,
        email: newUser.email,
        username: newUser.username,
        role: "customer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password, ...userWithoutPassword } = newUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .status(201)
      .json({
        success: true,
        message: "User created and verified successfully",
        user: userWithoutPassword,
        token,
      });
  } catch (error) {
    console.error("Signup verification error:", error);
    next(errorHandler(500, "Error completing registration: " + error.message));
  }
};

// 🟢 RESEND OTP
export const resendSignupOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const pendingData = pendingRegistrations[email];
    
    if (!pendingData) {
      return next(errorHandler(400, "No pending registration found. Please start over."));
    }
    
    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000);
    
    // Update pending registration
    pendingRegistrations[email] = {
      ...pendingData,
      otp: newOTP,
      expires: Date.now() + 5 * 60 * 1000,
    };
    
    // Send new OTP
    await sendOTPEmail(email, newOTP, "verification");
    
    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    next(errorHandler(500, "Error resending OTP: " + error.message));
  }
};

// 🟢 SIGNIN (unchanged)
export const signin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    console.log('\n=== 🔐 SIGNIN REQUEST ===');
    if (!username || !password)
      return next(errorHandler(400, "Username and password are required"));

    const validUser = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, "Invalid credentials!"));

    const token = jwt.sign(
      {
        id: validUser._id,
        user_id: validUser.user_id,
        email: validUser.email,
        username: validUser.username,
        role: "customer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({ success: true, user: rest, token });
  } catch (error) {
    console.error("Signin error:", error);
    next(errorHandler(500, "Error during signin: " + error.message));
  }
};

// 🟢 FORGOT PASSWORD (Updated to accept username/email)
export const forgotPassword = async (req, res, next) => {
  try {
    const { usernameOrEmail } = req.body;
    
    if (!usernameOrEmail) {
      return next(errorHandler(400, "Please enter your username or email"));
    }

    // Find user by username OR email
    const user = await User.findOne({ 
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ] 
    });
    
    if (!user) {
      return next(errorHandler(404, "User not found with that username or email"));
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store OTP with user's email as key
    otpStore[user.email] = { 
      otp, 
      expires: Date.now() + 5 * 60 * 1000,
      username: user.username // Store username for reference
    };

    // Send OTP to user's email
    await sendOTPEmail(user.email, otp, "password_reset");

    res.status(200).json({ 
      success: true, 
      message: "OTP sent to your registered email",
      email: user.email, // Return email for next steps
      username: user.username
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    next(errorHandler(500, "Error sending OTP"));
  }
};

// 🟢 VERIFY OTP (for password reset)
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return next(errorHandler(400, "Email and OTP are required"));
    }
    
    const record = otpStore[email];
    
    if (!record) {
      return next(errorHandler(400, "No OTP found for this email"));
    }
    
    if (Date.now() > record.expires) {
      delete otpStore[email];
      return next(errorHandler(400, "OTP has expired. Please request a new one."));
    }
    
    if (record.otp.toString() !== otp.toString()) {
      return next(errorHandler(400, "Invalid OTP"));
    }

    // Mark OTP as verified (but don't delete yet - we'll use it in reset)
    otpStore[email].verified = true;
    
    res.status(200).json({ 
      success: true, 
      message: "OTP verified successfully",
      email,
      username: record.username
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    next(errorHandler(500, "Error verifying OTP"));
  }
};

// 🟢 RESET PASSWORD + ISSUE NEW JWT
export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, otp } = req.body;
    
    if (!email || !newPassword) {
      return next(errorHandler(400, "Email and new password are required"));
    }

    // Verify OTP first (additional security)
    const otpRecord = otpStore[email];
    if (!otpRecord || !otpRecord.verified) {
      return next(errorHandler(400, "OTP verification required before resetting password"));
    }

    if (otp && otpRecord.otp.toString() !== otp.toString()) {
      return next(errorHandler(400, "Invalid OTP provided"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      delete otpStore[email];
      return next(errorHandler(404, "User not found"));
    }

    // Hash new password
    const hashed = bcrypt.hashSync(newPassword, 10);
    user.password = hashed;
    user.password_last_changed = new Date();
    await user.save();

    // Clean up OTP store
    delete otpStore[email];

    // Generate JWT token after reset
    const token = jwt.sign(
      {
        id: user._id,
        user_id: user.user_id,
        email: user.email,
        username: user.username,
        role: "customer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password, ...userData } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        message: "Password reset successfully",
        user: userData,
        token,
      });
  } catch (error) {
    console.error("Reset Password Error:", error);
    next(errorHandler(500, "Error resetting password"));
  }
};

// 🟢 RESEND FORGOT PASSWORD OTP
export const resendForgotPasswordOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next(errorHandler(400, "Email is required"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000);
    
    // Update OTP store
    otpStore[email] = { 
      otp: newOTP, 
      expires: Date.now() + 5 * 60 * 1000,
      username: user.username
    };

    // Send new OTP
    await sendOTPEmail(email, newOTP, "password_reset");

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });
  } catch (error) {
    console.error("Resend Forgot Password OTP Error:", error);
    next(errorHandler(500, "Error resending OTP"));
  }
};

// 🟢 PROFILE
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return next(errorHandler(404, "User not found"));

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(errorHandler(500, "Error fetching profile"));
  }
};

// 🟢 UPDATE PROFILE
export const updateUserProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    const updateData = {};
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updateData }, { new: true }).select("-password");

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(errorHandler(500, "Error updating profile"));
  }
};

// 🟢 SIGNOUT
export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).json({ success: true, message: "Signed out successfully" });
  } catch (error) {
    next(errorHandler(500, "Error during signout"));
  }
};