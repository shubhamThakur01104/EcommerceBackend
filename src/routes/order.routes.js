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
router.route('/user/')
  .post(tokenVerification, createOrder);

// Get all orders of the logged-in user
router.route('/user/my-orders')
  .get(tokenVerification, getOrdersByUserId);

// Get a specific order by ID (only for owner)
router.route('/user/:id')
  .get(tokenVerification, getOrderById);

// Add review for a specific order
router.route('/user/:id/review')
  .post(tokenVerification, addOrderReview);


// ==================== ADMIN ROUTES ====================

// Get all orders (Admin only)
router.route('/admin/all')
  .get(tokenVerification, checkRole, getAllOrders);

// Update order status (Admin only)
router.route('/admin/:id/status')
  .patch(tokenVerification, checkRole, updateOrderStatus);

// Delete an order (Admin only)
router.route('/admin/:id')
  .delete(tokenVerification, checkRole, deleteOrder);

// Get order statistics (Admin only)
router.route('/admin/stats/data')
  .get(tokenVerification, checkRole, getOrderStats);

module.exports = router;
