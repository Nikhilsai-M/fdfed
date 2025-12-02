import LaptopApplication from '../models/laptopApplication.model.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { unlink } from 'fs/promises';

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/laptops/';
    
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
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)!'));
    }
  }
});

export const submitLaptopApplication = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

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
      description,
      name,
      email,
      phone
    } = req.body;

    // Validate required fields
    if (!brand || !model || !ram || !storage || !processor || !location || !description || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be 10 digits'
      });
    }

    // Generate unique ID
    const lastApplication = await LaptopApplication.findOne().sort({ id: -1 });
    const nextId = lastApplication ? lastApplication.id + 1 : 1;

    let image_path = '';
    let cloudinary_public_id = '';

    // Upload to Cloudinary if file exists
    if (req.file) {
      try {
        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file.path, 'laptops');
        
        // Store Cloudinary URL in image_path (keeping the same field name)
        image_path = cloudinaryResult.secure_url;
        cloudinary_public_id = cloudinaryResult.public_id;
        
        // Clean up temporary file
        await unlink(req.file.path);
        console.log('Temporary file cleaned up:', req.file.path);
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        // Clean up temp file even if upload fails
        if (req.file && req.file.path) {
          try {
            await unlink(req.file.path);
          } catch (cleanupError) {
            console.error('Error cleaning up temp file:', cleanupError);
          }
        }
        return res.status(500).json({
          success: false,
          message: 'Failed to upload image. Please try again.'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Device image is required'
      });
    }

    // Create new application - image_path now contains Cloudinary URL
    const newApplication = new LaptopApplication({
      id: nextId,
      user_id: req.user?.user_id || null,
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
      description,
      name,
      email,
      phone,
      image_path, // This now contains Cloudinary URL, not local path
      cloudinary_public_id, // Store Cloudinary ID for future management
      status: 'pending'
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: 'Laptop application submitted successfully',
      applicationId: nextId,
      data: {
        id: nextId,
        brand: newApplication.brand,
        model: newApplication.model,
        image_url: image_path
      }
    });

  } catch (error) {
    console.error('Error submitting laptop application:', error);
    
    // Clean up any temporary files
    if (req.file && req.file.path) {
      try {
        await unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
};

export const getLaptopApplications = async (req, res) => {
  try {
    const applications = await LaptopApplication.find().sort({ created_at: -1 });
    
    // Transform data if needed for frontend
    const transformedApplications = applications.map(app => ({
      ...app.toObject(),
      // If you need to add a separate image_url field while keeping image_path
      image_url: app.image_path // Add this if frontend expects image_url
    }));
    
    res.status(200).json({
      success: true,
      data: transformedApplications
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

// Get single application by ID
export const getLaptopApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await LaptopApplication.findOne({ id: parseInt(id) });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error fetching laptop application:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete application
export const deleteLaptopApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await LaptopApplication.findOne({ id: parseInt(id) });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Optionally: Delete from Cloudinary if you stored public_id
    if (application.cloudinary_public_id) {
      const { deleteFromCloudinary } = await import('../utils/cloudinary.js');
      await deleteFromCloudinary(application.cloudinary_public_id);
    }

    await application.remove();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting laptop application:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Export multer upload middleware
export { upload };