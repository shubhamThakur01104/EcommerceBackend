// routes/cart.routes.js

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Add routes here
router.post("/add", cartController.addToCart);
router.get("/", cartController.getCart);
router.put("/remove/:productId", cartController.removeFromCart);
router.put("/clear", cartController.clearCart);

module.exports = router;
