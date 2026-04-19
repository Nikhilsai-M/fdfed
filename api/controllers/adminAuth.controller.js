import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import {
  getAuthCookieOptions,
  getClearCookieOptions,
} from "../utils/http.js";

export const adminSignin = async (req, res, next) => {
  const {
    username,
    adminId,
    admin_id,
    password,
    securityToken,
    security_token,
  } = req.body;
  const loginId = username || adminId || admin_id;
  const resolvedSecurityToken = securityToken || security_token;

  try {
    console.log("\n=== ADMIN SIGNIN REQUEST ===");
    console.log("Admin login attempt for:", loginId);

    if (!loginId || !password || !resolvedSecurityToken) {
      console.log("Missing credentials");
      return next(errorHandler(400, "Admin ID, password and security token are required"));
    }

    const validAdmin = await Admin.findOne({ admin_id: loginId });

    if (!validAdmin) {
      console.log("Admin not found");
      return next(errorHandler(404, "Admin not found!"));
    }

    console.log("Admin found:", validAdmin.admin_id);

    const validPassword = bcrypt.compareSync(password, validAdmin.password);

    if (!validPassword) {
      console.log("Invalid password");
      return next(errorHandler(400, "Invalid credentials!"));
    }

    if (validAdmin.security_token !== resolvedSecurityToken) {
      console.log("Invalid security token");
      return next(errorHandler(400, "Invalid security token!"));
    }

    const token = jwt.sign(
      {
        id: validAdmin._id,
        admin_id: validAdmin.admin_id,
        name: validAdmin.name,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pass, ...rest } = validAdmin._doc;

    res
      .cookie("admin_access_token", token, {
        ...getAuthCookieOptions(),
      })
      .status(200)
      .json({
        success: true,
        admin: rest,
        token,
      });

    console.log("Admin login successful");
    console.log("=== ADMIN SIGNIN END ===\n");
  } catch (error) {
    console.error("Admin signin error:", error);
    next(errorHandler(500, "Error during admin signin: " + error.message));
  }
};

export const adminSignout = async (req, res, next) => {
  try {
    console.log("\n=== ADMIN SIGNOUT REQUEST ===");

    res.clearCookie("admin_access_token", {
      ...getClearCookieOptions(),
    });

    console.log("Admin signed out successfully");
    console.log("=== ADMIN SIGNOUT END ===\n");

    res.status(200).json({
      success: true,
      message: "Admin signed out successfully",
    });
  } catch (error) {
    console.error("Admin signout error:", error);
    next(errorHandler(500, "Error during admin signout"));
  }
};
