import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findOne, create } from "../models/seller.model.js";

export const sellerSignup = async (req, res) => {

  try {

    const { name, email, password, phoneNumber, storeName, businessAddress } = req.body;

    const existingSeller = await findOne({ email });

    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      storeName,
      businessAddress,
      role: "seller"
    });

    const { password: _, ...sellerData } = seller._doc;

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      seller: sellerData
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


export const sellerLogin = async (req, res) => {

  try {

    const { email, password } = req.body;

    const seller = await findOne({ email });

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

export const sellerLogout = (req, res) => {

  res.clearCookie("access_token");

  res.status(200).json({
    success: true,
    message: "Seller logged out"
  });

};