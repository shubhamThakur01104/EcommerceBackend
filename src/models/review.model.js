const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    comment : {
        type: String,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },

},{
    timestamps: true,
})

const Review = mongoose.model("Review", reviewSchema)

module.exports = Review