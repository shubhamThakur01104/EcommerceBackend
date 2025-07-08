const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true, // Optional: standardize code format
    unique: true // Optional: to avoid duplicate codes
  },
  discountValue: {
    type: Number,
    required: true
  },
  minOrderAmount: {
    type: Number,
    required: true
  },
  maxDiscountAmount: {
    type: Number,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  }
});

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
