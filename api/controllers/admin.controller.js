import PhoneApplication from '../models/phoneApplication.model.js';
import LaptopApplication from '../models/laptopApplication.model.js';
import Charger from '../models/charger.model.js';
import Earphone from '../models/earphone.model.js';
import Mouse from '../models/mouse.model.js';
import Smartwatch from '../models/smartwatch.model.js';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from '../utils/error.js';


import Order from '../models/order.model.js';
import { Supervisor } from '../models/supervisor.model.js';
import bcrypt from 'bcryptjs';
import { getAllSupervisors, deleteSupervisor } from '../crud/supervisors.js'; 

export const getStatistics = async (req, res) => {
 try {
 const now = new Date();
 const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);


const calculateTrend = (current, previous) => {
   if (previous === 0) return current > 0 ? 100 : 0;
return parseFloat(((current - previous) / previous * 100).toFixed(2));
 };

 
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

    const [orders, prevOrders] = await Promise.all([
        
        Order.aggregate([
            { $group: { _id: null, total: { $sum: '$total_amount' } } },
        ]),
        
        Order.aggregate([
            { $match: { createdAt: { $lte: oneWeekAgo } } }, 
            { $group: { _id: null, total: { $sum: '$total_amount' } } },
        ]),
    ]);

    const totalSalesRevenue = orders[0]?.total || 0;
    const prevTotalSalesRevenue = prevOrders[0]?.total || 0;

 
 const statistics = {
totalListings,
 approvedListings,
totalSales,
 totalSalesRevenue, 
 salesByCategory, 
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

export const addSupervisor = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, username, password, type } = req.body;

    // Validate type
    if (!type || !['phone', 'laptop'].includes(type)) {
      return next(errorHandler(400, 'Supervisor type must be "phone" or "laptop"'));
    }

    // Check for duplicates
    const existing = await Supervisor.findOne({
      $or: [{ email }, { username }, { phone }]
    });
    if (existing) {
      if (existing.email === email)       return next(errorHandler(400, 'Email already in use'));
      if (existing.username === username) return next(errorHandler(400, 'Username already in use'));
      if (existing.phone === phone)       return next(errorHandler(400, 'Phone number already in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const supervisor = new Supervisor({
      user_id: `supervisor_${uuidv4().slice(0, 8)}`,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      username,
      password: hashedPassword,
      role: 'supervisor',
      type,           // ← this is what was missing
    });

    await supervisor.save();

    res.status(201).json({ success: true, message: 'Supervisor added successfully' });
  } catch (error) {
    console.error('Error adding supervisor:', error);
    if (error.code === 11000) {
      return next(errorHandler(400, 'A supervisor with that email, username, or phone already exists'));
    }
    next(errorHandler(500, 'Error adding supervisor'));
  }
};


export const getSupervisors = async (req, res) => {
  try {
    const supervisors = await getAllSupervisors();
    res.json({ success: true, supervisors });
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch supervisors' });
  }
};


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