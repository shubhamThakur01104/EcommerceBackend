// controllers/cart.controller.js

const Cart = require("../models/cart.model");
const Product = require('../models/product.model')


exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        console.log("Welcome to add to cart page");
        

        // 1. Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const productPrice = product.price;

        // 2. Check if user already has a cart
        let cart = await Cart.findOne({ userId });

        // 3. If no cart exists, create one
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{
                    productId,
                    quantity,
                    totalPrice: productPrice * quantity,
                }],
            });

            return res.status(201).json({
                message: "Cart created and product added successfully.",
                cart,
            });
        }

        // 4. Check if product already exists in the cart
        const existingProduct = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingProduct) {
            // If it exists, increase quantity and update total price
            existingProduct.quantity += quantity;
            existingProduct.totalPrice = productPrice * existingProduct.quantity;
        } else {
            // If not, push new product
            cart.items.push({
                productId,
                quantity,
                totalPrice: productPrice * quantity,
            });
        }

        // 5. Save the updated cart
        await cart.save();

        return res.status(200).json({
            message: existingProduct
                ? "Product quantity updated in cart."
                : "Product added to cart successfully.",
            cart,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.getCart = async (req, res) => {
    // Logic to get user's cart
    try {
        const userId = req.user.id

        const { productId } = req.params


        const cart = await Cart.findOne({ userId }).populate({
            path: "items",
            populate: {
                path: "productId"
            }
        })

        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: "Cart is empty." });
        }

        if (productId) {
            const product = cart.items.find((item) => item.productId.toString() === productId)

            if (!product) {
                return res.status(404).json({ message: "Product not found in cart." });
            }
            return res.status(200).json({ product })
        }

        return res.status(200).json({ cart })

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
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
