const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        defautl: 0,
        min: 0
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    stockAmount: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    images: [{
        type: String,
    }],

    category: {
        type: String,
        required: true,
        enum: ['clothing', 'shoes', 'books', 'furniture'],
        lowercase: true,
        trim: true
    },
    colors: {
        type: String,
        required: true,
        trim: true,
        enum: ['red', 'blue', 'black', 'white', 'green', 'yellow', 'gray'],
    },

    sizes: {
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL', 'FREE SIZE'],
        trim: true
    },
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    productDelete: {
        type: String,
        enum: ["temporary", "permanent"]
    },

}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product