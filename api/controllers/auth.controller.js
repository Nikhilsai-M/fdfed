import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { errorHandler } from "../utils/error.js";
import { sendMail } from "../utils/mailer.js";

const otpStore = {}; // temporary memory store

// 🟢 SIGNUP
export const signup = async (req, res, next) => {
  const { username, firstName, lastName, email, phone, address, password } = req.body;

  try {
    console.log('\n=== 📝 SIGNUP REQUEST ===');

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

    // Generate UUID for user
    const userId = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      user_id: userId,
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      password: hashedPassword,
      orders_count: 0,
      items_sold_count: 0,
      password_last_changed: new Date(),
      created_at: new Date(),
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId,
    });
  } catch (error) {
    console.error("Signup error:", error);
    next(errorHandler(500, "Error creating user: " + error.message));
  }
};

// 🟢 SIGNIN
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

// 🟢 FORGOT PASSWORD (Send OTP)
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    await sendMail({
      to: email,
      subject: "SmartExchange Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    next(errorHandler(500, "Error sending OTP"));
  }
};

// 🟢 VERIFY OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record) return next(errorHandler(400, "No OTP found"));
    if (Date.now() > record.expires) return next(errorHandler(400, "OTP expired"));
    if (record.otp.toString() !== otp) return next(errorHandler(400, "Invalid OTP"));

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    next(errorHandler(500, "Error verifying OTP"));
  }
};

// 🟢 RESET PASSWORD + ISSUE NEW JWT
export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    const hashed = bcrypt.hashSync(newPassword, 10);
    user.password = hashed;
    user.password_last_changed = new Date();
    await user.save();

    delete otpStore[email];

    // Generate JWT token after reset (same as signin)
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
