// routes/cart.routes.js

const express = require("express");
const router = express.Router();
const { getCart, removeFromCart, addToCart, clearCart } = require("../controllers/cart.controller");
const tokenVerification = require("../middlewares/auth.middleware");
const isTokenBlacklisted = require('../middlewares/logout.middleware')

// Add routes here
router.post("/add", tokenVerification,isTokenBlacklisted, addToCart);
router.get("/getproducts", tokenVerification,isTokenBlacklisted, getCart);
router.patch("/remove", tokenVerification,isTokenBlacklisted, removeFromCart);
router.patch("/clear", tokenVerification,isTokenBlacklisted, clearCart);

module.exports = router;
