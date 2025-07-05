const mongoose = require('mongoose');

const tempDeleteSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  deletedAt: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    default: 'Soft delete'
  },
  deletedProduct: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

const tempDelete = mongoose.model('tempDelete', tempDeleteSchema);

module.exports = tempDelete;
