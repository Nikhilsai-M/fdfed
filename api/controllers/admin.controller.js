import PhoneApplication from '../models/phoneApplication.model.js';
import LaptopApplication from '../models/laptopApplication.model.js';
import Charger from '../models/charger.model.js';
import Earphone from '../models/earphone.model.js';
import Mouse from '../models/mouse.model.js';
import Smartwatch from '../models/smartwatch.model.js';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from '../utils/error.js';


import Order from '../models/order.model.js';
import OrderItem from '../models/orderitem.model.js';
import { Supervisor } from '../models/supervisor.model.js';
import bcrypt from 'bcryptjs';
import { getAllSupervisors, deleteSupervisor } from '../crud/supervisors.js'; 

export const getStatistics = async (req, res) => {
 try {
 const now = new Date();
 const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
 const paidOrderMatch = { payment_status: "success" };


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
    
    const [paidOrders, prevPaidOrders] = await Promise.all([
      Order.find(paidOrderMatch).select({ order_id: 1, total_amount: 1, created_at: 1 }).lean(),
      Order.find({
        ...paidOrderMatch,
        created_at: { $lte: oneWeekAgo }
      }).select({ order_id: 1, total_amount: 1 }).lean(),
    ]);

    const paidOrderIds = paidOrders.map((order) => order.order_id);
    const paidOrderItems = paidOrderIds.length
      ? await OrderItem.find({ order_id: { $in: paidOrderIds } }).lean()
      : [];

    const totalSales = paidOrderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const prevWeekStart = new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
    const currentWeekOrderIds = paidOrders
      .filter((order) => order.created_at >= oneWeekAgo)
      .map((order) => order.order_id);
    const previousWeekOrderIds = paidOrders
      .filter((order) => order.created_at >= prevWeekStart && order.created_at < oneWeekAgo)
      .map((order) => order.order_id);

    const [currentWeekItems, previousWeekItems] = await Promise.all([
      currentWeekOrderIds.length ? OrderItem.find({ order_id: { $in: currentWeekOrderIds } }).lean() : [],
      previousWeekOrderIds.length ? OrderItem.find({ order_id: { $in: previousWeekOrderIds } }).lean() : [],
    ]);

    const prevTotalSales = previousWeekItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const salesByCategory = paidOrderItems.reduce((acc, item) => {
      const quantity = item.quantity || 0;
      if (item.item_type === 'phone') acc.phones += quantity;
      else if (item.item_type === 'laptop') acc.laptops += quantity;
      else if (item.item_type === 'charger') acc.chargers += quantity;
      else if (item.item_type === 'earphone') acc.earphones += quantity;
      else if (item.item_type === 'mouse') acc.mouses += quantity;
      else if (item.item_type === 'smartwatch') acc.smartwatches += quantity;
      return acc;
    }, {
      phones: 0,
      laptops: 0,
      chargers: 0,
      earphones: 0,
      mouses: 0,
      smartwatches: 0,
    });

    const totalSalesRevenue = paidOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const prevTotalSalesRevenue = prevPaidOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

 
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
