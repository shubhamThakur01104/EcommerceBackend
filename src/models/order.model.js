const mongoose = require('mongoose')

const orderScheam = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        }
    }],
    shippingAddress: [{
        phoneNumber: {
            type: String,
            required: true,
            trim: true
        },
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        postalCode: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true,
            default: 'India'
        },
        addressType: {
            type: String,
            enum: ['Home', 'Office', 'Other'],
            default: 'Home'
        },
        isDefault: {
            type: Boolean,
            default: false
        },
    }],
    paymentMethod: {
        tye: String,
        enum: ['Cash on Delivery', 'UPI', 'Net Banking', 'Credit Card', 'Debit Card'],
        default: 'Cash on Delivery',
        required: true
    },
    itemsPrice: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    },
    shippingPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date,
        default: Date.now(),

    },
    deliveryStatus: {
        type: String,
        enum: [
            'Pending',           // Order placed but not yet processed
            'Processing',        // Preparing for shipment
            'Shipped',           // Dispatched by courier
            'On the way',        // On the way
            'Out for Delivery',  // Near destination
            'Delivered',         // Successfully delivered
            'Cancelled',         // Cancelled by user or admin
            'Returned',          // Returned by customer
            'Failed'             // Delivery failed (address issue, not available, etc.)
        ],
        default: 'Pending'
    }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", orderScheam)

module.exports = Order