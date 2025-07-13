const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderItemSchema], // Copy of items from cart at time of order
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    totalAmount: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        default: "COD"
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "canceled", "returned"],
        default: "pending"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
