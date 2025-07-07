const Cart = require("../models/cart.model");
const mongoose = require('mongoose');

const addCartItems = async (req, res) => {
    try {
        
        const userId = req.user.userId
        const productId = req.body

        const user = await Cart.find({userId})
        
        console.log(user);
        



    } catch (err) {
        console.error("Add Cart Error:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    addCartItems
}