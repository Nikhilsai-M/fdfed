import { Supervisor, SupervisorActivity } from "../models/supervisor.model.js";
import PhoneApplication from "../models/phoneApplication.model.js";
import LaptopApplication from "../models/laptopApplication.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

// Dashboard Data
export const getDashboardData = async (req, res, next) => {
  try {
    const pendingPhoneApps = await PhoneApplication.countDocuments({ status: 'pending' });
    const pendingLaptopApps = await LaptopApplication.countDocuments({ status: 'pending' });
    const totalPending = pendingPhoneApps + pendingLaptopApps;

    const approvedPhoneApps = await PhoneApplication.countDocuments({ status: 'approved' });
    const approvedLaptopApps = await LaptopApplication.countDocuments({ status: 'approved' });
    const totalApproved = approvedPhoneApps + approvedLaptopApps;

    // Get recent activity
    const recentActivity = await SupervisorActivity.find({ supervisor_id: req.user.user_id })
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();

    const activityMessages = recentActivity.map(activity => activity.action);

    res.status(200).json({
      success: true,
      pendingListings: totalPending,
      itemsAdded: totalApproved,
      recentActivity: activityMessages.length > 0 ? activityMessages : ['No recent activity']
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    next(errorHandler(500, 'Error fetching dashboard data'));
  }
};

// Statistics
export const getStatistics = async (req, res, next) => {
  try {
    const totalPhoneApps = await PhoneApplication.countDocuments();
    const totalLaptopApps = await LaptopApplication.countDocuments();
    const totalItemsAdded = totalPhoneApps + totalLaptopApps;

    const verifiedPhoneApps = await PhoneApplication.countDocuments({ 
      status: { $in: ['approved', 'added_to_inventory'] } 
    });
    const verifiedLaptopApps = await LaptopApplication.countDocuments({ 
      status: { $in: ['approved', 'added_to_inventory'] } 
    });
    const listingsVerified = verifiedPhoneApps + verifiedLaptopApps;

    const pendingPhoneApps = await PhoneApplication.countDocuments({ status: 'pending' });
    const pendingLaptopApps = await LaptopApplication.countDocuments({ status: 'pending' });
    const pendingListings = pendingPhoneApps + pendingLaptopApps;

    // Get recent activity for statistics
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

// Get applications for verification
export const getVerifyApplications = async (req, res, next) => {
  try {
    const phoneApps = await PhoneApplication.find().sort({ created_at: -1 }).lean();
    const laptopApps = await LaptopApplication.find().sort({ created_at: -1 }).lean();

    const applications = [
      ...phoneApps.map(app => ({ ...app, type: 'phone' })),
      ...laptopApps.map(app => ({ ...app, type: 'laptop' }))
    ];

    res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    next(errorHandler(500, 'Error fetching applications'));
  }
};

// Get application details
export const getApplicationDetails = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const numericId = parseInt(id);

    let application;
    if (type === 'phone') {
      application = await PhoneApplication.findOne({ id: numericId }).lean();
    } else if (type === 'laptop') {
      application = await LaptopApplication.findOne({ id: numericId }).lean();
    } else {
      return next(errorHandler(400, 'Invalid application type'));
    }

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

// Update application status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { status, rejectionReason, price } = req.body;
    const numericId = parseInt(id);

    let result;
    if (type === 'phone') {
      result = await PhoneApplication.updateOne(
        { id: numericId },
        { $set: { status, rejection_reason: rejectionReason, price } }
      );
    } else if (type === 'laptop') {
      result = await LaptopApplication.updateOne(
        { id: numericId },
        { $set: { status, rejection_reason: rejectionReason, price } }
      );
    } else {
      return next(errorHandler(400, 'Invalid application type'));
    }

    if (result.modifiedCount === 0) {
      return next(errorHandler(404, 'Application not found'));
    }

    // Log activity
    await SupervisorActivity.create({
      supervisor_id: req.user.user_id,
      action: `Updated ${type} application #${id} to ${status}${price ? ` with price ₹${price}` : ''}`
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    next(errorHandler(500, 'Error updating application status'));
  }
};

// Add to inventory
export const addToInventory = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { discount, condition } = req.body;
    const numericId = parseInt(id);

    let result;
    if (type === 'phone') {
      result = await PhoneApplication.updateOne(
        { id: numericId },
        { $set: { status: 'added_to_inventory' } }
      );
    } else if (type === 'laptop') {
      result = await LaptopApplication.updateOne(
        { id: numericId },
        { $set: { status: 'added_to_inventory' } }
      );
    } else {
      return next(errorHandler(400, 'Invalid application type'));
    }

    if (result.modifiedCount === 0) {
      return next(errorHandler(404, 'Application not found'));
    }

    // Log activity
    await SupervisorActivity.create({
      supervisor_id: req.user.user_id,
      action: `Added ${type} #${id} to inventory with condition: ${condition} and discount: ${discount}%`
    });

    res.status(200).json({
      success: true,
      message: 'Item added to inventory successfully'
    });
  } catch (error) {
    console.error('Error adding to inventory:', error);
    next(errorHandler(500, 'Error adding to inventory'));
  }
};

// Get supervisor profile
export const getSupervisorProfile = async (req, res, next) => {
  try {
    const supervisor = await Supervisor.findOne({ user_id: req.user.user_id }).select('-password');
    
    if (!supervisor) {
      return next(errorHandler(404, 'Supervisor not found'));
    }

    res.status(200).json({
      success: true,
      supervisor
    });
  } catch (error) {
    console.error('Error fetching supervisor profile:', error);
    next(errorHandler(500, 'Error fetching supervisor profile'));
  }
};

// Update supervisor profile
export const updateSupervisorProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone, username } = req.body;
    const userId = req.user.user_id;

    // Check if email or username already exists for another supervisor
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

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating supervisor profile:', error);
    next(errorHandler(500, 'Error updating supervisor profile'));
  }
};

// Update supervisor password
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
    
    await Supervisor.updateOne(
      { user_id: userId },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating supervisor password:', error);
    next(errorHandler(500, 'Error updating supervisor password'));
  }
};

// Supervisor logout
export const supervisorLogout = async (req, res, next) => {
  try {
    res.clearCookie('supervisor_access_token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    next(errorHandler(500, 'Error during logout'));
  }
};