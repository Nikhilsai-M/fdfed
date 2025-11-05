import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getOrdersByUserId, createOrder } from "../crud/orders.js";

const router = Router();

// ✅ POST: Create new order
router.post('/orders', verifyToken, async (req, res) => {
  try {
    // ✅ Use user_id from JWT payload
    const userId = req.user.user_id;
    const { totalAmount, paymentMethod, items } = req.body;

    if (!totalAmount || !paymentMethod || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order data' });
    }

    // Validate each item
    for (const item of items) {
      if (!item.type || !item.id || !item.quantity || !item.amount || !item.accessory) {
        return res.status(400).json({ success: false, message: 'Invalid item data' });
      }
    }

    // ✅ Create order
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

// ✅ GET: My Orders
router.get('/myorders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const orders = await getOrdersByUserId(userId);
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error in /api/myorders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ GET: Single Order
router.get('/orders/:orderId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const orderId = req.params.orderId;

    const orders = await getOrdersByUserId(userId);
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error in /api/orders/:orderId:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/buy/:type/:id', verifyToken, async (req, res) => {
  try {
    const accessoryType = req.params.type.toLowerCase();
    const accessoryId = req.params.id;
    const userId = req.user.userId;

    const fetchFunctions = {
      earphone: getEarphonesById,
      charger: getChargerById,
      mouse: getMouseById,
      smartwatch: getSmartwatchById,
      product: getPhoneById,
      laptop: getLaptopById,
    };

    if (!fetchFunctions[accessoryType]) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid accessory type' 
      });
    }
    
    const fetchFunction = fetchFunctions[accessoryType];
    const accessory = await fetchFunction(accessoryId);
    
    if (!accessory) {
      return res.status(404).json({ 
        success: false,
        error: `${accessoryType} not found` 
      });
    }

    const basePrice = accessory.pricing.originalPrice || accessory.pricing.basePrice;
    const finalPrice = parseFloat(basePrice) - parseFloat(basePrice) * (parseFloat(accessory.pricing.discount) / 100);

    res.json({
      success: true,
      paymentData: {
        price: finalPrice,
        type: accessoryType,
        id: accessoryId,
        accessory: accessory,
        userId: userId,
      }
    });
  } catch (error) {
    console.error(`Error processing buy request for ${req.params.type}:`, error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process payment request' 
    });
  }
});

export default router;
