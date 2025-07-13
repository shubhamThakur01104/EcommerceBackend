const Order = require("../models/order.model");
const User = require('../models/user.model')
const Address = require("../models/address.model")
const Product = require("../models/order.model")

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      contactNo,
      streetNo,
      city,
      state,
      postalCode,
      country,
      addressType,
      isDefault = false,
      status = "pending",
      isPaid = false,
      paymentMethod
    } = req.body;

    // 1. Find user and populate cart
    const user = await User.findById(userId).populate('cart');
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid user." });
    }

    const cart = user.cart;
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // 2. Calculate totals
    const productItems = cart.items;
    const totalAmount = productItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
    const totalQuantity = productItems.reduce((acc, curr) => acc + curr.quantity, 0);

    // 3. Check if address already exists
    if (
      !contactNo ||
      !streetNo ||
      !city ||
      !state ||
      !postalCode ||
      !country ||
      !addressType ||
      typeof isDefault === 'undefined' ||
      !status ||
      typeof isPaid === 'undefined' ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    let shippingAddress = await Address.findOne({
      userId,
      streetNo,
      postalCode,
      addressType
    });

    if (!shippingAddress) {
      shippingAddress = await Address.create({
        userId,
        contactNo,
        streetNo,
        city: city.toLowerCase(),
        state: state.toLowerCase(),
        postalCode,
        country: country.toLowerCase(),
        addressType,
        isDefault,
      });


      // Save reference to user's address list
      await User.findByIdAndUpdate(
        userId,
        { $push: { address: shippingAddress._id } }, // make sure user model has "address" field (array of ObjectId)
        { new: true }
      );
    }
    else {
      shippingAddress = await User.findById(userId).populate('address')
    }
    // 4. Create the order
    const order = await Order.create({
      userId,
      items: productItems,
      shippingAddress: shippingAddress,
      totalAmount,
      quantity: totalQuantity,
      paymentMethod,
      status,
      isPaid
    });

    if (order) {
      await Product.findByIdAndUpdate(

      )
    }

    // 5. Update user's order history
    await User.findByIdAndUpdate(
      userId,
      { $push: { orderHistory: order._id } },
      { cart: null },
      { new: true }
    );

    return res.status(201).json({
      message: "Order placed successfully.",
      order
    });



  } catch (err) {
    console.error("Create Order Error:", err);
    return res.status(500).json({ message: err.message });
  }
};



const getAllOrders = async (req, res) => {
  // Admin: Get all orders
  try {
    const userId = req.user.id

    const orders = await Order.find()
      .populate([
        {
          path: "userId",
          select: "name email"
        },
        {
          path: "shippingAddress",
          select: "streetNo city state postalCode country"
        },
        {
          path: "items.productId", // nested population
          select: "name price quantity"
        }
      ])
      .select("status isPaid totalAmount quantity paymentMethod createdAt");

    console.log(orders);

  }
  catch (err) {
    return res.status(400).json({ message: "" })
  }
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
