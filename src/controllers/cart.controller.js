// controllers/cart.controller.js

const Cart = require("../models/cart.model");
const Product = require('../models/product.model')


exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, totalPrice } = req.body;

        // 1. Check if the user already has a cart
        let cart = await Cart.findOne({ userId });

        // 2. If no cart, create a new one
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

        // 3. Check if product already exists in cart
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            // Update quantity and total price
            existingItem.quantity = quantity;
            existingItem.totalPrice = totalPrice;
        } else {
            // Push new item
            cart.items.push({ productId, quantity, totalPrice });
        }

        await cart.save();

        return res.status(200).json({
            message: existingItem
                ? "Product quantity updated in cart."
                : "Product added to cart.",
            cart
        });

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
    const user = await Cart.findOne({ userId: userId }).populate('items.productId', 'name price images')

    if (!user || user.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty. " })
    }
    const cartItems = user.items.map((item) => item.productId)
    return res.status(200).json({ message: "Cart Data", cartItems })

};


exports.removeFromCart = async (req, res) => {
    const userId = req.user.id

    const { productId } = req.body


    const cartProducts = await Cart.findOne({ userId: userId })

    if (!cartProducts) {
        return res.status(204).json({ message: "User or cart do not exist ." })
    }

    else {
        const isProductExist = cartProduct.items.find((ele) => ele.productId.toString() === productId)
        if (!isProductExist) return res.status(404).json({ message: "Product is not exist" })
        const products = cartProducts.items.filter((ele) => ele.productId.toString() !== productId)
        await products.save()

        const quantity = cartProducts.items.reduce((curr, acc) => curr.quantity + acc, 0)

        return res.status(200).json({ message: "Product removed successfully", products, quantity })

    }

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
