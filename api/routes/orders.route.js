import { Router } from "express";
import { requireCustomerAuth,verifyToken} from "../middleware/auth.middleware.js";
import { getOrdersByUserId, createOrder } from "../crud/orders.js"; 

const router = Router();

// POST endpoint for creating a new order
router.post('/orders', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { totalAmount, paymentMethod, items } = req.body;

    // Validate input
    if (!totalAmount || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    // Validate each item
    for (const item of items) {
      if (!item.type || !item.id || !item.quantity || !item.amount || !item.accessory) {
        return res.status(400).json({ success: false, message: 'Invalid item data' });
      }
    }

    const result = await createOrder(userId, totalAmount, paymentMethod, items);
    if (!result.success) {
      return res.status(500).json({ success: false, message: result.message });
    }

    return res.status(201).json({ success: true, orderId: result.orderId });
  } catch (error) {
    console.error('Error processing order:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET endpoint for all orders (myorders)
router.get('/myorders', requireCustomerAuth, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const orders = await getOrdersByUserId(userId);
    res.json(orders); // Returns plain array for consistency with provided code
  } catch (error) {
    console.error('Error in /api/myorders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET endpoint for single order by ID
router.get('/orders/:orderId', verifyToken, async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const orderId = req.params.orderId;
    const orders = await getOrdersByUserId(userId);
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order }); // Wrapped for consistency
  } catch (error) {
    console.error('Error in /api/orders/:orderId:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
export default router;