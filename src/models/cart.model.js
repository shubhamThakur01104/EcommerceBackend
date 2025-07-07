const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ],
addedAt: {
    type: Date,
        default: Date.now(),
    },
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart