import PhoneApplication from '../models/phoneApplication.model.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/phones/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'phone-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

export const submitPhoneApplication = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const {
      brand,
      model,
      ram,
      rom,
      processor,
      network,
      size,
      weight,
      device_age,
      battery,
      camera,
      os,
      switching_on,
      phone_calls,
      cameras_working,
      battery_issues,
      physically_damaged,
      sound_issues,
      location,
      email,
      phone
    } = req.body;

    // Validate required fields
    const requiredFields = ['brand', 'model', 'ram', 'rom', 'processor', 'network', 'device_age', 'battery', 'camera', 'os', 'location', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }

    // Generate unique ID
    const lastApplication = await PhoneApplication.findOne().sort({ id: -1 });
    const nextId = lastApplication ? lastApplication.id + 1 : 1;

    let image_path = '';
    if (req.file) {
      image_path = req.file.path;
    }

    // Create new application
    const newApplication = new PhoneApplication({
      id: nextId,
      user_id: req.userId || uuidv4(),
      brand: brand.toUpperCase(),
      model,
      ram,
      rom,
      processor,
      network,
      size: size || '',
      weight: weight || '',
      device_age,
      battery,
      camera,
      os,
      switching_on,
      phone_calls,
      cameras_working,
      battery_issues,
      physically_damaged,
      sound_issues,
      location,
      email,
      phone,
      image_path,
      status: 'pending'
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: 'Phone application submitted successfully',
      applicationId: nextId
    });

  } catch (error) {
    console.error('Error submitting phone application:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};

export const getPhoneApplications = async (req, res) => {
  try {
    const applications = await PhoneApplication.find().sort({ created_at: -1 });
    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching phone applications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updatePhoneApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason, price } = req.body;

    const application = await PhoneApplication.findOne({ id: parseInt(id) });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    if (rejection_reason) application.rejection_reason = rejection_reason;
    if (price) application.price = price;

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Export multer upload middleware
export { upload };