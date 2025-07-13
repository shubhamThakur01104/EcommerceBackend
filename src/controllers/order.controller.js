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
  try {
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
          path: "items.productId",
          select: "name price images"
        }
      ])
      .select("status isPaid totalAmount quantity paymentMethod createdAt");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found."
      });
    }

    return res.status(200).json({
      message: "All orders fetched successfully.",
      count: orders.length,
      orders
    });

  } catch (err) {
    console.error("Error fetching orders:", err.message);
    return res.status(500).json({
      message: "An error occurred while fetching orders.",
      error: err.message
    });
  }
};


const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate({
        path: "items.productId",
        select: "name images colors sizes price"
      })
      .select("items.quantity items.totalPrice totalAmount quantity paymentMethod status isPaid userId createdAt");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Authorization check
    if (
      order.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Forbidden: You are not allowed to access this order."
      });
    }

    return res.status(200).json({
      message: "Order retrieved successfully.",
      order
    });

  } catch (err) {
    console.error("getOrderById error:", err);
    return res.status(500).json({
      message: "An error occurred while retrieving the order.",
      error: err.message
    });
  }
};


const getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .populate({
        path: "items.productId",
        select: "name price colors sizes images"
      })
      .select("items totalAmount quantity paymentMethod status isPaid createdAt");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found for this user.",
        orders: []
      });
    }

    return res.status(200).json({
      message: "Orders fetched successfully.",
      count: orders.length,
      orders
    });

  } catch (err) {
    console.error("Get user orders error:", err);
    return res.status(500).json({
      message: "An error occurred while fetching user orders.",
      error: err.message
    });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const orderId = id
    const { status } = req.body;
    // Check for missing fields
    if (!status || !orderId) {
      return res.status(400).json({ message: "Status and orderId are required." });
    }

    // Valid status values
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "canceled", "returned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values are: ${validStatuses.join(", ")}` });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json({
      message: "Order status updated successfully.",
      updatedStatus: order.status,
      orderId: order._id
    });

  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({
      message: "An error occurred while updating the order status.",
      error: err.message
    });
  }
}

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Check if user is either the admin or the one who placed the order
    if (order.userId.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: You are not allowed to cancel this order."
      });
    }

    // Update order status to "canceled"
    order.status = "canceled";
    await order.save();

    return res.status(200).json({
      message: "Order canceled successfully.",
      order
    });

  } catch (err) {
    console.error("Cancel order error:", err);
    return res.status(500).json({
      message: "An error occurred while canceling the order.",
      error: err.message
    });
  }
};


const getOrderStats = async (req, res) => {
  // Admin: Order analytics/stats
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
};
