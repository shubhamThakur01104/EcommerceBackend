const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/order.controller');

const tokenVerification = require('../middlewares/auth.middleware');
const isTokenBlacklisted = require('../middlewares/logout.middleware')
const checkRole = require('../middlewares/role.middleware');

// ==================== USER ROUTES ====================

// Create a new order
router.post('/user', tokenVerification, isTokenBlacklisted, createOrder);

// Get all orders of the logged-in user
router.get('/user/my-orders', tokenVerification, isTokenBlacklisted, getOrdersByUserId);

// Cancel/delete an order (user who placed it)
router.delete('/user/deletehistory', tokenVerification, isTokenBlacklisted, deleteOrder);



// ==================== SHARED ROUTES (Admin + Order Owner) ====================

// Get a specific order by ID (admin or user who placed the order)
router.get('/getorder/:id', tokenVerification, isTokenBlacklisted, getOrderById);



// ==================== ADMIN ROUTES ====================

// Get all orders (Admin only)
router.get('/admin/all-orders', tokenVerification, isTokenBlacklisted, checkRole, getAllOrders);

// Update order status (Admin only)
router.patch('/admin/:id/status', tokenVerification, isTokenBlacklisted, checkRole, updateOrderStatus);



module.exports = router;
