// controllers/cart.controller.js

const Cart = require("../models/cart.model");
const Product = require('../models/product.model')


exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1, totalPrice , increment , decrement } = req.body;

        // 1. Check if the user already has a cart
        let cart = await Cart.findOne({ userId });


        // 2. If no cart, create one with the product
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{ productId, quantity, totalPrice }]
            });
            return res.status(201).json({
                message: "Cart created and product added successfully.",
                cart
            });
        }

        // 3. If cart exists, check if product already in cart
        const existingProduct = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (existingProduct) {
            existingProduct.quantity += quantity;
            await cart.save();
            return res.status(200).json({
                message: "Product quantity updated in cart.",
                cart
            });
        } else {
            cart.items.push({ productId, quantity });
            await cart.save();
            return res.status(200).json({
                message: "Product added to cart.",
                cart
            });
        }

    } catch (err) {
        return res.status(500).json({
            message: "An error occurred while adding to cart.",
            error: err.message
        });
    }
};


exports.getCart = async (req, res) => {
    // Logic to get user's cart
    const userId = req.user.id
    const { productId } = req.body

    const user = await Product.findOne({ userId })

    console.log(user);

    if (!user || user.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty." })
    }


};


exports.removeFromCart = async (req, res) => {
    const { productId } = req.params

    const product = await Cart.findByIdAndUpdate({})
}


exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        cart.items = []; // Clear all items
        await cart.save(); // Save changes

        return res.status(200).json({ message: "Cart cleared successfully." });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
