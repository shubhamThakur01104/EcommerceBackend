const { default: mongoose } = require('mongoose');
const User = require('../models/order.model')

const createOrder = async (req, res) => {
  // Logic to create a new order
  const userId = req.user.id
  const { phoneNumber, street, city, state, postalCode, country, addressType, isDefault, paymentMethod, itemPrice, taxPrice, shippingPrice, totalPrice, isPaid, deliveryStatus, productId } = req.body

  const user = await Order.findOne({ userId })
  if (!user) {
    return res.status(404).json({ message: "User does not exist." });
  }

  const product = await Order.findOne({userId}).populate('orderItems.productId')

  if(!product){
    return res.status(404).json({message: "Product does not exist."})
  }




};

const getAllOrders = async (req, res) => {
  // Admin: Get all orders
};

const getOrderById = async (req, res) => {
  // Get a single order by ID
};

const getOrdersByUserId = async (req, res) => {
  // Get all orders placed by a specific user
};

const updateOrderStatus = async (req, res) => {
  // Admin: Update order delivery/payment status
};

const deleteOrder = async (req, res) => {
  // Admin: Delete/cancel order
};

const getOrderStats = async (req, res) => {
  // Admin: Order analytics/stats
};

const addOrderReview = async (req, res) => {
  // User: Review an order or products in the order
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  addOrderReview
};
