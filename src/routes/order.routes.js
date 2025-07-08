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

// USER ROUTES
router.post('/order', tokenVerification, createOrder);
router.get('/order/user/:userId', tokenVerification, getOrdersByUserId);
router.get('/order/:id', tokenVerification, getOrderById);
router.post('/order/:id/review', tokenVerification, addOrderReview);

// ADMIN ROUTES
router.get('/order', tokenVerification, checkRole, getAllOrders);
router.patch('/order/:id/status', tokenVerification, checkRole, updateOrderStatus);
router.delete('/order/:id', tokenVerification, checkRole, deleteOrder);
router.get('/order/stats', tokenVerification, checkRole, getOrderStats);

module.exports = router;
