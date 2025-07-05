const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');

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
        type: [String],
        required: true,
        default: [],
        enum: ['red', 'blue', 'black', 'white', 'green', 'yellow', 'gray'],
    },

    sizes: {
        type: [String],
        required: true,
        default: [],
        enum: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    },
    numReviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reviews'
    },
    _id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    productDelete: {
        type: String,
        enum: ["temporary", "permanent", "all"]
    },

})

const Product = mongoose.model('Product', productSchema)

module.exports = Product