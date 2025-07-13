const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  addOrderReview
} = require('../controllers/order.controller');

const tokenVerification = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');

// ==================== USER ROUTES ====================

// Create a new order
router.post('/user', tokenVerification, createOrder);

// Get all orders of the logged-in user
router.get('/user/my-orders', tokenVerification, getOrdersByUserId);



// ==================== SHARED ROUTES (Admin + Order Owner) ====================

// Get a specific order by ID (admin or user who placed the order)
router.get('/getorder/:id', tokenVerification, getOrderById);

// Cancel/delete an order (admin or user who placed it)
router.delete('/cancel/:id', tokenVerification, deleteOrder);


// ==================== ADMIN ROUTES ====================

// Get all orders (Admin only)
router.get('/admin/all-orders', tokenVerification, checkRole, getAllOrders);

// Update order status (Admin only)
router.patch('/admin/:id/status', tokenVerification, checkRole, updateOrderStatus);

// Get order statistics (Admin only)
router.get('/admin/stats', tokenVerification, checkRole, getOrderStats);

module.exports = router;
