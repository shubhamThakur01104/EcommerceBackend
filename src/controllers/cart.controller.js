const Cart = require("../models/cart.model");
const User = require("../models/user.model")

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, totalPrice } = req.body;

        // Validate input
        if (!productId || !quantity || !totalPrice) {
            return res.status(400).json({
                message: "Product ID, quantity, and totalPrice are required."
            });
        }

        let user = await User.findById(userId).populate("cart")

        let cart = user.cart


        // If no cart exists, create one
        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{ productId, quantity, totalPrice }]
            });
            await User.findByIdAndUpdate(userId, { cart: cart._id }, { new: true });
            return res.status(201).json({
                message: "Cart created and product added successfully.",
                cart
            });
        }


        // If cart exists, check if the product already exists
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity = quantity;
            existingItem.totalPrice = totalPrice;
        } else {
            cart.items.push({ productId, quantity, totalPrice });
        }

        await cart.save();

        return res.status(200).json({
            message: existingItem
                ? "Product quantity updated in cart."
                : "Product added to cart.",
            cart,
        });

    } catch (err) {
        console.error("Add to cart error:", err);
        return res.status(500).json({
            message: "An error occurred while adding to cart.",
            error: err.message
        });
    }
};


const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            select: ["name", "price", "images"]
        });

        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: "Cart is empty." });
        }

        const cartItems = cart.items;
        const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
        const totalPrice = cartItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

        return res.status(200).json({
            message: "Cart data fetched successfully.",
            cartItems,
            totalQuantity,
            totalPrice,
        });


    } catch (err) {
        console.error("Get cart error:", err);
        return res.status(500).json({
            message: "An error occurred while fetching cart.",
            error: err.message
        });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        const cart = await Cart.findByIdAndUpdate(
            userId,
            { $pull: { items: { productId } } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            userId,
            {
                $pull: { cart: cart._id }
            },
            {
                new: true
            }
        )

        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        const totalQuantity = cart.items.reduce((acc, curr) => acc + curr.quantity, 0);
        const totalPrice = cart.items.reduce((acc, curr) => acc + curr.totalPrice, 0);

        return res.status(200).json({
            message: "Product removed from cart successfully.",
            cart,
            totalQuantity,
            totalPrice
        });

    } catch (err) {
        console.error("Remove from cart error:", err);
        return res.status(500).json({
            message: "An error occurred while removing the product from cart.",
            error: err.message
        });
    }
};


const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        cart.items = [];
        await cart.save();

        return res.status(200).json({ message: "Cart cleared successfully." });

    } catch (err) {
        console.error("Clear cart error:", err);
        return res.status(500).json({
            message: "An error occurred while clearing the cart.",
            error: err.message
        });
    }
};

module.exports = {
    getCart,
    removeFromCart,
    addToCart,
    clearCart
}