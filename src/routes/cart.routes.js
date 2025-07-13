// routes/cart.routes.js

const express = require("express");
const router = express.Router();
const { getCart, removeFromCart, addToCart, clearCart } = require("../controllers/cart.controller");
const tokenVerification = require("../middlewares/auth.middleware");

// Add routes here
router.post("/add", tokenVerification, addToCart);
router.get("/getproducts", tokenVerification, getCart);
router.patch("/remove", tokenVerification, removeFromCart);
router.patch("/clear", tokenVerification, clearCart);

module.exports = router;
