import PhoneApplication from '../models/phoneApplication.model.js';
import LaptopApplication from '../models/laptopApplication.model.js';
import Charger from '../models/charger.model.js';
import Earphone from '../models/earphone.model.js';
import Mouse from '../models/mouse.model.js';
import Smartwatch from '../models/smartwatch.model.js';
// 💰 Import the Order model for revenue calculation

import Order from '../models/order.model.js';
import { Supervisor } from '../models/supervisor.model.js';
import bcrypt from 'bcryptjs';
import { getAllSupervisors, deleteSupervisor } from '../crud/supervisors.js'; 

export const getStatistics = async (req, res) => {
 try {
 const now = new Date();
 const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

// Helper function to calculate week-over-week trend
const calculateTrend = (current, previous) => {
   if (previous === 0) return current > 0 ? 100 : 0;
return parseFloat(((current - previous) / previous * 100).toFixed(2));
 };

 // --- 1. INVENTORY / LISTING METRICS (Using Application/Accessory Counts) ---
    
 // Total Listings (Submitted Applications)
 const [totalListings, prevTotalListings] = await Promise.all([
 Promise.all([
 PhoneApplication.countDocuments(),
 LaptopApplication.countDocuments(),
 ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
 Promise.all([
 PhoneApplication.countDocuments({ createdAt: { $lte: oneWeekAgo } }),
 LaptopApplication.countDocuments({ createdAt: { $lte: oneWeekAgo } }),
 ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
 ]);

 // Approved Listings (Card - Only Approved Phones/Laptops)
 const [approvedListings, prevApprovedListings] = await Promise.all([
 Promise.all([
 PhoneApplication.countDocuments({ status: 'approved' }),
 LaptopApplication.countDocuments({ status: 'approved' }),
 ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
      Promise.all([
        PhoneApplication.countDocuments({ status: 'approved', createdAt: { $lte: oneWeekAgo } }),
        LaptopApplication.countDocuments({ status: 'approved', createdAt: { $lte: oneWeekAgo } }),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
    ]);
    
    // Total Sales (Inventory Items - Total approved inventory count across ALL categories)
    const [totalSales, prevTotalSales] = await Promise.all([
      Promise.all([
        PhoneApplication.countDocuments({ status: 'approved' }),
        LaptopApplication.countDocuments({ status: 'approved' }),
        Charger.countDocuments(),
        Earphone.countDocuments(),
        Mouse.countDocuments(),
        Smartwatch.countDocuments(),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
      Promise.all([
        PhoneApplication.countDocuments({ status: 'approved', createdAt: { $lte: oneWeekAgo } }),
        LaptopApplication.countDocuments({ status: 'approved', createdAt: { $lte: oneWeekAgo } }),
        Charger.countDocuments({ createdAt: { $lte: oneWeekAgo } }),
        Earphone.countDocuments({ createdAt: { $lte: oneWeekAgo } }),
        Mouse.countDocuments({ createdAt: { $lte: oneWeekAgo } }),
        Smartwatch.countDocuments({ createdAt: { $lte: oneWeekAgo } }),
      ]).then(counts => counts.reduce((sum, count) => sum + count, 0)),
    ]);

    // Sales by Category (Chart Data - Same approved inventory counts)
    const salesByCategory = await Promise.all([
      PhoneApplication.countDocuments({ status: 'approved' }),
      LaptopApplication.countDocuments({ status: 'approved' }),
      Charger.countDocuments(),
      Earphone.countDocuments(),
      Mouse.countDocuments(),
      Smartwatch.countDocuments(),
    ]).then(counts => ({
      phones: counts[0],
      laptops: counts[1],
      chargers: counts[2],
      earphones: counts[3],
      mouses: counts[4],
      smartwatches: counts[5],
 }));

 // --- 2. FINANCIAL METRIC (Sales Revenue from Order Model) ---

    // Total Sales Revenue (Card - ACTUAL money generated from completed orders)
    const [orders, prevOrders] = await Promise.all([
        // Calculate total sales revenue (All time)
        Order.aggregate([
            { $group: { _id: null, total: { $sum: '$total_amount' } } },
        ]),
        // Calculate previous week's sales revenue
        Order.aggregate([
            { $match: { createdAt: { $lte: oneWeekAgo } } }, 
            { $group: { _id: null, total: { $sum: '$total_amount' } } },
        ]),
    ]);

    const totalSalesRevenue = orders[0]?.total || 0;
    const prevTotalSalesRevenue = prevOrders[0]?.total || 0;

 // Build response
 const statistics = {
totalListings,
 approvedListings,
totalSales,
 totalSalesRevenue, // Pulled from Order Model
 salesByCategory, // Pulled from Approved/Accessory Models
 trends: {
 totalListings: calculateTrend(totalListings, prevTotalListings),
 approvedListings: calculateTrend(approvedListings, prevApprovedListings),
 totalSales: calculateTrend(totalSales, prevTotalSales),
 totalSalesRevenue: calculateTrend(totalSalesRevenue, prevTotalSalesRevenue),
 },
 };

 res.json({ success: true, statistics });
 } catch (error) {
 console.error('Statistics Error:', error);
 res.status(500).json({ success: false, message: error.message });
}
};

// Add new supervisor
export const addSupervisor = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, username, password } = req.body;
    const userId = `supervisor_${Date.now()}`;
    
    console.log('Creating new supervisor:', { firstName, lastName, email, username });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newSupervisor = await Supervisor.create({
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase().trim(),
      phone,
      username: username.trim(),
      password: hashedPassword,
      role: 'supervisor', // Explicitly set role
      created_at: new Date(),
    });
    
    console.log('Supervisor created successfully:', {
      user_id: newSupervisor.user_id,
      username: newSupervisor.username,
      email: newSupervisor.email,
      role: newSupervisor.role
    });
    
    res.json({ success: true, message: 'Supervisor added successfully' });
  } catch (error) {
    console.error('Error adding supervisor:', error);
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ 
        success: false, 
        message: `${field} already exists` 
      });
    } else {
      res.status(500).json({ success: false, message: 'Failed to add supervisor' });
    }
  }
};

// Get all supervisors
export const getSupervisors = async (req, res) => {
  try {
    const supervisors = await getAllSupervisors();
    res.json({ success: true, supervisors });
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch supervisors' });
  }
};

// Delete supervisor
export const removeSupervisor = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await deleteSupervisor(userId);
    if (result.success) {
      res.json({ success: true, message: 'Supervisor deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Supervisor not found' });
    }
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    res.status(500).json({ success: false, message: 'Failed to delete supervisor' });
  }
};