const Cart = require("../models/cart.model");

const getCartItems = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get cart with populated product details
        const cart = await Cart.findOne({ userId }).populate("items.productId", "name price colors sizes");

        // 2. Check if cart exists
        if (!cart) {
            return res.status(404).json({ message: "Cart does not exist." });
        }

        // 3. Check if cart is empty
        if (cart.items.length === 0) {
            return res.status(200).json({ message: "Cart is empty." });
        }

        // 4. Optional: Filter by productId if provided in body
        const { productId } = req.body;

        if (productId) {
            const filteredItems = cart.items.filter(item =>
                item.productId._id.toString() === productId
            );

            return res.status(200).json({
                message: "Filtered cart item(s)",
                cartItems: filteredItems
            });
        }

        // 5. Otherwise return all items
        return res.status(200).json({
            message: "All cart items",
            cartItems: cart.items
        });

    } catch (err) {
        console.error("Cart retrieval error:", err.message);
        return res.status(500).json({ message: "Error while getting cart items." });
    }
};


const addCartItems = async (req, res) => {
    try {
        const userId = req.user.id
        const { productId } = req.body

        let cart = await Cart.findOne({ userId })

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{ productId }]
            })
            return res.status(201).json({ message: "Successfully cart created and Item added", cart })
        }
        else {
            let existItem = cart.items.some((item) => item.productId.toString() === productId)

            if (existItem) {
                return res.status(409).json({ message: "Item is already exist in cart" })
            }
            else {
                cart.items.push({ productId })
                await cart.save()

                return res.status(200).json({ message: "Product added to cart successfully" })
            }
        }
    }
    catch (err) {
        console.error(err.message)
        return res.status(500).json({ message: "Error while adding prdouct add to cart." })
    }
}

const deleteCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart does not exist." });
        }

        if (cart.items.length === 0) {
            return res.status(200).json({ message: "Cart is empty." });
        }

        // Remove the item from cart
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        return res.status(200).json({ message: "Item removed successfully." });
    } catch (err) {
        console.error("Error deleting cart item:", err.message);
        return res.status(500).json({ message: "Something went wrong while removing item from cart." });
    }
};


module.exports = {
    getCartItems,
    addCartItems,
    deleteCartItems
}