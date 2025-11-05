import LaptopApplication from '../models/laptopApplication.model.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/laptops/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'laptop-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export const submitLaptopApplication = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    // Handle both multipart form data and JSON
    const {
      brand,
      model,
      ram,
      storage,
      processor,
      generation,
      display_size,
      weight,
      os,
      device_age,
      battery_issues,
      location,
      name,
      email,
      phone
    } = req.body;

    // Validate required fields
    if (!brand || !model || !ram || !storage || !processor || !location || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Generate unique ID
    const lastApplication = await LaptopApplication.findOne().sort({ id: -1 });
    const nextId = lastApplication ? lastApplication.id + 1 : 1;

    let image_path = '';
    if (req.file) {
      image_path = req.file.path;
    }

    // Create new application
    const newApplication = new LaptopApplication({
      id: nextId,
      user_id: req.user.user_id, // Use actual user ID if authenticated
      brand: brand.toUpperCase(),
      model,
      ram,
      storage,
      processor,
      generation: generation || '',
      display_size: display_size || '',
      weight: weight || '',
      os: os || '',
      device_age: device_age || '',
      battery_issues: battery_issues || 'None',
      location,
      name,
      email,
      phone,
      image_path,
      status: 'pending'
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: 'Laptop application submitted successfully',
      applicationId: nextId
    });

  } catch (error) {
    console.error('Error submitting laptop application:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};

export const getLaptopApplications = async (req, res) => {
  try {
    const applications = await LaptopApplication.find().sort({ created_at: -1 });
    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching laptop applications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateLaptopApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason, price } = req.body;

    const application = await LaptopApplication.findOne({ id: parseInt(id) });
    
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