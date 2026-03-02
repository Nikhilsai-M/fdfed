import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Seller from "../models/seller.model.js"; 
import { sendOTPEmail } from "../utils/mailer.js";

// Temporary store for pending seller registrations
const pendingSellerRegistrations = {};

// 🟢 1. INITIATE SELLER SIGNUP (Send OTP)
export const initiateSellerSignup = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, storeName, businessAddress } = req.body;

    const existingSeller = await Seller.findOne({ email });

    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists with this email" });
    }

    // Validate required fields
    if (!name || !email || !password || !phoneNumber || !storeName || !businessAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Hash the password now before temporarily storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store registration data temporarily
    pendingSellerRegistrations[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      sellerData: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        storeName,
        businessAddress,
        role: "seller"
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
    res.status(500).json({ message: error.message });
  }
};

// 🟢 2. VERIFY OTP AND COMPLETE SIGNUP
export const verifySellerSignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pendingData = pendingSellerRegistrations[email];

    if (!pendingData) {
      return res.status(400).json({ message: "No pending registration found or OTP expired" });
    }

    if (Date.now() > pendingData.expires) {
      delete pendingSellerRegistrations[email];
      return res.status(400).json({ message: "OTP has expired. Please start registration again." });
    }

    if (pendingData.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified, create seller in the database
    const { sellerData } = pendingData;
    const seller = new Seller(sellerData);
    await seller.save();

    // Clean up temporary memory
    delete pendingSellerRegistrations[email];

    const { password: _, ...sellerResponse } = seller._doc;

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      seller: sellerResponse
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 3. RESEND OTP
export const resendSellerSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const pendingData = pendingSellerRegistrations[email];

    if (!pendingData) {
      return res.status(400).json({ message: "No pending registration found. Please start over." });
    }

    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000);

    pendingSellerRegistrations[email] = {
      ...pendingData,
      otp: newOTP,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await sendOTPEmail(email, newOTP, "verification");

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 4. SELLER LOGIN (Unchanged)
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(400).json({ message: "Seller not found" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: seller._id, role: seller.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...sellerData } = seller._doc;

    res.json({
      success: true,
      token,
      seller: sellerData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 5. SELLER LOGOUT (Unchanged)
export const sellerLogout = (req, res) => {
  res.clearCookie("access_token");
  res.status(200).json({
    success: true,
    message: "Seller logged out"
  });
};