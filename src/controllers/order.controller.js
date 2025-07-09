const { default: mongoose } = require('mongoose');
const User = require('../models/order.model')

// controllers/order.controller.js

const Cart = require("../models/Cart");
const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: Find user's cart and populate product details
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Step 2: Calculate total
    let totalAmount = 0;
    cart.items.forEach((item) => {
      const productPrice = item.productId.price; // assumes price exists
      totalAmount += productPrice * item.quantity;
    });

    // Step 3: Create order
    const order = await Order.create({
      userId,
      items: cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      totalAmount,
    });

    // Step 4: Clear the cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({ message: "Order placed successfully.", order });

  } catch (err) {
    return res.status(500).json({ message: err.message });
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
