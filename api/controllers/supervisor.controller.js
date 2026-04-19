import { Supervisor, SupervisorActivity } from "../models/supervisor.model.js";
import PhoneApplication from "../models/phoneApplication.model.js";
import LaptopApplication from "../models/laptopApplication.model.js";
import Phone from "../models/phone.model.js";
import Laptop from "../models/laptop.model.js";
import bcrypt from "bcryptjs";
import { matchRequests } from "../services/requestMatcher.service.js";
import { errorHandler } from "../utils/error.js";
import DeviceRequest from "../models/deviceRequest.model.js";
import Notification from "../models/notification.model.js";
import { v4 as uuidv4 } from "uuid";
import {
  getNextSupervisorId,
  getSupervisorIdsByType,
} from "../services/supervisorAssignment.service.js";
import { invalidateCatalogCaches } from "../config/redis.js";
import { queueMeiliSync } from "../services/search.service.js";
import { getClearCookieOptions } from "../utils/http.js";

// Helper: return the correct Application model based on supervisor type
const getApplicationModel = (supervisorType) => {
  if (supervisorType === 'phone') return PhoneApplication;
  if (supervisorType === 'laptop') return LaptopApplication;
  return null;
};

const assignPendingApplications = async (supervisorType, ApplicationModel) => {
  const supervisorIds = await getSupervisorIdsByType(supervisorType);
  if (supervisorIds.length === 0) return;

  const pendingAppsToAssign = await ApplicationModel.find({
    status: "pending",
    $or: [
      { assigned_supervisor_id: { $exists: false } },
      { assigned_supervisor_id: null },
      { assigned_supervisor_id: { $nin: supervisorIds } },
    ],
  })
    .sort({ created_at: 1, id: 1 })
    .select({ _id: 1 })
    .lean();

  for (const app of pendingAppsToAssign) {
    const nextSupervisorId = await getNextSupervisorId(supervisorType);
    if (!nextSupervisorId) break;

    await ApplicationModel.updateOne(
      { _id: app._id, status: "pending" },
      {
        $set: {
          assigned_supervisor_id: nextSupervisorId,
          assigned_at: new Date(),
        },
      }
    );
  }
};

export const getDashboardData = async (req, res, next) => {
  try {
    const supervisorType = req.user.supervisorType; // 'phone' or 'laptop'
    const ApplicationModel = getApplicationModel(supervisorType);

    if (!ApplicationModel) {
      return next(errorHandler(400, 'Invalid supervisor type'));
    }

    await assignPendingApplications(supervisorType, ApplicationModel);

    const pendingCount = await ApplicationModel.countDocuments({
      status: "pending",
      assigned_supervisor_id: req.user.user_id,
    });
    const approvedCount = await ApplicationModel.countDocuments({
      status: { $in: ["approved", "added_to_inventory"] },
      assigned_supervisor_id: req.user.user_id,
    });

    const recentActivity = await SupervisorActivity.find({ supervisor_id: req.user.user_id })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    const activityMessages = recentActivity.map(activity => activity.action);

    res.status(200).json({
      success: true,
      supervisorType,
      pendingListings: pendingCount,
      itemsAdded: approvedCount,
      recentActivity: activityMessages.length > 0 ? activityMessages : ['No recent activity']
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    next(errorHandler(500, 'Error fetching dashboard data'));
  }
};

export const getStatistics = async (req, res, next) => {
  try {
    const supervisorType = req.user.supervisorType;
    const ApplicationModel = getApplicationModel(supervisorType);

    if (!ApplicationModel) {
      return next(errorHandler(400, 'Invalid supervisor type'));
    }

    await assignPendingApplications(supervisorType, ApplicationModel);

    const totalItemsAdded = await ApplicationModel.countDocuments({
      assigned_supervisor_id: req.user.user_id,
    });
    const listingsVerified = await ApplicationModel.countDocuments({
      status: { $in: ['approved', 'added_to_inventory'] },
      assigned_supervisor_id: req.user.user_id,
    });
    const pendingListings = await ApplicationModel.countDocuments({
      status: 'pending',
      assigned_supervisor_id: req.user.user_id,
    });

    const recentActivity = await SupervisorActivity.find({ supervisor_id: req.user.user_id })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      statistics: {
        totalItemsAdded,
        listingsVerified,
        pendingListings,
        recentActivity: recentActivity.map(activity => ({
          action: activity.action,
          timestamp: activity.timestamp
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    next(errorHandler(500, 'Error fetching statistics'));
  }
};

export const getVerifyApplications = async (req, res, next) => {
  try {
    const supervisorType = req.user.supervisorType;
    const ApplicationModel = getApplicationModel(supervisorType);

    if (!ApplicationModel) {
      return next(errorHandler(400, 'Invalid supervisor type'));
    }

    await assignPendingApplications(supervisorType, ApplicationModel);

    const apps = await ApplicationModel.find({
      assigned_supervisor_id: req.user.user_id,
    })
      .sort({ created_at: -1 })
      .lean();
    const applications = apps.map(app => ({ ...app, type: supervisorType }));

    res.status(200).json({
      success: true,
      supervisorType,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    next(errorHandler(500, 'Error fetching applications'));
  }
};

export const getApplicationDetails = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const supervisorType = req.user.supervisorType;

    // Prevent a phone supervisor from accessing laptop applications and vice versa
    if (type !== supervisorType) {
      return next(errorHandler(403, `You are not authorized to view ${type} applications`));
    }

    const numericId = parseInt(id);
    const ApplicationModel = getApplicationModel(supervisorType);
    const application = await ApplicationModel.findOne({
      id: numericId,
      assigned_supervisor_id: req.user.user_id,
    }).lean();

    if (!application) {
      return next(errorHandler(404, 'Application not found'));
    }

    res.status(200).json({
      success: true,
      type,
      application
    });
  } catch (error) {
    console.error('Error fetching application details:', error);
    next(errorHandler(500, 'Error fetching application details'));
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const supervisorType = req.user.supervisorType;

    if (type !== supervisorType) {
      return next(errorHandler(403, `You are not authorized to update ${type} applications`));
    }

    const { status, rejectionReason, price } = req.body;
    const numericId = parseInt(id);
    const ApplicationModel = getApplicationModel(supervisorType);

    const result = await ApplicationModel.updateOne(
      { id: numericId, assigned_supervisor_id: req.user.user_id },
      { $set: { status, rejection_reason: rejectionReason, price } }
    );

    if (result.modifiedCount === 0) {
      return next(errorHandler(404, 'Application not found'));
    }

    await SupervisorActivity.create({
      supervisor_id: req.user.user_id,
      action: `Updated ${type} application #${id} to ${status}${price ? ` with price ₹${price}` : ''}`
    });

    await invalidateCatalogCaches();
      queueMeiliSync();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    next(errorHandler(500, 'Error updating application status'));
  }
};

export const addToInventory = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const supervisorType = req.user.supervisorType;

    if (type !== supervisorType) {
      return next(errorHandler(403, `You are not authorized to add ${type} items to inventory`));
    }

    const { discount, condition } = req.body;
    const numericId = parseInt(id);

    if (supervisorType === 'phone') {
      const application = await PhoneApplication.findOne({
        id: numericId,
        assigned_supervisor_id: req.user.user_id,
      });
      if (!application) {
        return next(errorHandler(404, 'Phone application not found'));
      }

      const result = await PhoneApplication.updateOne(
        { id: numericId, assigned_supervisor_id: req.user.user_id },
        { $set: { status: 'added_to_inventory' } }
      );
      if (result.modifiedCount === 0) {
        return next(errorHandler(404, 'Failed to update application status'));
      }

      const productData = {
        id: application.id,
        brand: application.brand,
        model: application.model,
        color: '',
        image: application.image_path || '/default-phone.jpg',
        processor: application.processor,
        display: application.size || '',
        battery: parseInt(application.battery) || 0,
        camera: application.camera,
        os: application.os,
        network: application.network,
        weight: application.weight || '',
        ram: application.ram,
        rom: application.rom,
        base_price: application.price || 0,
        discount: parseInt(discount) || 0,
        condition: condition || 'Good',
        created_at: new Date()
      };

      const phone = new Phone(productData);
      await phone.save();
      await matchRequests("phone", phone);

    } else if (supervisorType === 'laptop') {
      const application = await LaptopApplication.findOne({
        id: numericId,
        assigned_supervisor_id: req.user.user_id,
      });
      if (!application) {
        return next(errorHandler(404, 'Laptop application not found'));
      }

      const result = await LaptopApplication.updateOne(
        { id: numericId, assigned_supervisor_id: req.user.user_id },
        { $set: { status: 'added_to_inventory' } }
      );
      if (result.modifiedCount === 0) {
        return next(errorHandler(404, 'Failed to update application status'));
      }

      const productData = {
        id: application.id,
        brand: application.brand,
        series: application.model,
        processor_name: application.processor,
        processor_generation: application.generation || '',
        base_price: application.price || 0,
        discount: parseInt(discount) || 0,
        ram: application.ram,
        storage_type: 'SSD',
        storage_capacity: application.storage,
        display_size: parseFloat(application.display_size) || 14,
        weight: parseFloat(application.weight) || 1.5,
        condition: condition || 'Good',
        os: application.os || 'Windows',
        image: application.image_path || '/default-laptop.jpg',
        created_at: new Date()
      };

      const laptop = new Laptop(productData);
      await laptop.save();
      await matchRequests("laptop", laptop);
    }

    await SupervisorActivity.create({
      supervisor_id: req.user.user_id,
      action: `Added ${type} #${id} to inventory with condition: ${condition} and discount: ${discount}%`
    });

    await invalidateCatalogCaches();
      queueMeiliSync();

    res.status(200).json({
      success: true,
      message: 'Item added to inventory successfully and product created'
    });
  } catch (error) {
    console.error('Error adding to inventory:', error);
    if (error.code === 11000) {
      return next(errorHandler(400, 'Product with this ID already exists in inventory'));
    }
    next(errorHandler(500, 'Error adding to inventory'));
  }
};

export const getSupervisorProfile = async (req, res, next) => {
  try {
    const supervisor = await Supervisor.findOne({ user_id: req.user.user_id }).select('-password');
    if (!supervisor) {
      return next(errorHandler(404, 'Supervisor not found'));
    }
    res.status(200).json({ success: true, supervisor });
  } catch (error) {
    console.error('Error fetching supervisor profile:', error);
    next(errorHandler(500, 'Error fetching supervisor profile'));
  }
};

export const updateSupervisorProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, username } = req.body;
    const userId = req.user.user_id;

    const emailCheck = await Supervisor.findOne({ email, user_id: { $ne: userId } });
    if (emailCheck) {
      return next(errorHandler(400, 'Email already in use by another supervisor'));
    }

    const usernameCheck = await Supervisor.findOne({ username, user_id: { $ne: userId } });
    if (usernameCheck) {
      return next(errorHandler(400, 'Username already in use by another supervisor'));
    }

    await Supervisor.updateOne(
      { user_id: userId },
      { $set: { first_name, last_name, email, phone, username } }
    );

    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating supervisor profile:', error);
    next(errorHandler(500, 'Error updating supervisor profile'));
  }
};

export const updateSupervisorPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    const supervisor = await Supervisor.findOne({ user_id: userId });
    if (!supervisor) {
      return next(errorHandler(404, 'Supervisor not found'));
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, supervisor.password);
    if (!isPasswordValid) {
      return next(errorHandler(400, 'Current password is incorrect'));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Supervisor.updateOne({ user_id: userId }, { $set: { password: hashedPassword } });

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating supervisor password:', error);
    next(errorHandler(500, 'Error updating supervisor password'));
  }
};

export const supervisorLogout = async (req, res, next) => {
  try {
    res.clearCookie('supervisor_access_token', getClearCookieOptions());
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    next(errorHandler(500, 'Error during logout'));
  }
};

