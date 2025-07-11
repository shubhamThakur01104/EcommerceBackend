// routes/cart.routes.js

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const tokenVerification = require("../middlewares/auth.middleware");

// Add routes here
router.post("/add", tokenVerification, cartController.addToCart);
router.get("/getproducts", tokenVerification, cartController.getCart);
router.put("/remove", tokenVerification, cartController.removeFromCart);
router.put("/clear", cartController.clearCart);

module.exports = router;
