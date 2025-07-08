const express = require('express')

const { addCartItems, getCartItems, deleteCartItems } = require('../controllers/cart.controller')
const tokenVerification = require('../middlewares/auth.middleware')

const router = express.Router()

router.route('/items').get(tokenVerification, getCartItems).post(tokenVerification, addCartItems)

router.route('/items/:id').delete(tokenVerification, deleteCartItems)

module.exports = router