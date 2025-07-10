// routes/cart.routes.js

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const tokenVerification = require("../middlewares/auth.middleware");

// Add routes here
router.post("/add", tokenVerification, cartController.addToCart);
router.get("/", cartController.getCart);
router.put("/remove/:productId", cartController.removeFromCart);
router.put("/clear", cartController.clearCart);

module.exports = router;
